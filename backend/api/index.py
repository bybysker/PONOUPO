from api.rag import *
import os
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from pydantic import BaseModel
from typing import List

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


class Document(BaseModel):
    name: str
    size: int
    downloadURL: str


@app.post("/api/add_documents")
def add_documents(documents: List[Document]):
    try:
        for doc in documents:
            # Process each document
            print(f"Processing document: {doc.name}, URL: {doc.downloadURL}")
            chunks = parse_and_chunk_pdf(doc.downloadURL)
            populate_index(index, chunks)
            
        return {"message": "Documents processed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# retrieve
@app.get("/query")
def query(query: str):
    answer = query_data(index, client, query)
    return answer


