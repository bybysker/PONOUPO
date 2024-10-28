'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from 'lucide-react'

export default function HomeContent() {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [isDragging, setIsDragging] = useState(false)

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
    // Handle file drop here
    console.log('Files dropped:', e.dataTransfer.files)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file selection here
    console.log('Files selected:', e.target.files)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle question submission here
    setAnswer(`This is a sample answer to your question: ${query}`)
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