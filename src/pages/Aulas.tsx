"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Users,
  Play,
  BookOpen,
  Search,
  Filter,
  Video,
  Music,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useScheduledLessons, useJoinLesson } from "@/hooks/use-scheduled-lessons"
import { useToast } from "@/hooks/use-toast"

const Aulas = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock do ID do aluno logado - em produção viria do contexto de auth
  const currentStudentId = "550e8400-e29b-41d4-a716-446655440001"

  // Buscar aulas agendadas do aluno
  const { lessons: scheduledLessons, loading: loadingScheduled } = useScheduledLessons({
    studentId: currentStudentId,
    upcoming: true,
  })

  const joinLessonMutation = useJoinLesson()

  // Mock data para aulas gravadas
  const recordedLessons = [
    {
      id: 1,
      title: "Acordes Básicos - Parte 1",
      description: "Aprenda os primeiros acordes essenciais do violão",
      instructor: "Prof. Carlos Mendes",
      duration: "45 min",
      level: "Iniciante",
      category: "Técnica",
      thumbnail: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      students: 234,
      completed: false,
      progress: 0,
    },
    {
      id: 2,
      title: "Ritmos Brasileiros",
      description: "Explore os ritmos tradicionais da música brasileira",
      instructor: "Prof. Ana Silva",
      duration: "60 min",
      level: "Intermediário",
      category: "Ritmo",
      thumbnail: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      students: 189,
      completed: true,
      progress: 100,
    },
    {
      id: 3,
      title: "Técnicas de Dedilhado",
      description: "Desenvolva a técnica de finger picking",
      instructor: "Prof. Carlos Mendes",
      duration: "50 min",
      level: "Avançado",
      category: "Técnica",
      thumbnail: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      students: 156,
      completed: false,
      progress: 35,
    },
    {
      id: 4,
      title: "Harmonia Funcional",
      description: "Entenda a teoria por trás dos acordes",
      instructor: "Prof. Roberto Lima",
      duration: "75 min",
      level: "Avançado",
      category: "Teoria",
      thumbnail: "/placeholder.svg?height=200&width=300",
      rating: 4.6,
      students: 98,
      completed: false,
      progress: 0,
    },
  ]

  const filteredLessons = recordedLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || lesson.level === selectedLevel
    const matchesCategory = selectedCategory === "all" || lesson.category === selectedCategory

    return matchesSearch && matchesLevel && matchesCategory
  })

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

  const getLessonStatus = (lesson: any) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Minhas Aulas</h1>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="scheduled" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Aulas Agendadas
            </TabsTrigger>
            <TabsTrigger value="recorded" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Aulas Gravadas
            </TabsTrigger>
          </TabsList>

          {/* Aulas Agendadas */}
          <TabsContent value="scheduled" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Suas Aulas Agendadas
                </CardTitle>
                <CardDescription>Aulas ao vivo com seus professores</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingScheduled ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando aulas...</p>
                  </div>
                ) : scheduledLessons.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma aula agendada</h3>
                    <p className="text-sm">Entre em contato com seu professor para agendar aulas</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduledLessons.map((lesson) => {
                      const status = getLessonStatus(lesson)

                      return (
                        <div key={lesson.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{lesson.title}</h3>
                                <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                              </div>

                              <p className="text-gray-600 mb-3">{lesson.description}</p>

                              <div className="flex items-center gap-6 text-sm text-gray-500">
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
                                  {lesson.student_count} aluno{lesson.student_count !== 1 ? "s" : ""}
                                </div>
                              </div>

                              {lesson.requirements && (
                                <div className="mt-3 p-2 bg-blue-50 rounded-md">
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
                                <div className="mt-2 p-2 bg-green-50 rounded-md">
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

                            <div className="ml-4">
                              {lesson.is_today && lesson.can_join ? (
                                <Button
                                  onClick={() => handleJoinLesson(lesson.id)}
                                  disabled={joinLessonMutation.isPending}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  {joinLessonMutation.isPending ? "Entrando..." : "Entrar na Aula"}
                                </Button>
                              ) : lesson.is_today && lesson.is_live ? (
                                <Button
                                  onClick={() => handleJoinLesson(lesson.id)}
                                  disabled={joinLessonMutation.isPending}
                                  className="bg-red-500 hover:bg-red-600 text-white animate-pulse"
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  {joinLessonMutation.isPending ? "Entrando..." : "Aula ao Vivo"}
                                </Button>
                              ) : lesson.has_ended ? (
                                <Button variant="outline" disabled>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Finalizada
                                </Button>
                              ) : (
                                <div className="text-center">
                                  <p className="text-sm text-gray-500 mb-1">Agendada para:</p>
                                  <p className="text-sm font-medium">{formatDate(lesson.scheduled_date)}</p>
                                  <p className="text-sm font-medium">{formatTime(lesson.scheduled_time)}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aulas Gravadas */}
          <TabsContent value="recorded" className="space-y-6">
            {/* Filtros */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar aulas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os níveis</SelectItem>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="Técnica">Técnica</SelectItem>
                      <SelectItem value="Ritmo">Ritmo</SelectItem>
                      <SelectItem value="Teoria">Teoria</SelectItem>
                      <SelectItem value="Repertório">Repertório</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Aulas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={
                          lesson.level === "Iniciante"
                            ? "secondary"
                            : lesson.level === "Intermediário"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {lesson.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {lesson.duration}
                    </div>
                    {lesson.completed && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{lesson.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lesson.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span>{lesson.instructor}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{lesson.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{lesson.students} alunos</span>
                      </div>
                      <Badge variant="outline">{lesson.category}</Badge>
                    </div>

                    {lesson.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progresso</span>
                          <span>{lesson.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${lesson.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <Button className="w-full" variant={lesson.completed ? "outline" : "default"}>
                      <Play className="h-4 w-4 mr-2" />
                      {lesson.completed ? "Assistir Novamente" : lesson.progress > 0 ? "Continuar" : "Começar Aula"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredLessons.length === 0 && (
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Music className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma aula encontrada</h3>
                  <p className="text-gray-600">Tente ajustar os filtros de busca</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Aulas
