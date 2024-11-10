from api.rag import *
import os
from openai import OpenAI
from pinecone.grpc import PineconeGRPC as Pinecone
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
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


@app.post("/add_documents")
async def add_documents(files: List[UploadFile] = File(...)):
    try:
        for file in files:
            contents = await file.read()
            logger.info(f"Processing document: {file.filename}, Size: {len(contents)} bytes")
            
            # Save the file temporarily
            temp_path = os.path.join("/tmp", file.filename)
            with open(temp_path, "wb") as temp_file:
                temp_file.write(contents)
            
            # Process the saved file
            chunks = parse_and_chunk_pdf(temp_path)
            print(f"Parsed {len(chunks)} chunks from {file.filename}")
            populate_index(index, client, chunks)
            
            # Remove the temporary file
            os.remove(temp_path)
        
        return {"message": "Documents processed successfully"}
    except Exception as e:
        logger.error(f"Error processing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# retrieve
@app.get("/query")
def query(query: str):
    answer = query_data(index, client, query)
    return answer


