"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Clock,
  Users,
  Target,
  Calendar,
  Video,
  HelpCircle,
  Guitar,
  FileText,
  ImageIcon,
  Volume2,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface LessonBlock {
  id: string
  type: "text" | "video" | "quiz" | "chord" | "image" | "audio"
  content: any
  order: number
}

interface LessonData {
  title: string
  description: string
  level: string
  duration: string
  scheduledDate?: Date
  scheduledTime: string
  students: string[]
  tags: string[]
  category: string
}

interface LessonPreviewProps {
  lessonData: LessonData
  blocks: LessonBlock[]
}

const LessonPreview = ({ lessonData, blocks }: LessonPreviewProps) => {
  const getBlockIcon = (type: LessonBlock["type"]) => {
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

  const renderBlockContent = (block: LessonBlock) => {
    const Icon = getBlockIcon(block.type)

    switch (block.type) {
      case "text":
        return (
          <div className="prose prose-sm max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: block.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\*(.*?)\*/g, "<em>$1</em>")
                  .replace(/__(.*?)__/g, "<u>$1</u>")
                  .replace(/~~(.*?)~~/g, "<del>$1</del>")
                  .replace(/`(.*?)`/g, "<code>$1</code>")
                  .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                  .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                  .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                  .replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>")
                  .replace(/\n/g, "<br>"),
              }}
            />
          </div>
        )

      case "video":
        return (
          <div className="space-y-3">
            {block.content.title && <h4 className="font-medium">{block.content.title}</h4>}
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Vídeo: {block.content.url || "URL não definida"}</p>
            </div>
          </div>
        )

      case "quiz":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              <span className="font-medium">Quiz Interativo</span>
              <Badge variant="secondary">{block.content.questions?.length || 0} questões</Badge>
            </div>
            {block.content.questions?.length > 0 && (
              <div className="space-y-2">
                {block.content.questions.slice(0, 2).map((q: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                    <p className="font-medium text-sm">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tipo:{" "}
                      {q.type === "multiple"
                        ? "Múltipla escolha"
                        : q.type === "truefalse"
                          ? "Verdadeiro/Falso"
                          : "Resposta aberta"}
                    </p>
                  </div>
                ))}
                {block.content.questions.length > 2 && (
                  <p className="text-sm text-gray-500">+{block.content.questions.length - 2} questões adicionais</p>
                )}
              </div>
            )}
          </div>
        )

      case "chord":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Guitar className="h-5 w-5" />
              <span className="font-medium">Acorde: {block.content.name || "Sem nome"}</span>
              {block.content.difficulty && <Badge variant="outline">{block.content.difficulty}</Badge>}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-mono text-sm">
                {["E", "A", "D", "G", "B", "e"].map((string, index) => (
                  <div key={index}>
                    {string}|
                    {block.content.frets?.[index] === -1 ? "---X---" : `---${block.content.frets?.[index] || 0}---`}|
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <span className="font-medium">Imagem</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Imagem: {block.content.url || "URL não definida"}</p>
            </div>
          </div>
        )

      case "audio":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              <span className="font-medium">Áudio</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Volume2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Áudio: {block.content.url || "URL não definida"}</p>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center gap-2 text-gray-500">
            <Icon className="h-5 w-5" />
            <span>Conteúdo do tipo {block.type}</span>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{lessonData.title || "Título da Aula"}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {lessonData.level && (
                  <Badge variant="secondary">
                    <Target className="h-3 w-3 mr-1" />
                    {lessonData.level}
                  </Badge>
                )}
                {lessonData.category && (
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {lessonData.category}
                  </Badge>
                )}
                {lessonData.duration && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {lessonData.duration} min
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {lessonData.description && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Descrição:</h4>
              <div className="prose prose-sm max-w-none text-gray-600">
                <div
                  dangerouslySetInnerHTML={{
                    __html: lessonData.description
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            </div>
          )}

          {/* Schedule Info */}
          {(lessonData.scheduledDate || lessonData.scheduledTime) && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Agendamento:</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {lessonData.scheduledDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(lessonData.scheduledDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                )}
                {lessonData.scheduledTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {lessonData.scheduledTime}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Students */}
          {lessonData.students.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Alunos:</h4>
              <div className="flex flex-wrap gap-2">
                {lessonData.students.map((student) => (
                  <Badge key={student} variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {student}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {lessonData.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {lessonData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lesson Content */}
      {blocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo da Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {blocks
                .sort((a, b) => a.order - b.order)
                .map((block, index) => {
                  const Icon = getBlockIcon(block.type)

                  return (
                    <div key={block.id}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium capitalize">
                          {block.type === "text"
                            ? "Texto"
                            : block.type === "video"
                              ? "Vídeo"
                              : block.type === "quiz"
                                ? "Quiz"
                                : block.type === "chord"
                                  ? "Acorde"
                                  : block.type === "image"
                                    ? "Imagem"
                                    : block.type === "audio"
                                      ? "Áudio"
                                      : block.type}
                        </span>
                      </div>

                      <div className="ml-6 pl-4 border-l-2 border-gray-200">{renderBlockContent(block)}</div>

                      {index < blocks.length - 1 && <Separator className="mt-6" />}
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {blocks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Nenhum conteúdo adicionado ainda</p>
            <p className="text-sm">Adicione blocos de conteúdo para visualizar a aula completa</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LessonPreview
