"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Users, Filter, ChevronLeft, ChevronRight, Play, Video } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { useScheduledLessons, useJoinLesson } from "@/hooks/use-scheduled-lessons"

const CalendarioAulas = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Mock do ID do aluno logado
  const currentStudentId = "550e8400-e29b-41d4-a716-446655440001"

  const { lessons: scheduledLessons, loading } = useScheduledLessons({
    studentId: currentStudentId,
  })

  const joinLessonMutation = useJoinLesson()

  // Filtrar aulas por status
  const filteredLessons = scheduledLessons.filter((lesson) => {
    if (filterStatus === "all") return true
    if (filterStatus === "today") return lesson.is_today
    if (filterStatus === "upcoming") return !lesson.has_ended && !lesson.is_today
    if (filterStatus === "completed") return lesson.has_ended
    return lesson.status === filterStatus
  })

  // Obter aulas do mês atual
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Agrupar aulas por data
  const lessonsByDate = filteredLessons.reduce(
    (acc, lesson) => {
      const date = lesson.scheduled_date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(lesson)
      return acc
    },
    {} as Record<string, typeof filteredLessons>,
  )

  // Obter aulas do dia selecionado
  const selectedDateString = format(selectedDate, "yyyy-MM-dd")
  const selectedDayLessons = lessonsByDate[selectedDateString] || []

  const handleJoinLesson = async (lessonId: string) => {
    try {
      await joinLessonMutation.mutateAsync({
        lessonId,
        studentId: currentStudentId,
      })
    } catch (error) {
      console.error("Erro ao entrar na aula:", error)
    }
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const getLessonStatusColor = (lesson: any) => {
    if (lesson.is_today && lesson.can_join) return "bg-green-500"
    if (lesson.is_today && lesson.is_live) return "bg-red-500"
    if (lesson.has_ended) return "bg-gray-500"
    return "bg-blue-500"
  }

  const previousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Calendário de Aulas</h1>
            <Button
              onClick={() => navigate("/aulas")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              Voltar às Aulas
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controles do Calendário */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={previousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {monthDays.map((day) => {
                    const dayString = format(day, "yyyy-MM-dd")
                    const dayLessons = lessonsByDate[dayString] || []
                    const isSelected = isSameDay(day, selectedDate)
                    const isCurrentDay = isToday(day)

                    return (
                      <div
                        key={dayString}
                        className={`
                          min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                          ${isSelected ? "bg-blue-100 border-blue-500" : "bg-white hover:bg-gray-50"}
                          ${isCurrentDay ? "ring-2 ring-green-500" : ""}
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${isCurrentDay ? "text-green-600" : ""}`}>
                          {format(day, "d")}
                        </div>

                        <div className="space-y-1">
                          {dayLessons.slice(0, 2).map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`text-xs p-1 rounded text-white ${getLessonStatusColor(lesson)}`}
                            >
                              {formatTime(lesson.scheduled_time)}
                            </div>
                          ))}
                          {dayLessons.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayLessons.length - 2} mais</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com detalhes */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as aulas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="upcoming">Próximas</SelectItem>
                    <SelectItem value="completed">Finalizadas</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Aulas do dia selecionado */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>{format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</CardTitle>
                <CardDescription>
                  {selectedDayLessons.length} aula{selectedDayLessons.length !== 1 ? "s" : ""} agendada
                  {selectedDayLessons.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Carregando...</p>
                  </div>
                ) : selectedDayLessons.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma aula neste dia</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDayLessons.map((lesson) => (
                      <div key={lesson.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{lesson.title}</h4>
                          <Badge className={`${getLessonStatusColor(lesson)} text-white text-xs`}>
                            {lesson.is_today && lesson.can_join
                              ? "Disponível"
                              : lesson.is_today && lesson.is_live
                                ? "Ao Vivo"
                                : lesson.has_ended
                                  ? "Finalizada"
                                  : "Agendada"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(lesson.scheduled_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {lesson.student_count} aluno{lesson.student_count !== 1 ? "s" : ""}
                          </div>
                        </div>

                        {lesson.is_today && lesson.can_join ? (
                          <Button
                            size="sm"
                            className="w-full bg-green-500 hover:bg-green-600"
                            onClick={() => handleJoinLesson(lesson.id)}
                            disabled={joinLessonMutation.isPending}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {joinLessonMutation.isPending ? "Entrando..." : "Entrar"}
                          </Button>
                        ) : lesson.is_today && lesson.is_live ? (
                          <Button
                            size="sm"
                            className="w-full bg-red-500 hover:bg-red-600 animate-pulse"
                            onClick={() => handleJoinLesson(lesson.id)}
                            disabled={joinLessonMutation.isPending}
                          >
                            <Video className="h-3 w-3 mr-1" />
                            {joinLessonMutation.isPending ? "Entrando..." : "Ao Vivo"}
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="w-full bg-transparent" disabled>
                            {lesson.has_ended ? "Finalizada" : "Agendada"}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resumo */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Resumo do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de aulas:</span>
                    <span className="font-medium">{filteredLessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hoje:</span>
                    <span className="font-medium">{filteredLessons.filter((l) => l.is_today).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximas:</span>
                    <span className="font-medium">
                      {filteredLessons.filter((l) => !l.has_ended && !l.is_today).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finalizadas:</span>
                    <span className="font-medium">{filteredLessons.filter((l) => l.has_ended).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarioAulas
