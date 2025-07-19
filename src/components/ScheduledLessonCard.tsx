"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Play, BookOpen, AlertCircle, CheckCircle, Video } from "lucide-react"
import { useJoinLesson } from "@/hooks/use-scheduled-lessons"

interface ScheduledLessonCardProps {
  lesson: {
    id: string
    title: string
    description?: string
    scheduled_date: string
    scheduled_time: string
    duration_minutes: number
    student_count: number
    max_students: number
    requirements?: string
    materials?: string
    is_today?: boolean
    is_live?: boolean
    can_join?: boolean
    has_ended?: boolean
    status: string
  }
  studentId: string
  onJoin?: (lessonId: string) => void
}

const ScheduledLessonCard = ({ lesson, studentId, onJoin }: ScheduledLessonCardProps) => {
  const joinLessonMutation = useJoinLesson()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getLessonStatus = () => {
    if (lesson.is_today && lesson.can_join) {
      return { status: "available", label: "Disponível", color: "bg-green-500" }
    } else if (lesson.is_today && lesson.is_live) {
      return { status: "live", label: "Ao Vivo", color: "bg-red-500" }
    } else if (lesson.has_ended) {
      return { status: "ended", label: "Finalizada", color: "bg-gray-500" }
    } else {
      return { status: "scheduled", label: "Agendada", color: "bg-blue-500" }
    }
  }

  const handleJoinLesson = async () => {
    try {
      await joinLessonMutation.mutateAsync({
        lessonId: lesson.id,
        studentId: studentId,
      })
      if (onJoin) {
        onJoin(lesson.id)
      }
    } catch (error) {
      console.error("Erro ao entrar na aula:", error)
    }
  }

  const status = getLessonStatus()

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold">{lesson.title}</h3>
              <Badge className={`${status.color} text-white`}>{status.label}</Badge>
            </div>

            {lesson.description && <p className="text-gray-600 mb-3">{lesson.description}</p>}

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(lesson.scheduled_date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(lesson.scheduled_time)} ({lesson.duration_minutes} min)
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {lesson.student_count}/{lesson.max_students} aluno{lesson.student_count !== 1 ? "s" : ""}
              </div>
            </div>

            {lesson.requirements && (
              <div className="mb-3 p-2 bg-blue-50 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Requisitos:</p>
                    <p className="text-sm text-blue-700">{lesson.requirements}</p>
                  </div>
                </div>
              </div>
            )}

            {lesson.materials && (
              <div className="mb-3 p-2 bg-green-50 rounded-md">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Materiais:</p>
                    <p className="text-sm text-green-700">{lesson.materials}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 flex flex-col items-end">
            {lesson.is_today && lesson.can_join ? (
              <Button
                onClick={handleJoinLesson}
                disabled={joinLessonMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white mb-2"
              >
                <Play className="h-4 w-4 mr-2" />
                {joinLessonMutation.isPending ? "Entrando..." : "Entrar na Aula"}
              </Button>
            ) : lesson.is_today && lesson.is_live ? (
              <Button
                onClick={handleJoinLesson}
                disabled={joinLessonMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white animate-pulse mb-2"
              >
                <Video className="h-4 w-4 mr-2" />
                {joinLessonMutation.isPending ? "Entrando..." : "Aula ao Vivo"}
              </Button>
            ) : lesson.has_ended ? (
              <Button variant="outline" disabled className="mb-2 bg-transparent">
                <CheckCircle className="h-4 w-4 mr-2" />
                Finalizada
              </Button>
            ) : (
              <div className="text-center mb-2">
                <p className="text-sm text-gray-500 mb-1">Agendada para:</p>
                <p className="text-sm font-medium">{formatDate(lesson.scheduled_date)}</p>
                <p className="text-sm font-medium">{formatTime(lesson.scheduled_time)}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScheduledLessonCard
