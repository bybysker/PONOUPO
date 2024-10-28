'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Document {
  id: string
  name: string
  uploadDate: string
  size: string
}

export default function MyDocsContent() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', name: 'Document 1.pdf', uploadDate: '2024-03-01', size: '1.2 MB' },
    { id: '2', name: 'Document 2.docx', uploadDate: '2024-03-02', size: '568 KB' },
    { id: '3', name: 'Document 3.txt', uploadDate: '2024-03-03', size: '24 KB' },
  ])

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.name}</TableCell>
            <TableCell>{doc.uploadDate}</TableCell>
            <TableCell>{doc.size}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}