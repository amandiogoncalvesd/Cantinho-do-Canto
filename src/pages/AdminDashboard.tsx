"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  LogOut,
  Users,
  BookOpen,
  Calendar,
  BarChart2,
  Star,
  PieChart,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  MessageSquare,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data - substituir por APIs reais
const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    role: "student",
    phone: "+244 923 456 789",
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    role: "teacher",
    phone: "+244 924 567 890",
    createdAt: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    name: "Pedro Costa",
    email: "pedro@email.com",
    role: "parent",
    phone: "+244 925 678 901",
    createdAt: "2024-01-20",
    status: "active",
  },
  {
    id: 4,
    name: "Ana Ferreira",
    email: "ana@email.com",
    role: "student",
    phone: "+244 926 789 012",
    createdAt: "2024-01-25",
    status: "inactive",
  },
]

const mockCourses = [
  {
    id: 1,
    title: "Violão para Iniciantes",
    description: "Curso básico de violão",
    instructor: "Maria Santos",
    students: 25,
    duration: "8 semanas",
    price: 15000,
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Piano Clássico",
    description: "Fundamentos do piano clássico",
    instructor: "João Maestro",
    students: 18,
    duration: "12 semanas",
    price: 20000,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    title: "Teoria Musical",
    description: "Teoria musical aplicada",
    instructor: "Ana Professora",
    students: 32,
    duration: "6 semanas",
    price: 12000,
    status: "draft",
    createdAt: "2024-01-20",
  },
]

const mockEnrollments = [
  {
    id: 1,
    studentName: "João Silva",
    courseName: "Violão para Iniciantes",
    enrollDate: "2024-01-15",
    status: "active",
    progress: 75,
    paymentStatus: "paid",
  },
  {
    id: 2,
    studentName: "Pedro Costa",
    courseName: "Piano Clássico",
    enrollDate: "2024-01-18",
    status: "active",
    progress: 45,
    paymentStatus: "pending",
  },
  {
    id: 3,
    studentName: "Ana Ferreira",
    courseName: "Teoria Musical",
    enrollDate: "2024-01-20",
    status: "completed",
    progress: 100,
    paymentStatus: "paid",
  },
  {
    id: 4,
    studentName: "Carlos Lima",
    courseName: "Violão para Iniciantes",
    enrollDate: "2024-01-22",
    status: "paused",
    progress: 30,
    paymentStatus: "overdue",
  },
]

const mockLessons = [
  {
    id: 1,
    title: "Introdução aos Acordes",
    course: "Violão para Iniciantes",
    instructor: "Maria Santos",
    date: "2024-01-25",
    time: "14:00",
    duration: 60,
    students: 12,
    status: "scheduled",
  },
  {
    id: 2,
    title: "Escalas Básicas",
    course: "Piano Clássico",
    instructor: "João Maestro",
    date: "2024-01-25",
    time: "16:00",
    duration: 90,
    students: 8,
    status: "completed",
  },
  {
    id: 3,
    title: "Ritmo e Compasso",
    course: "Teoria Musical",
    instructor: "Ana Professora",
    date: "2024-01-26",
    time: "10:00",
    duration: 45,
    students: 15,
    status: "scheduled",
  },
  {
    id: 4,
    title: "Prática de Acordes",
    course: "Violão para Iniciantes",
    instructor: "Maria Santos",
    date: "2024-01-24",
    time: "15:00",
    duration: 60,
    students: 10,
    status: "cancelled",
  },
]

const mockProgress = [
  {
    studentName: "João Silva",
    course: "Violão para Iniciantes",
    progress: 75,
    lessonsCompleted: 6,
    totalLessons: 8,
    lastActivity: "2024-01-24",
    grade: "B+",
  },
  {
    studentName: "Pedro Costa",
    course: "Piano Clássico",
    progress: 45,
    lessonsCompleted: 5,
    totalLessons: 12,
    lastActivity: "2024-01-23",
    grade: "A-",
  },
  {
    studentName: "Ana Ferreira",
    course: "Teoria Musical",
    progress: 100,
    lessonsCompleted: 6,
    totalLessons: 6,
    lastActivity: "2024-01-22",
    grade: "A+",
  },
  {
    studentName: "Carlos Lima",
    course: "Violão para Iniciantes",
    progress: 30,
    lessonsCompleted: 2,
    totalLessons: 8,
    lastActivity: "2024-01-20",
    grade: "C",
  },
]

