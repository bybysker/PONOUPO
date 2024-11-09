'use client'

import React, { useState, DragEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, File, X } from 'lucide-react'
//import { User as FirebaseUser } from 'firebase/auth'

interface UploadedFile {
  name: string
  size: number
  file: File
}

interface UploadFileProps {
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  isProcessing: boolean;
  handleProcessDocuments: () => void;
  //user?: FirebaseUser | null;
}

const UploadFile: React.FC<UploadFileProps> = ({
  uploadedFiles,
  setUploadedFiles,
  isProcessing,
  handleProcessDocuments,
  //user,
}) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      file
    }))
    setUploadedFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    else return `${(bytes / 1048576).toFixed(1)} MB`
  }

  return (
    <div>
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
    </div>
  )
}

export default UploadFile