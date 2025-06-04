"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(query)}`)
      setQuery('')
      onClose()
    }
  }

  const handleClose = () => {
    setQuery('')
    onClose()
  }

  // Focus input when search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm z-50 animate-in slide-in-from-top-0 duration-150">
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Pesquisar produtos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button type="submit" size="sm" disabled={!query.trim()}>
            Pesquisar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