const mockTestimonials = [
  {
    id: 1,
    studentName: "João Silva",
    course: "Violão para Iniciantes",
    rating: 5,
    comment: "Excelente curso! Aprendi muito e o professor é muito paciente.",
    date: "2024-01-20",
    status: "approved",
  },
  {
    id: 2,
    studentName: "Pedro Costa",
    course: "Piano Clássico",
    rating: 4,
    comment: "Bom curso, mas poderia ter mais exercícios práticos.",
    date: "2024-01-18",
    status: "approved",
  },
  {
    id: 3,
    studentName: "Ana Ferreira",
    course: "Teoria Musical",
    rating: 5,
    comment: "Perfeito para quem quer entender música de verdade!",
    date: "2024-01-22",
    status: "pending",
  },
  {
    id: 4,
    studentName: "Carlos Lima",
    course: "Violão para Iniciantes",
    rating: 3,
    comment: "Curso ok, mas achei um pouco rápido demais.",
    date: "2024-01-19",
    status: "pending",
  },
]

const mockStats = {
  totalStudents: 45,
  totalCourses: 3,
  completedEnrollments: 28,
  scheduledLessons: 12,
  activeEnrollments: 35,
  totalRevenue: 450000,
  averageRating: 4.3,
  completionRate: 78,
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [activeSection, setActiveSection] = useState("stats")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados para modais
  const [openCreateUser, setOpenCreateUser] = useState(false)
  const [openCreateCourse, setOpenCreateCourse] = useState(false)
  const [openCreateLesson, setOpenCreateLesson] = useState(false)

  // Estados para formulários
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
  })

  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    price: "",
    status: "draft",
  })

  const [newLesson, setNewLesson] = useState({
    title: "",
    course: "",
    instructor: "",
    date: "",
    time: "",
    duration: 60,
  })

  // Mock queries - substituir por APIs reais
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return mockUsers
    },
    enabled: activeSection === "users",
  })

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return mockCourses
    },
    enabled: activeSection === "courses",
  })

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 900))
      return mockEnrollments
    },
    enabled: activeSection === "enrollments",
  })

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700))
      return mockLessons
    },
    enabled: activeSection === "lessons",
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
      return mockProgress
    },
    enabled: activeSection === "progress",
  })

  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return mockTestimonials
    },
    enabled: activeSection === "testimonials",
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockStats
    },
    enabled: activeSection === "stats",
  })

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: async (user: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { ...user, id: Date.now(), createdAt: new Date().toISOString() }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({ title: "Sucesso", description: "Usuário criado com sucesso!" })
      setOpenCreateUser(false)
      setNewUser({ name: "", email: "", password: "", role: "", phone: "" })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar usuário",
        variant: "destructive",
      })
    },
  })

  const createCourseMutation = useMutation({
    mutationFn: async (course: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { ...course, id: Date.now(), createdAt: new Date().toISOString(), students: 0 }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] })
      toast({ title: "Sucesso", description: "Curso criado com sucesso!" })
      setOpenCreateCourse(false)
      setNewCourse({ title: "", description: "", instructor: "", duration: "", price: "", status: "draft" })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar curso",
        variant: "destructive",
      })
    },
  })

  const createLessonMutation = useMutation({
    mutationFn: async (lesson: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { ...lesson, id: Date.now(), students: 0, status: "scheduled" }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] })
      toast({ title: "Sucesso", description: "Aula criada com sucesso!" })
      setOpenCreateLesson(false)
      setNewLesson({ title: "", course: "", instructor: "", date: "", time: "", duration: 60 })
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar aula",
        variant: "destructive",
      })
    },
  })

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    createUserMutation.mutate(newUser)
  }

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.instructor || !newCourse.price) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    createCourseMutation.mutate(newCourse)
  }

  const handleCreateLesson = () => {
    if (!newLesson.title || !newLesson.course || !newLesson.date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      })
      return
    }
    createLessonMutation.mutate(newLesson)
  }

  const sections = [
    { id: "stats", label: "Estatísticas", icon: PieChart },
    { id: "users", label: "Usuários", icon: Users },
    { id: "courses", label: "Cursos", icon: BookOpen },
    { id: "enrollments", label: "Matrículas", icon: Users },
    { id: "lessons", label: "Aulas", icon: Calendar },
    { id: "progress", label: "Progresso", icon: BarChart2 },
    { id: "testimonials", label: "Depoimentos", icon: Star },
  ]

  const getRoleLabel = (role: string) => {
    const roles = {
      student: "Aluno",
      parent: "Pai/Responsável",
      teacher: "Professor",
      admin: "Administrador",
    }
    return roles[role as keyof typeof roles] || role
  }

  const getStatusBadge = (status: string, type = "default") => {
    const statusConfig = {
      active: { label: "Ativo", variant: "default" as const, color: "bg-green-500" },
      inactive: { label: "Inativo", variant: "secondary" as const, color: "bg-gray-500" },
      draft: { label: "Rascunho", variant: "outline" as const, color: "bg-yellow-500" },
      scheduled: { label: "Agendada", variant: "default" as const, color: "bg-blue-500" },
      completed: { label: "Concluída", variant: "default" as const, color: "bg-green-500" },
      cancelled: { label: "Cancelada", variant: "destructive" as const, color: "bg-red-500" },
      pending: { label: "Pendente", variant: "outline" as const, color: "bg-yellow-500" },
      approved: { label: "Aprovado", variant: "default" as const, color: "bg-green-500" },
      paid: { label: "Pago", variant: "default" as const, color: "bg-green-500" },
      overdue: { label: "Vencido", variant: "destructive" as const, color: "bg-red-500" },
      paused: { label: "Pausado", variant: "outline" as const, color: "bg-orange-500" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const Sidebar = () => (
    <div
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm shadow-lg transition-transform duration-300`}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Painel Admin</h2>
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
                  {sections.find((s) => s.id === activeSection)?.label || "Dashboard"}
                </h1>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-white border-white hover:bg-amber-500 hover:border-amber-500 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {/* Estatísticas */}
            {activeSection === "stats" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in-50">
                  {statsLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} className="bg-white/95 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <>
                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Total de Alunos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-blue-600">{stats?.totalStudents || 0}</p>
                          <p className="text-sm text-gray-500 mt-1">+12% este mês</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            Cursos Ativos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-green-600">{stats?.totalCourses || 0}</p>
                          <p className="text-sm text-gray-500 mt-1">2 novos este mês</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-amber-600" />
                            Matrículas Ativas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-amber-600">{stats?.activeEnrollments || 0}</p>
                          <p className="text-sm text-gray-500 mt-1">Taxa: {stats?.completionRate || 0}%</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Aulas Agendadas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-purple-600">{stats?.scheduledLessons || 0}</p>
                          <p className="text-sm text-gray-500 mt-1">Esta semana</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600" />
                            Receita Total
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-emerald-600">
                            {new Intl.NumberFormat("pt-AO", {
                              style: "currency",
                              currency: "AOA",
                            }).format(stats?.totalRevenue || 0)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">+8% este mês</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-600" />
                            Avaliação Média
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-yellow-600">{stats?.averageRating || 0}/5</p>
                          <p className="text-sm text-gray-500 mt-1">Baseado em 127 avaliações</p>
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <Award className="h-5 w-5 text-indigo-600" />
                            Taxa de Conclusão
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-indigo-600">{stats?.completionRate || 0}%</p>
                          <Progress value={stats?.completionRate || 0} className="mt-2" />
                        </CardContent>
                      </Card>

                      <Card className="bg-white/95 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-teal-600" />
                            Aulas Concluídas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-teal-600">{stats?.completedEnrollments || 0}</p>
                          <p className="text-sm text-gray-500 mt-1">Este mês</p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Usuários */}
            {activeSection === "users" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800">Gerenciamento de Usuários</CardTitle>
                    <Dialog open={openCreateUser} onOpenChange={setOpenCreateUser}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Usuário
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Usuário</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Nome *</Label>
                            <Input
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              placeholder="Nome completo"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">E-mail *</Label>
                            <Input
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              placeholder="E-mail"
                              type="email"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Senha</Label>
                            <Input
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              placeholder="Senha"
                              type="password"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Função *</Label>
                            <Select
                              value={newUser.role}
                              onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione a função" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="student">Aluno</SelectItem>
                                <SelectItem value="parent">Pai/Responsável</SelectItem>
                                <SelectItem value="teacher">Professor</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Telefone</Label>
                            <Input
                              value={newUser.phone}
                              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                              placeholder="Telefone"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={handleCreateUser}
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            disabled={createUserMutation.isPending}
                          >
                            {createUserMutation.isPending ? "Criando..." : "Criar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando usuários...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data de Criação</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users?.map((user: any) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.role === "admin" ? "default" : "secondary"}
                                  className={user.role === "admin" ? "bg-amber-500" : ""}
                                >
                                  {getRoleLabel(user.role)}
                                </Badge>
                              </TableCell>
                              <TableCell>{user.phone || "-"}</TableCell>
                              <TableCell>{getStatusBadge(user.status)}</TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cursos */}
            {activeSection === "courses" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800">Gerenciamento de Cursos</CardTitle>
                    <Dialog open={openCreateCourse} onOpenChange={setOpenCreateCourse}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Curso
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Criar Novo Curso</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Título *</Label>
                            <Input
                              value={newCourse.title}
                              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                              placeholder="Título do curso"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Descrição</Label>
                            <Textarea
                              value={newCourse.description}
                              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                              placeholder="Descrição do curso"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Instrutor *</Label>
                            <Input
                              value={newCourse.instructor}
                              onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                              placeholder="Nome do instrutor"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Duração</Label>
                            <Input
                              value={newCourse.duration}
                              onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                              placeholder="Ex: 8 semanas"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Preço (AOA) *</Label>
                            <Input
                              value={newCourse.price}
                              onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                              placeholder="15000"
                              type="number"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Select
                              value={newCourse.status}
                              onValueChange={(value) => setNewCourse({ ...newCourse, status: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Rascunho</SelectItem>
                                <SelectItem value="active">Ativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={handleCreateCourse}
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            disabled={createCourseMutation.isPending}
                          >
                            {createCourseMutation.isPending ? "Criando..." : "Criar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando cursos...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Instrutor</TableHead>
                            <TableHead>Alunos</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courses?.map((course: any) => (
                            <TableRow key={course.id}>
                              <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.instructor}</TableCell>
                              <TableCell>{course.students}</TableCell>
                              <TableCell>{course.duration}</TableCell>
                              <TableCell>
                                {new Intl.NumberFormat("pt-AO", {
                                  style: "currency",
                                  currency: "AOA",
                                }).format(course.price)}
                              </TableCell>
                              <TableCell>{getStatusBadge(course.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Matrículas */}
            {activeSection === "enrollments" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Gerenciamento de Matrículas</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollmentsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando matrículas...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Data de Matrícula</TableHead>
                            <TableHead>Progresso</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Pagamento</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {enrollments?.map((enrollment: any) => (
                            <TableRow key={enrollment.id}>
                              <TableCell className="font-medium">{enrollment.studentName}</TableCell>
                              <TableCell>{enrollment.courseName}</TableCell>
                              <TableCell>{new Date(enrollment.enrollDate).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={enrollment.progress} className="w-16" />
                                  <span className="text-sm">{enrollment.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                              <TableCell>{getStatusBadge(enrollment.paymentStatus)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Aulas */}
            {activeSection === "lessons" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800">Gerenciamento de Aulas</CardTitle>
                    <Dialog open={openCreateLesson} onOpenChange={setOpenCreateLesson}>
                      <DialogTrigger asChild>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Agendar Aula
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Agendar Nova Aula</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">Título *</Label>
                            <Input
                              value={newLesson.title}
                              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                              placeholder="Título da aula"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Curso *</Label>
                            <Select
                              value={newLesson.course}
                              onValueChange={(value) => setNewLesson({ ...newLesson, course: value })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Selecione o curso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Violão para Iniciantes">Violão para Iniciantes</SelectItem>
                                <SelectItem value="Piano Clássico">Piano Clássico</SelectItem>
                                <SelectItem value="Teoria Musical">Teoria Musical</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Instrutor</Label>
                            <Input
                              value={newLesson.instructor}
                              onChange={(e) => setNewLesson({ ...newLesson, instructor: e.target.value })}
                              placeholder="Nome do instrutor"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Data *</Label>
                            <Input
                              value={newLesson.date}
                              onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
                              type="date"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Horário</Label>
                            <Input
                              value={newLesson.time}
                              onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })}
                              type="time"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Duração (minutos)</Label>
                            <Input
                              value={newLesson.duration}
                              onChange={(e) =>
                                setNewLesson({ ...newLesson, duration: Number.parseInt(e.target.value) })
                              }
                              type="number"
                              placeholder="60"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={handleCreateLesson}
                            className="w-full bg-amber-500 hover:bg-amber-600"
                            disabled={createLessonMutation.isPending}
                          >
                            {createLessonMutation.isPending ? "Agendando..." : "Agendar"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {lessonsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando aulas...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Instrutor</TableHead>
                            <TableHead>Data/Hora</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead>Alunos</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {lessons?.map((lesson: any) => (
                            <TableRow key={lesson.id}>
                              <TableCell className="font-medium">{lesson.title}</TableCell>
                              <TableCell>{lesson.course}</TableCell>
                              <TableCell>{lesson.instructor}</TableCell>
                              <TableCell>
                                {new Date(lesson.date).toLocaleDateString("pt-BR")} às {lesson.time}
                              </TableCell>
                              <TableCell>{lesson.duration}min</TableCell>
                              <TableCell>{lesson.students}</TableCell>
                              <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="destructive" size="sm">
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Progresso */}
            {activeSection === "progress" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Acompanhamento de Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  {progressLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando dados de progresso...</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Progresso</TableHead>
                            <TableHead>Aulas Concluídas</TableHead>
                            <TableHead>Última Atividade</TableHead>
                            <TableHead>Nota</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {progress?.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.studentName}</TableCell>
                              <TableCell>{item.course}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Progress value={item.progress} className="w-20" />
                                  <span className="text-sm font-medium">{item.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {item.lessonsCompleted}/{item.totalLessons}
                              </TableCell>
                              <TableCell>{new Date(item.lastActivity).toLocaleDateString("pt-BR")}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    item.grade.startsWith("A")
                                      ? "default"
                                      : item.grade.startsWith("B")
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {item.grade}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Depoimentos */}
            {activeSection === "testimonials" && (
              <Card className="bg-white/95 backdrop-blur-sm animate-in fade-in-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Gerenciamento de Depoimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {testimonialsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-gray-500">Carregando depoimentos...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testimonials?.map((testimonial: any) => (
                        <Card key={testimonial.id} className="border-l-4 border-l-amber-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{testimonial.studentName}</h4>
                                <p className="text-sm text-gray-600">{testimonial.course}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-600 ml-1">({testimonial.rating}/5)</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(testimonial.status)}
                                <span className="text-xs text-gray-500">
                                  {new Date(testimonial.date).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{testimonial.comment}</p>
                            <div className="flex gap-2">
                              {testimonial.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 bg-transparent"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Aprovar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 bg-transparent"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Rejeitar
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Excluir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
