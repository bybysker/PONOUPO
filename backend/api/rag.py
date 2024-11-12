import os
from openai import OpenAI
from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from unstructured.partition.pdf import partition_pdf
from unstructured.chunking.title import chunk_by_title

from api.config import SYSTEM_PROMPT

from tqdm.auto import tqdm
from time import sleep

import logging

logger = logging.getLogger(__name__)
load_dotenv()


def parse_and_chunk_pdf(filepath: str):
    logger.info(f"Parsing and chunking PDF file: {filepath}")
    elements = partition_pdf(filepath)
    chunks = chunk_by_title(elements)
    logger.info(f"Generated {len(chunks)} chunks from PDF")
    return chunks

def get_index(pc_client: Pinecone, index_name: str):
    logger.info(f"Getting or creating index: {index_name}")
    # check if index already exists (it shouldn't if this is first time)
    if index_name not in pc_client.list_indexes().names():
        logger.info(f"Index {index_name} does not exist, creating new index")
        # if does not exist, create index
        pc_client.create_index(
            name=index_name,
            dimension=1536,
            metric='cosine',
            spec=ServerlessSpec(
                cloud="gcp",
                region="europe-west4"
            )
        )
    # connect to index
    index = pc_client.Index(index_name)
    # view index stats
    logger.info(f"index.describe_index_stats: {index.describe_index_stats()}")
    return index

def embed_str(openai_client: OpenAI, text: str, model: str="text-embedding-3-small"):
    logger.debug(f"Generating embedding for text of length {len(text)} using model {model}")
    text = text.replace("\n", " ")
    return openai_client.embeddings.create(input = [text], model=model).data[0].embedding


def embed_batch(openai_client: OpenAI, texts: list[str], model: str="text-embedding-3-small"):
    logger.debug(f"Batch embedding {len(texts)} texts using model {model}")
    return [embed_str(openai_client, text, model) for text in texts]

def populate_index(index, openai_client: OpenAI, chunks: list, user_id: str, batch_size: int=100):
    logger.info(f"Populating index with {len(chunks)} chunks using batch size {batch_size}")

    for i in tqdm(range(0, len(chunks), batch_size)):
        # find end of batch
        i_end = min(len(chunks), i+batch_size)
        chunks_batch = chunks[i:i_end]
        logger.debug(f"Processing batch {i//batch_size + 1}: chunks {i} to {i_end}")
        # get ids
        ids_batch = [x.id for x in chunks_batch]
        # get texts to encode
        texts = [x.text for x in chunks_batch]
        # create embeddings (try-except added to avoid RateLimitError)
        done = False
        while not done:
            try:
                batch_embeddings = embed_batch(openai_client, texts)
                done = True
            except Exception as e:
                logger.warning(f"Rate limit hit, sleeping for 5 seconds: {str(e)}")
                sleep(5)
        # cleanup metadata
        metadata_batch = [{
            'filename': x.metadata.to_dict()['filename'],
            'filetype': x.metadata.to_dict()['filetype'],
            'page_number': x.metadata.to_dict()['page_number'],
            'languages': x.metadata.to_dict()['languages'],
            'text': x.text,
            'user_id': user_id,
        } for x in chunks_batch]
        to_upsert = list(zip(ids_batch, batch_embeddings, metadata_batch))
        # upsert to Pinecone
        index.upsert(vectors=to_upsert)
        logger.debug(f"Upserted batch of {len(to_upsert)} vectors")

def filter_matches(matches, threshold=0.3):
    logger.debug(f"Filtering {len(matches)} matches with threshold {threshold}")
    filtered_matches = [x for x in matches if x['score'] > threshold]
    logger.debug(f"Retained {len(filtered_matches)} matches after filtering")
    return filtered_matches

def retrieve(index, openai_client: OpenAI, query: str, user_id: str, limit: int=3750) -> str:
    logger.info(f"Retrieving context for query: {query[:50]}...")
    xq = embed_str(openai_client, query)

    # get relevant contexts
    res = index.query(vector=xq, top_k=5, include_metadata=True, filter={"user_id": {"$eq":user_id}})
    filtered_matches = filter_matches(res['matches'], threshold=0.3)
    
    contexts = [
        x['metadata']['text'] for x in filtered_matches
    ]    
    logger.debug(f"Retrieved {len(contexts)} relevant contexts")

    contexts_ref = [
        f"{x['metadata']['filename']}, page: {int(x['metadata']['page_number'])}" for x in filtered_matches
    ]
    contexts_ref = contexts_ref[:3]
    contexts_ref = "  |  ".join(contexts_ref)  # Join all references with newlines

    # build our prompt with the retrieved contexts included
    prompt_start = (
        "Answer the question based on the context below.\n\n"+
        "Context:\n"
    )
    prompt_end = (
        f"\n\nQuestion: {query}\nAnswer:"
    )
    if len(contexts) == 0:
        logger.warning("No contexts found for query")
        prompt = prompt_start + prompt_end
        return prompt
    # append contexts until hitting limit
    for i in range(1, len(contexts)):
        if len("\n\n---\n\n".join(contexts[:i])) >= limit:
            prompt = (
                prompt_start +
                "\n\n---\n\n".join(contexts[:i-1]) +
                prompt_end
            )
            break
        elif i == len(contexts)-1:
            prompt = (
                prompt_start +
                "\n\n---\n\n".join(contexts) +
                prompt_end
            )
    logger.debug(f"Generated prompt of length {len(prompt)}")
    return prompt, contexts_ref

def complete(openai_client: OpenAI, query: str, system_prompt: str) -> str:
    logger.info("Generating completion with GPT-4")
    completion = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                seed=42
            )
    logger.debug("Successfully generated completion")
    return completion.choices[0].message.content

def query_data(index, openai_client: OpenAI, query: str, user_id: str) -> str:
    logger.info(f"Processing query: {query[:50]}...")
    prompt, contexts_ref = retrieve(index, openai_client, query, user_id)
    answer = complete(openai_client, prompt, SYSTEM_PROMPT)
    logger.info("Query processing complete")
    return answer, contexts_ref