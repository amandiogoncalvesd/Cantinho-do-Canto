"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCreatedLessons } from "@/hooks/use-created-lessons"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoginModal from "@/components/LoginModal"
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Users,
  FileText,
  Video,
  HelpCircle,
  Guitar,
  ImageIcon,
  Volume2,
  Star,
  TrendingUp,
  Send,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Link } from "react-router-dom"

const MinhasAulas = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)

  const { lessons, loading, pagination, deleteLesson, publishLesson } = useCreatedLessons({
    search: searchTerm,
    status: statusFilter,
    category: categoryFilter,
    level: levelFilter,
    page: currentPage,
    limit: 12,
  })

  const categories = ["Teoria", "Prática", "Técnica", "Repertório", "Ritmo"]
  const levels = ["Iniciante", "Intermediário", "Avançado"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publicada"
      case "draft":
        return "Rascunho"
      case "archived":
        return "Arquivada"
      default:
        return status
    }
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "text":
        return FileText
      case "video":
        return Video
      case "quiz":
        return HelpCircle
      case "chord":
        return Guitar
      case "image":
        return ImageIcon
      case "audio":
        return Volume2
      default:
        return FileText
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await publishLesson(id)
    } catch (error) {
      console.error("Erro ao publicar aula:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja arquivar esta aula?")) {
      try {
        await deleteLesson(id)
      } catch (error) {
        console.error("Erro ao arquivar aula:", error)
      }
    }
  }

  const renderLessonCard = (lesson: any) => (
    <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg line-clamp-2">{lesson.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={getStatusColor(lesson.status)}>{getStatusLabel(lesson.status)}</Badge>
              {lesson.level && <Badge variant="outline">{lesson.level}</Badge>}
              {lesson.category && <Badge variant="secondary">{lesson.category}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => setSelectedLesson(lesson)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/criar-aula?edit=${lesson.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lesson.description && <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>}

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{lesson.duration || 0} min</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span>{lesson.statistics?.totalBlocks || 0} blocos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span>{lesson.students?.length || 0} alunos</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-400" />
              <span>{lesson.statistics?.averageRating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {lesson.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {lesson.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{lesson.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Agendamento */}
          {lesson.scheduledDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(lesson.scheduledDate), "dd/MM/yyyy", { locale: ptBR })}
                {lesson.scheduledTime && ` às ${lesson.scheduledTime}`}
              </span>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center gap-2 pt-2">
            {lesson.status === "draft" && (
              <Button size="sm" onClick={() => handlePublish(lesson.id)} className="flex-1">
                <Send className="h-4 w-4 mr-1" />
                Publicar
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
              <Link to={`/criar-aula?edit=${lesson.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar onLogin={() => setShowLogin(true)} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Aulas</h1>
              <p className="text-gray-600">Gerencie suas aulas criadas e acompanhe o progresso</p>
            </div>
            <Button asChild>
              <Link to="/criar-aula">
                <Plus className="h-4 w-4 mr-2" />
                Nova Aula
              </Link>
            </Button>
          </div>

          {/* Filtros e Busca */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar aulas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicada</SelectItem>
                    <SelectItem value="archived">Arquivada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Aulas</p>
                    <p className="text-2xl font-bold">{lessons.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Publicadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {lessons.filter((l) => l.status === "published").length}
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rascunhos</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {lessons.filter((l) => l.status === "draft").length}
                    </p>
                  </div>
                  <Edit className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Visualizações</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {lessons.reduce((total, lesson) => total + (lesson.statistics?.viewsCount || 0), 0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Aulas */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="published">Publicadas</TabsTrigger>
              <TabsTrigger value="draft">Rascunhos</TabsTrigger>
              <TabsTrigger value="archived">Arquivadas</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : lessons.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma aula encontrada</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || levelFilter !== "all"
                        ? "Tente ajustar os filtros de busca"
                        : "Comece criando sua primeira aula"}
                    </p>
                    <Button asChild>
                      <Link to="/criar-aula">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeira Aula
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map(renderLessonCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="published">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.filter((l) => l.status === "published").map(renderLessonCard)}
              </div>
            </TabsContent>

            <TabsContent value="draft">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.filter((l) => l.status === "draft").map(renderLessonCard)}
              </div>
            </TabsContent>

            <TabsContent value="archived">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessons.filter((l) => l.status === "archived").map(renderLessonCard)}
              </div>
            </TabsContent>
          </Tabs>

          {/* Paginação */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes da Aula */}
      <Dialog open={!!selectedLesson} onOpenChange={() => setSelectedLesson(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
          </DialogHeader>
          {selectedLesson && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Informações Gerais</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={getStatusColor(selectedLesson.status)}>
                        {getStatusLabel(selectedLesson.status)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Nível:</span>
                      <span>{selectedLesson.level || "Não definido"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categoria:</span>
                      <span>{selectedLesson.category || "Não definida"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duração:</span>
                      <span>{selectedLesson.duration || 0} minutos</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Estatísticas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Blocos:</span>
                      <span>{selectedLesson.statistics?.totalBlocks || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alunos:</span>
                      <span>{selectedLesson.students?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visualizações:</span>
                      <span>{selectedLesson.statistics?.viewsCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avaliação:</span>
                      <span>{selectedLesson.statistics?.averageRating?.toFixed(1) || "0.0"} ⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLesson.description && (
                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-sm text-gray-600">{selectedLesson.description}</p>
                </div>
              )}

              {selectedLesson.tags && selectedLesson.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedLesson.students && selectedLesson.students.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Alunos Participantes</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLesson.students.map((student: string) => (
                      <Badge key={student} variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {student}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link to={`/criar-aula?edit=${selectedLesson.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Aula
                  </Link>
                </Button>
                {selectedLesson.status === "draft" && (
                  <Button onClick={() => handlePublish(selectedLesson.id)} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Publicar
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  )
}

export default MinhasAulas
