"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

interface ScheduledLesson {
  id: string
  title: string
  description?: string
  teacher_id: string
  lesson_content_id?: string
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  max_students: number
  current_students: number
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  meeting_link?: string
  meeting_password?: string
  requirements?: string
  materials?: string
  homework?: string
  notes?: string
  is_recurring: boolean
  recurrence_pattern?: string
  recurrence_end_date?: string
  created_at: string
  updated_at: string

  // Campos calculados
  is_today?: boolean
  is_live?: boolean
  can_join?: boolean
  has_ended?: boolean
  student_count?: number
  attendance_count?: number
  average_rating?: number

  // Relacionamentos
  lesson_enrollments?: any[]
  lesson_attendance?: any[]
  lesson_feedback?: any[]
}

interface UseScheduledLessonsParams {
  teacherId?: string
  studentId?: string
  upcoming?: boolean
  today?: boolean
  status?: string
  limit?: number
  offset?: number
}

export const useScheduledLessons = (params: UseScheduledLessonsParams = {}) => {
  const { toast } = useToast()

  const query = useQuery({
    queryKey: ["scheduled-lessons", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params.teacherId) searchParams.set("teacherId", params.teacherId)
      if (params.studentId) searchParams.set("studentId", params.studentId)
      if (params.upcoming) searchParams.set("upcoming", "true")
      if (params.today) searchParams.set("today", "true")
      if (params.status) searchParams.set("status", params.status)
      if (params.limit) searchParams.set("limit", params.limit.toString())
      if (params.offset) searchParams.set("offset", params.offset.toString())

      const response = await fetch(`/api/scheduled-lessons?${searchParams}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar aulas agendadas")
      }

      const data = await response.json()
      return data
    },
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  })

  return {
    lessons: query.data?.lessons || [],
    total: query.data?.total || 0,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useScheduledLesson = (lessonId: string) => {
  const query = useQuery({
    queryKey: ["scheduled-lesson", lessonId],
    queryFn: async () => {
      const response = await fetch(`/api/scheduled-lessons/${lessonId}`)

      if (!response.ok) {
        throw new Error("Erro ao buscar aula")
      }

      const data = await response.json()
      return data.lesson
    },
    enabled: !!lessonId,
    refetchInterval: 15000, // Atualizar a cada 15 segundos para aulas ativas
  })

  return {
    lesson: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

export const useCreateScheduledLesson = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (lessonData: Partial<ScheduledLesson>) => {
      const response = await fetch("/api/scheduled-lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao criar aula")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-lessons"] })
      toast({
        title: "Sucesso!",
        description: "Aula agendada com sucesso",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateScheduledLesson = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, ...lessonData }: Partial<ScheduledLesson> & { id: string }) => {
      const response = await fetch(`/api/scheduled-lessons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao atualizar aula")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-lessons"] })
      queryClient.invalidateQueries({ queryKey: ["scheduled-lesson"] })
      toast({
        title: "Sucesso!",
        description: "Aula atualizada com sucesso",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useDeleteScheduledLesson = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (lessonId: string) => {
      const response = await fetch(`/api/scheduled-lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao deletar aula")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-lessons"] })
      toast({
        title: "Sucesso!",
        description: "Aula deletada com sucesso",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useJoinLesson = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ lessonId, studentId }: { lessonId: string; studentId: string }) => {
      const response = await fetch(`/api/scheduled-lessons/${lessonId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao entrar na aula")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: "Entrando na aula...",
      })

      // Abrir link da reunião
      if (data.lesson?.meeting_link) {
        window.open(data.lesson.meeting_link, "_blank")
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

export const useLeaveLesson = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ lessonId, studentId }: { lessonId: string; studentId: string }) => {
      const response = await fetch(`/api/scheduled-lessons/${lessonId}/join`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_id: studentId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Erro ao registrar saída")
      }

      return response.json()
    },
    onSuccess: (data) => {
      toast({
        title: "Saída registrada",
        description: `Você participou por ${data.duration_minutes} minutos`,
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
