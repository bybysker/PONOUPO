'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold">
          <Link href="/">PONOUPO</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-accent">Home</Link>
          <Link href="/mydocs" className="hover:text-accent">MyDocs</Link>
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-primary shadow-md">
          <nav className="flex flex-col space-y-2 p-4">
            <Link href="/" className="hover:text-accent">Home</Link>
            <Link href="/mydocs" className="hover:text-accent">MyDocs</Link>
          </nav>
        </div>
      )}
    </header>
  )
}