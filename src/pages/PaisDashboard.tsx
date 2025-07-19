"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Calendar,
  Trophy,
  BookOpen,
  Users,
  Clock,
  Star,
  TrendingUp,
  MessageCircle,
  Download,
  Bell,
  LogOut,
  Menu,
  Home,
} from "lucide-react"

const Pais = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("progresso")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock user data - in real app this would come from auth context
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  const studentProgress = [
    { subject: "Técnica Básica", progress: 85, grade: "A" },
    { subject: "Leitura Musical", progress: 70, grade: "B+" },
    { subject: "Repertório", progress: 90, grade: "A+" },
    { subject: "Teoria Musical", progress: 65, grade: "B" },
  ]

  const upcomingEvents = [
    { date: "15 Ago", event: "Recital de Final de Período", time: "19:00" },
    { date: "22 Ago", event: "Aula de Técnica Avançada", time: "14:00" },
    { date: "29 Ago", event: "Apresentação dos Alunos", time: "16:00" },
  ]

  const achievements = [
    { title: "Primeira Música Completa", icon: Trophy, date: "12 Jul 2024" },
    { title: "100 Horas de Prática", icon: Clock, date: "05 Jul 2024" },
    { title: "Técnica Aperfeiçoada", icon: Star, date: "28 Jun 2024" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const sections = [
    { id: "progresso", label: "Progresso", icon: TrendingUp },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "comunicacao", label: "Comunicação", icon: MessageCircle },
    { id: "recursos", label: "Recursos", icon: Download },
  ]

  const Sidebar = () => (
    <div
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm shadow-lg transition-transform duration-300`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Portal dos Pais</h2>
        <nav className="space-y-2">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? "bg-amber-100 text-amber-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {section.label}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      <div className="flex">
        <Sidebar />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-bold text-white">
                  {sections.find((s) => s.id === activeSection)?.label || "Portal dos Pais"}
                </h1>
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

          {/* Content */}
          <div className="p-6">
            {/* Progresso Content */}
            {activeSection === "progresso" && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Academic Progress */}
                  <Card className="md:col-span-2 bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        Progresso Acadêmico
                      </CardTitle>
                      <CardDescription>Acompanhe o desenvolvimento nas diferentes áreas musicais</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {studentProgress.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{item.subject}</span>
                            <Badge variant="secondary">{item.grade}</Badge>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                          <p className="text-sm text-muted-foreground">{item.progress}% concluído</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recent Achievements */}
                  <Card className="bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-accent" />
                        Conquistas Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="p-2 bg-accent/10 rounded-full">
                            <achievement.icon className="h-4 w-4 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{achievement.title}</p>
                            <p className="text-xs text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center bg-white/95 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <Music className="h-8 w-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Aulas Frequentadas</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-white/95 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">156h</p>
                      <p className="text-sm text-muted-foreground">Tempo de Prática</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-white/95 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <BookOpen className="h-8 w-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-muted-foreground">Músicas Aprendidas</p>
                    </CardContent>
                  </Card>
                  <Card className="text-center bg-white/95 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Certificados</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Agenda Content */}
            {activeSection === "agenda" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Próximos Eventos
                  </CardTitle>
                  <CardDescription>Aulas, apresentações e atividades programadas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-accent">{event.date}</p>
                        </div>
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Lembrete
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Comunicação Content */}
            {activeSection === "comunicacao" && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-accent" />
                      Mensagens do Professor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Prof. Carlos:</strong> Parabéns pelo progresso! Continue praticando escalas.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Há 2 dias</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Secretaria:</strong> Lembrete: Recital no dia 15/08 às 19:00.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Há 1 semana</p>
                      </div>
                    </div>
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Nova Mensagem
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Reuniões de Pais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Próxima Reunião</p>
                      <p className="text-sm text-muted-foreground">30 de Agosto, 2024</p>
                      <p className="text-sm text-muted-foreground">15:00 - Sala de Reuniões</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Confirmar Presença
                      </Button>
                    </div>
                    <Button className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Agendar Reunião
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recursos Content */}
            {activeSection === "recursos" && (
              <div className="grid md:grid-cols-3 gap-6 animate-in fade-in-50">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-accent" />
                      Material de Apoio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Partituras para Casa
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Music className="h-4 w-4 mr-2" />
                      Exercícios de Técnica
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Star className="h-4 w-4 mr-2" />
                      Guia de Prática
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Pagamentos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Mensalidade Agosto</p>
                      <p className="text-sm text-muted-foreground">Vencimento: 10/08/2024</p>
                      <Badge className="mt-1">Pago</Badge>
                    </div>
                    <Button className="w-full">Ver Histórico</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Suporte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat com Suporte
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      FAQ
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Contato Direto
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pais
