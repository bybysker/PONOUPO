'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X } from 'lucide-react'
interface UploadedFile {
  name: string;
  size: number;
}

export default function HomeContent() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)



  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName))
  }

  const handleProcessDocuments = () => {
    setIsProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      // Here you would typically send the files to your backend
      console.log('Processing documents:', uploadedFiles)
      // For now, we'll just show an alert
      alert('Documents processed successfully!')
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAnswer(`This is a sample answer to your question: ${query}`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
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
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary' : 'border-muted-foreground'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop your documents here or click to browse
              </p>
              <Input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                id="file-upload"
                multiple
              />
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Choose Files
              </Button>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Uploaded Documents:</h3>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2" />
                        <span className="text-sm">{file.name} ({formatFileSize(file.size)})</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.name)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-4"
                  onClick={handleProcessDocuments}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Process Documents'}
                </Button>
              </div>
            )}
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
              <Button type="submit" className="w-full">Ask Question</Button>
            </form>
            {answer && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Your answer will appear here...</p>
                <p className="mt-2">{answer}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}