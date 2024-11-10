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
    elements = partition_pdf(filepath)
    chunks = chunk_by_title(elements)

    return chunks

def get_index(pc_client: Pinecone, index_name: str):
    # check if index already exists (it shouldn't if this is first time)
    if index_name not in pc_client.list_indexes().names():
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
    text = text.replace("\n", " ")
    return openai_client.embeddings.create(input = [text], model=model).data[0].embedding


def embed_batch(openai_client: OpenAI, texts: list[str], model: str="text-embedding-3-small"):
    return [embed_str(openai_client, text, model) for text in texts]

def populate_index(index, openai_client: OpenAI, chunks: list, batch_size: int=100):

    for i in tqdm(range(0, len(chunks), batch_size)):
        # find end of batch
        i_end = min(len(chunks), i+batch_size)
        chunks_batch = chunks[i:i_end]
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
            except:
                sleep(5)
        # cleanup metadata
        metadata_batch = [{
            'filename': x.metadata.to_dict()['filename'],
            'filetype': x.metadata.to_dict()['filetype'],
            'page_number': x.metadata.to_dict()['page_number'],
            'languages': x.metadata.to_dict()['languages'],
            'text': x.text,
        } for x in chunks_batch]
        to_upsert = list(zip(ids_batch, batch_embeddings, metadata_batch))
        # upsert to Pinecone
        index.upsert(vectors=to_upsert)

def filter_matches(matches, threshold=0.3):
    filtered_matches = [x for x in matches if x['score'] > threshold]
    return filtered_matches

def retrieve(index, openai_client: OpenAI, query: str, limit: int=3750) -> str:
    xq = embed_str(openai_client, query)

    # get relevant contexts
    res = index.query(vector=xq, top_k=5, include_metadata=True)
    filtered_matches = filter_matches(res['matches'], threshold=0.1)
    contexts = [
        x['metadata']['text'] for x in filtered_matches
    ]    
    # build our prompt with the retrieved contexts included
    prompt_start = (
        "Answer the question based on the context below.\n\n"+
        "Context:\n"
    )
    prompt_end = (
        f"\n\nQuestion: {query}\nAnswer:"
    )
    if len(contexts) == 0:
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
    return prompt

def complete(openai_client: OpenAI, query: str, system_prompt: str) -> str:
    completion = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages = [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                seed=42
            )
    return completion.choices[0].message.content

def query_data(index, openai_client: OpenAI,query: str):
    prompt = retrieve(index, openai_client, query)
    return complete(openai_client, prompt, SYSTEM_PROMPT)