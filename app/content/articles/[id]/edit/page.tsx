"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ArticleEditor, { type ArticleEditorData } from "@/components/ArticleEditor"
import { articlesApi } from "@/lib/content-api"
import { useToast } from "@/hooks/use-toast"

export default function EditArticle() {
  const params = useParams()
  const { toast } = useToast()
  
  const [article, setArticle] = useState<ArticleEditorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await articlesApi.get(Number(params.id))

        if (response.success && response.data) {
          const articleData = response.data
          setArticle({
            id: articleData.id,
            title: articleData.title,
            excerpt: articleData.excerpt || "",
            content: articleData.content || "",
            category: articleData.category || "",
            status: articleData.status,
            featured: articleData.featured,
            author: articleData.author,
            publish_date: articleData.publish_date,
            image_url: articleData.image_url,
            tags: articleData.tags,
            meta_description: articleData.meta_description
          })
        } else {
          setError(response.error || 'Failed to load article')
        }
      } catch (error) {
        setError('Failed to load article')
        console.error('Error loading article:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadArticle()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d36530] mx-auto mb-4"></div>
          <p className="text-[#5e6461]">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#d36530] text-white rounded hover:bg-[#d36530]/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[#5e6461]">Article not found</p>
      </div>
    )
  }

  const handleSaveSuccess = () => {
    // Reload the article data when save is successful
    const loadArticle = async () => {
      try {
        const response = await articlesApi.get(Number(params.id))
        if (response.success && response.data) {
          const articleData = response.data
          setArticle({
            id: articleData.id,
            title: articleData.title,
            excerpt: articleData.excerpt || "",
            content: articleData.content || "",
            category: articleData.category || "",
            status: articleData.status,
            featured: articleData.featured,
            author: articleData.author,
            publish_date: articleData.publish_date,
            image_url: articleData.image_url,
            tags: articleData.tags,
            meta_description: articleData.meta_description
          })
        }
      } catch (error) {
        console.error('Error reloading article:', error)
      }
    }
    loadArticle()
  }

  return <ArticleEditor mode="edit" initialData={article} onSubmit={handleSaveSuccess} />
}
