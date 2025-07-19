"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface LessonBlock {
  id: string
  type: "text" | "video" | "quiz" | "chord" | "image" | "audio"
  content: any
  order: number
  title?: string
  description?: string
}

interface CreatedLesson {
  id: string
  title: string
  description: string
  level: string
  category: string
  duration: number
  scheduledDate?: string
  scheduledTime?: string
  tags: string[]
  students: string[]
  status: "draft" | "published" | "archived"
  learningObjectives?: string
  evaluationCriteria?: string
  complementaryMaterial?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  version: number
  blocks?: LessonBlock[]
  statistics?: {
    viewsCount: number
    studentsEnrolled: number
    completionRate: number
    averageRating: number
    totalBlocks: number
  }
}

interface UseCreatedLessonsOptions {
  status?: string
  category?: string
  level?: string
  search?: string
  page?: number
  limit?: number
}

export function useCreatedLessons(options: UseCreatedLessonsOptions = {}) {
  const [lessons, setLessons] = useState<CreatedLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const { toast } = useToast()

  const fetchLessons = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.status) params.append("status", options.status)
      if (options.category) params.append("category", options.category)
      if (options.level) params.append("level", options.level)
      if (options.search) params.append("search", options.search)
      if (options.page) params.append("page", options.page.toString())
      if (options.limit) params.append("limit", options.limit.toString())

      const response = await fetch(`/api/created-lessons?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar aulas")
      }

      setLessons(data.lessons)
      setPagination(data.pagination)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createLesson = async (lessonData: Partial<CreatedLesson>) => {
    try {
      const response = await fetch("/api/created-lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar aula")
      }

      toast({
        title: "Sucesso",
        description: "Aula criada com sucesso!",
      })

      await fetchLessons() // Recarregar lista
      return data.lesson
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const updateLesson = async (id: string, lessonData: Partial<CreatedLesson>) => {
    try {
      const response = await fetch(`/api/created-lessons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar aula")
      }

      toast({
        title: "Sucesso",
        description: "Aula atualizada com sucesso!",
      })

      await fetchLessons() // Recarregar lista
      return data.lesson
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteLesson = async (id: string) => {
    try {
      const response = await fetch(`/api/created-lessons/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao excluir aula")
      }

      toast({
        title: "Sucesso",
        description: "Aula arquivada com sucesso!",
      })

      await fetchLessons() // Recarregar lista
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const publishLesson = async (id: string) => {
    return updateLesson(id, { status: "published" })
  }

  const saveDraft = async (id: string, lessonData: Partial<CreatedLesson>) => {
    return updateLesson(id, { ...lessonData, status: "draft" })
  }

  useEffect(() => {
    fetchLessons()
  }, [options.status, options.category, options.level, options.search, options.page, options.limit])

  return {
    lessons,
    loading,
    error,
    pagination,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    publishLesson,
    saveDraft,
  }
}

export function useCreatedLesson(id: string) {
  const [lesson, setLesson] = useState<CreatedLesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchLesson = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/created-lessons/${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar aula")
      }

      setLesson(data.lesson)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLesson()
  }, [id])

  return {
    lesson,
    loading,
    error,
    fetchLesson,
  }
}
