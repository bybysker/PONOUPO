'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { storage } from "@/db/config-firebase"
import { ref, listAll, getMetadata, deleteObject, getDownloadURL } from "firebase/storage"
import { Eye, Download } from 'lucide-react'

interface Document {
  id: string
  name: string
  uploadDate: string
  size: string
}

export default function MyDocsContent() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchDocuments = async () => {
      try {
        const documentsRef = ref(storage, `users/${user.uid}/`)
        const res = await listAll(documentsRef)

        const docs = await Promise.all(res.items.map(async (item) => {
          const metadata = await getMetadata(item)
          return {
            id: item.fullPath, // Using fullPath as a unique identifier
            name: item.name,
            uploadDate: metadata.timeCreated ? new Date(metadata.timeCreated).toLocaleDateString() : 'N/A',
            size: formatFileSize(metadata.size),
          }
        }))

        setDocuments(docs)
      } catch (err: any) {
        console.error("Error fetching documents:", err)
        setError("Failed to load documents.")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [user])

  const handleDownload = async (doc: Document) => {
    try {
      const fileRef = ref(storage, doc.id)
      const url = await getDownloadURL(fileRef)
      
      // Create an anchor element and trigger download
      window.open(url, '_blank')
    } catch (err) {
      console.error("Error downloading document:", err)
      alert("Failed to download the document. Please try again.")
    }
  }
  const handleDelete = async (id: string) => {
    try {
      const fileRef = ref(storage, id)
      await deleteObject(fileRef)
      setDocuments(documents.filter(doc => doc.id !== id))
    } catch (err: any) {
      console.error("Error deleting document:", err)
      alert("Failed to delete the document. Please try again.")
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`
    else if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    else return `${(bytes / 1048576).toFixed(1)} MB`
  }

  if (loading) {
    return <p>Loading documents...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
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
            <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(doc.id)}>
                        Delete
                      </Button>
                    </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}