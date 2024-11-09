from api.rag import *
import os
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

logger = logging.getLogger(__name__)
load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize the clients
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# get or create index
#index = get_index(pc, "ponoupo-docs")
index = pc.Index(host=os.getenv("INDEX_HOST"))


@app.post("/add_document")
def add_document(document):
    chunks = parse_and_chunk_pdf(document)
    populate_index(index, chunks)
    return {"message": "Document added successfully"}

# retrieve
@app.get("/query")
def query(query: str):
    answer = query_data(index, client, query)
    return answer
