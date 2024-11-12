'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "@/db/config-firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import UploadFile from "@/components/upload-file"; // Import the new component
import { User as FirebaseUser } from 'firebase/auth';
import axios from 'axios';

interface UploadedFile {
  name: string;
  size: number;
  file: File;
}


export default function HomeContent({ user }: { user: FirebaseUser }) {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [contexts, setContexts] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleProcessDocuments = async (user: FirebaseUser) => {
    if (!user) {
      alert("User not authenticated. Please log in.");
      return;
    }
    setIsProcessing(true);
    
    try {

      const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
        const storageRef = ref(storage, `users/${user.uid}/${uploadedFile.name}`);
        await uploadBytes(storageRef, uploadedFile.file);
        const downloadURL = await getDownloadURL(storageRef);
        return { ...uploadedFile, downloadURL };
      });

      const formData = new FormData();
      formData.append('user_id', user.uid);

      uploadedFiles.forEach((uploadedFile) => {
        formData.append('files', uploadedFile.file, uploadedFile.name);
      });

      console.log("Uploading documents for user:", user.uid);
      const uploadedResults = await Promise.all(uploadPromises);
      console.log("Uploaded documents:", uploadedResults);

      // Replace fetch with axios.post
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/add_documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Documents processed successfully!");
        setUploadedFiles([]); // Clear uploaded files after successful processing
      } else {
        console.error("Backend processing failed.", response);
        alert("Documents processed but backend encountered an error.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        alert("Failed to upload documents. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/query`,
        {
          params: { 
            query,
            user_id: user.uid  // Add user ID to the query parameters
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const [answerText, contextsRef] = response.data;
        setAnswer(answerText);
        setContexts(contextsRef || []);
      } else {
        console.error("Query failed:", response);
        setAnswer("Failed to get an answer. Please try again.");
        setContexts([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response);
        setAnswer("An error occurred while getting the answer. Please try again.");
      } else {
        console.error("Unexpected error:", error);
        setAnswer("An unexpected error occurred. Please try again.");
      }
      setContexts([]);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">PONOUPO, Talk to me</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Upload your documents and ask questions to get intelligent answers based on your document content.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadFile
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              isProcessing={isProcessing}
              handleProcessDocuments={() => handleProcessDocuments(user)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Ask a question about your documents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Ask Question'}
              </Button>
            </form>
            {answer && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Here is your answer...</p>
                <ReactMarkdown className="prose prose-sm dark:prose-invert">
                  {answer}
                </ReactMarkdown>
                {contexts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">Answer based on: {contexts}</p>

                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}