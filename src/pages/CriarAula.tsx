"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  CalendarIcon,
  Clock,
  Users,
  BookOpen,
  Video,
  Save,
  Eye,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { useCreateScheduledLesson } from "@/hooks/use-scheduled-lessons"
import { useToast } from "@/hooks/use-toast"

const CriarAula = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createLessonMutation = useCreateScheduledLesson()

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_date: undefined as Date | undefined,
    scheduled_time: "",
    duration_minutes: 60,
    max_students: 1,
    requirements: "",
    materials: "",
    notes: "",
    is_recurring: false,
    recurrence_pattern: "",
    recurrence_end_date: undefined as Date | undefined,
  })

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [activeTab, setActiveTab] = useState("basic")

  // Mock do ID do professor logado
  const teacherId = "550e8400-e29b-41d4-a716-446655440000"

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
  ]

  const durationOptions = [
    { value: 30, label: "30 minutos" },
    { value: 45, label: "45 minutos" },
    { value: 60, label: "1 hora" },
    { value: 90, label: "1h 30min" },
    { value: 120, label: "2 horas" },
  ]

  const recurrenceOptions = [
    { value: "daily", label: "Diariamente" },
    { value: "weekly", label: "Semanalmente" },
    { value: "monthly", label: "Mensalmente" },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    // Validações
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título da aula é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formData.scheduled_date) {
      toast({
        title: "Erro",
        description: "Data da aula é obrigatória",
        variant: "destructive",
      })
      return
    }

    if (!formData.scheduled_time) {
      toast({
        title: "Erro",
        description: "Horário da aula é obrigatório",
        variant: "destructive",
      })
      return
    }

    // Verificar se a data não é no passado
    const selectedDateTime = new Date(
      `${formData.scheduled_date.toISOString().split("T")[0]}T${formData.scheduled_time}`,
    )
    if (selectedDateTime < new Date()) {
      toast({
        title: "Erro",
        description: "Não é possível agendar aulas no passado",
        variant: "destructive",
      })
      return
    }

    try {
      await createLessonMutation.mutateAsync({
        ...formData,
        teacher_id: teacherId,
        scheduled_date: formData.scheduled_date.toISOString().split("T")[0],
      })

      toast({
        title: "Sucesso!",
        description: "Aula agendada com sucesso",
      })

      navigate("/dashboard/professor")
    } catch (error) {
      console.error("Erro ao criar aula:", error)
    }
  }

  const isFormValid = formData.title.trim() && formData.scheduled_date && formData.scheduled_time

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard/professor")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-white">Criar Nova Aula</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab("preview")}
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || createLessonMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {createLessonMutation.isPending ? "Salvando..." : "Agendar Aula"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Informações Básicas */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Informações da Aula
                </CardTitle>
                <CardDescription>Defina o título, descrição e categoria da sua aula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Título da Aula *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Acordes Básicos para Iniciantes"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o conteúdo e objetivos da aula..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Tags da Aula</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Adicionar tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agendamento */}
          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Data e Horário
                </CardTitle>
                <CardDescription>Escolha quando sua aula acontecerá</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Data da Aula *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.scheduled_date ? (
                            format(formData.scheduled_date, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.scheduled_date}
                          onSelect={(date) => handleInputChange("scheduled_date", date)}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Horário *</Label>
                    <Select
                      value={formData.scheduled_time}
                      onValueChange={(value) => handleInputChange("scheduled_time", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Duração</Label>
                    <Select
                      value={formData.duration_minutes.toString()}
                      onValueChange={(value) => handleInputChange("duration_minutes", Number.parseInt(value))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Máximo de Alunos</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.max_students}
                      onChange={(e) => handleInputChange("max_students", Number.parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={formData.is_recurring}
                      onCheckedChange={(checked) => handleInputChange("is_recurring", checked)}
                    />
                    <Label htmlFor="recurring">Aula recorrente</Label>
                  </div>

                  {formData.is_recurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                      <div>
                        <Label>Padrão de Recorrência</Label>
                        <Select
                          value={formData.recurrence_pattern}
                          onValueChange={(value) => handleInputChange("recurrence_pattern", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione o padrão" />
                          </SelectTrigger>
                          <SelectContent>
                            {recurrenceOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Data Final</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal mt-1 bg-transparent"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.recurrence_end_date ? (
                                format(formData.recurrence_end_date, "PPP", { locale: ptBR })
                              ) : (
                                <span>Data final</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.recurrence_end_date}
                              onSelect={(date) => handleInputChange("recurrence_end_date", date)}
                              disabled={(date) =>
                                date < new Date() || (formData.scheduled_date && date <= formData.scheduled_date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detalhes */}
          <TabsContent value="details" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Requisitos e Materiais
                </CardTitle>
                <CardDescription>Informe aos alunos o que precisam saber e ter para a aula</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="requirements">Requisitos</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Ex: Conhecimento básico de acordes, violão afinado..."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="materials">Materiais Necessários</Label>
                  <Textarea
                    id="materials"
                    placeholder="Ex: Violão, palheta, caderno para anotações..."
                    value={formData.materials}
                    onChange={(e) => handleInputChange("materials", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notas Adicionais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Informações extras para os alunos..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview da Aula
                </CardTitle>
                <CardDescription>Veja como sua aula aparecerá para os alunos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{formData.title || "Título da Aula"}</h2>
                      <p className="text-gray-600 mb-4">
                        {formData.description || "Descrição da aula aparecerá aqui..."}
                      </p>

                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {formData.scheduled_date
                            ? format(formData.scheduled_date, "PPP", { locale: ptBR })
                            : "Data não selecionada"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formData.scheduled_time || "Horário não selecionado"} ({formData.duration_minutes} min)
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Máx. {formData.max_students} aluno{formData.max_students !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {formData.requirements && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Requisitos:</p>
                              <p className="text-sm text-blue-700">{formData.requirements}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.materials && (
                        <div className="mb-4 p-3 bg-green-50 rounded-md">
                          <div className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-green-500 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">Materiais:</p>
                              <p className="text-sm text-green-700">{formData.materials}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {formData.notes && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium text-gray-800 mb-1">Notas:</p>
                          <p className="text-sm text-gray-700">{formData.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-6">
                      <Badge className="bg-blue-500 text-white mb-2">Agendada</Badge>
                      <Button className="w-full" disabled>
                        <Video className="h-4 w-4 mr-2" />
                        Entrar na Aula
                      </Button>
                    </div>
                  </div>

                  {formData.is_recurring && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-purple-500" />
                        <p className="text-sm font-medium text-purple-800">
                          Aula Recorrente -{" "}
                          {recurrenceOptions.find((opt) => opt.value === formData.recurrence_pattern)?.label}
                        </p>
                      </div>
                      {formData.recurrence_end_date && (
                        <p className="text-sm text-purple-700 mt-1">
                          Até {format(formData.recurrence_end_date, "PPP", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CriarAula
