# syntax=docker/dockerfile:1
# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application code into the container
COPY . .

# Expose the port that the FastAPI app will run on
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME=0.0.0.0  

# Command to print the working directory and then run the FastAPI application using Uvicorn
CMD ["sh", "-c", "ls && uvicorn api.index:app --host 0.0.0.0 --port 8080 --reload"]