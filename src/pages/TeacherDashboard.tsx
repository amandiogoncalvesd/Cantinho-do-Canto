"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, BookOpen, MessageCircle, Award, TrendingUp, Music, Plus, Edit, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LogOut, Menu, Home } from "lucide-react"
import { useScheduledLessons } from "@/hooks/use-scheduled-lessons"

const TeacherDashboard = () => {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { lessons: scheduledLessons, loading: loadingScheduled } = useScheduledLessons({
    teacherId: "550e8400-e29b-41d4-a716-446655440000", // ID do professor logado
    upcoming: true,
  })

  // Mock data - em uma aplicação real, viria da API
  const teacherData = {
    name: "Professor Carlos Mendes",
    specialization: "Violão Clássico e Popular",
    experience: "15 anos",
    totalStudents: 24,
    activeClasses: 8,
    monthlyHours: 96,
    rating: 4.8,
  }

  const todayClasses = [
    { time: "09:00", student: "Ana Silva", level: "Iniciante", topic: "Acordes Básicos", status: "confirmed" },
    { time: "10:30", student: "Pedro Santos", level: "Intermediário", topic: "Finger Picking", status: "confirmed" },
    { time: "14:00", student: "Maria Costa", level: "Avançado", topic: "Villa-Lobos", status: "pending" },
    { time: "15:30", student: "João Oliveira", level: "Iniciante", topic: "Escala de Dó", status: "confirmed" },
    { time: "17:00", student: "Lucia Mendes", level: "Intermediário", topic: "Bossa Nova", status: "confirmed" },
  ]

  const students = [
    {
      name: "Ana Silva",
      level: "Iniciante",
      progress: 75,
      lastLesson: "2024-01-10",
      attendance: "95%",
      currentSong: "Asa Branca",
    },
    {
      name: "Pedro Santos",
      level: "Intermediário",
      progress: 85,
      lastLesson: "2024-01-09",
      attendance: "90%",
      currentSong: "Hotel California",
    },
    {
      name: "Maria Costa",
      level: "Avançado",
      progress: 92,
      lastLesson: "2024-01-08",
      attendance: "100%",
      currentSong: "Choro das 3",
    },
    {
      name: "João Oliveira",
      level: "Iniciante",
      progress: 60,
      lastLesson: "2024-01-11",
      attendance: "88%",
      currentSong: "Parabéns a Você",
    },
  ]

  const weeklySchedule = [
    {
      day: "Segunda",
      classes: [
        { time: "09:00", student: "Ana Silva" },
        { time: "10:30", student: "Pedro Santos" },
      ],
    },
    {
      day: "Terça",
      classes: [
        { time: "14:00", student: "Maria Costa" },
        { time: "15:30", student: "João Oliveira" },
      ],
    },
    {
      day: "Quarta",
      classes: [
        { time: "09:00", student: "Lucia Mendes" },
        { time: "17:00", student: "Carlos Rocha" },
      ],
    },
    {
      day: "Quinta",
      classes: [
        { time: "10:00", student: "Sandra Lima" },
        { time: "16:00", student: "Rafael Costa" },
      ],
    },
    {
      day: "Sexta",
      classes: [
        { time: "08:30", student: "Patricia Alves" },
        { time: "14:30", student: "Miguel Santos" },
      ],
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Dashboard do Professor</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="text-white border-white hover:bg-blue-500 hover:border-blue-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-amber-500 hover:border-amber-500 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-2">Olá, {teacherData.name}! 🎸</h2>
          <p className="text-white/80">Bem-vindo ao seu painel de ensino</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{teacherData.totalStudents}</div>
              <div className="text-sm text-gray-600">Alunos Ativos</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{teacherData.activeClasses}</div>
              <div className="text-sm text-gray-600">Aulas Hoje</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{teacherData.monthlyHours}h</div>
              <div className="text-sm text-gray-600">Horas/Mês</div>
            </CardContent>
          </Card>
          <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                {teacherData.rating} <Star className="h-4 w-4 fill-current" />
              </div>
              <div className="text-sm text-gray-600">Avaliação</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="students">Alunos</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
            <TabsTrigger value="materials">Materiais</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Today's Classes */}
              <div className="lg:col-span-2">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Aulas de Hoje
                    </CardTitle>
                    <CardDescription>{todayClasses.length} aulas agendadas para hoje</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayClasses.map((class_, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-lg font-semibold text-blue-600">{class_.time}</div>
                            <div>
                              <div className="font-medium">{class_.student}</div>
                              <div className="text-sm text-gray-600">{class_.topic}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                class_.level === "Iniciante"
                                  ? "secondary"
                                  : class_.level === "Intermediário"
                                    ? "default"
                                    : "destructive"
                              }
                            >
                              {class_.level}
                            </Badge>
                            <Badge variant={class_.status === "confirmed" ? "default" : "secondary"}>
                              {class_.status === "confirmed" ? "Confirmado" : "Pendente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" onClick={() => navigate("/criar-aula")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Aula
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Mensagens
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Adicionar Material
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Award className="h-4 w-4 mr-2" />
                      Avaliar Alunos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Resumo Mensal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Aulas Concluídas</span>
                        <span className="font-semibold">87</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Taxa de Presença</span>
                        <span className="font-semibold text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Novos Alunos</span>
                        <span className="font-semibold text-blue-600">5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Próximas Aulas Agendadas */}
            <div className="lg:col-span-3">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Próximas Aulas Agendadas
                  </CardTitle>
                  <CardDescription>{scheduledLessons.length} aulas agendadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingScheduled ? (
                    <div className="text-center py-4">Carregando...</div>
                  ) : scheduledLessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma aula agendada</p>
                      <Button onClick={() => navigate("/criar-aula")} className="mt-4">
                        Criar Primeira Aula
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scheduledLessons.slice(0, 5).map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{lesson.title}</div>
                            <div className="text-sm text-gray-600">
                              {new Date(lesson.scheduled_date).toLocaleDateString("pt-BR")} às {lesson.scheduled_time}
                            </div>
                            <div className="text-xs text-gray-500">
                              {lesson.student_count} aluno{lesson.student_count !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.is_today && <Badge className="bg-green-500 text-white">Hoje</Badge>}
                            <Badge variant="outline">
                              {lesson.status === "scheduled" ? "Agendada" : lesson.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Meus Alunos
                </CardTitle>
                <CardDescription>Gerencie o progresso e acompanhe o desenvolvimento dos seus alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Última Aula</TableHead>
                      <TableHead>Presença</TableHead>
                      <TableHead>Música Atual</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.level === "Iniciante"
                                ? "secondary"
                                : student.level === "Intermediário"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {student.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.lastLesson}</TableCell>
                        <TableCell>{student.attendance}</TableCell>
                        <TableCell className="text-sm">{student.currentSong}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Agenda Semanal
                </CardTitle>
                <CardDescription>Sua programação de aulas para esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-5 gap-4">
                  {weeklySchedule.map((day, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-center mb-3">{day.day}</h3>
                      <div className="space-y-2">
                        {day.classes.map((class_, classIndex) => (
                          <div key={classIndex} className="p-2 bg-white rounded text-center text-sm">
                            <div className="font-medium text-blue-600">{class_.time}</div>
                            <div className="text-gray-600">{class_.student}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Materiais de Ensino
                </CardTitle>
                <CardDescription>Gerencie partituras, exercícios e recursos didáticos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Music className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                        <h3 className="font-semibold mb-1">Partituras</h3>
                        <p className="text-sm text-gray-600 mb-3">42 arquivos</p>
                        <Button variant="outline" size="sm">
                          Ver Todas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <h3 className="font-semibold mb-1">Exercícios</h3>
                        <p className="text-sm text-gray-600 mb-3">28 arquivos</p>
                        <Button variant="outline" size="sm">
                          Ver Todos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <h3 className="font-semibold mb-1">Métodos</h3>
                        <p className="text-sm text-gray-600 mb-3">15 livros</p>
                        <Button variant="outline" size="sm">
                          Ver Todos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default TeacherDashboard
