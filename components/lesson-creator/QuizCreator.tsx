"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, HelpCircle, CheckCircle, AlertCircle, Edit } from "lucide-react"

interface Question {
  id: string
  type: "multiple" | "text" | "truefalse"
  question: string
  options?: string[]
  correctAnswer: string
  explanation?: string
  points: number
}

interface QuizCreatorProps {
  content: { questions: Question[] }
  onChange: (content: { questions: Question[] }) => void
}

const QuizCreator = ({ content, onChange }: QuizCreatorProps) => {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: "multiple",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    points: 1,
  })

  const questionTypes = [
    { value: "multiple", label: "Múltipla Escolha", icon: CheckCircle },
    { value: "truefalse", label: "Verdadeiro/Falso", icon: AlertCircle },
    { value: "text", label: "Resposta Aberta", icon: Edit },
  ]

  const addQuestion = () => {
    if (!newQuestion.question) return

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question["type"],
      question: newQuestion.question,
      options: newQuestion.type === "multiple" ? newQuestion.options?.filter((opt) => opt.trim()) : undefined,
      correctAnswer: newQuestion.correctAnswer || "",
      explanation: newQuestion.explanation,
      points: newQuestion.points || 1,
    }

    onChange({
      questions: [...content.questions, question],
    })

    // Reset form
    setNewQuestion({
      type: "multiple",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      points: 1,
    })
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    onChange({
      questions: content.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    })
  }

  const removeQuestion = (id: string) => {
    onChange({
      questions: content.questions.filter((q) => q.id !== id),
    })
  }

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const questions = [...content.questions]
    const index = questions.findIndex((q) => q.id === id)

    if (index === -1) return

    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < questions.length) {
      ;[questions[index], questions[targetIndex]] = [questions[targetIndex], questions[index]]
      onChange({ questions })
    }
  }

  const updateNewQuestionOption = (index: number, value: string) => {
    const options = [...(newQuestion.options || [])]
    options[index] = value
    setNewQuestion({ ...newQuestion, options })
  }

  const addNewQuestionOption = () => {
    const options = [...(newQuestion.options || []), ""]
    setNewQuestion({ ...newQuestion, options })
  }

  const removeNewQuestionOption = (index: number) => {
    const options = (newQuestion.options || []).filter((_, i) => i !== index)
    setNewQuestion({ ...newQuestion, options })
  }

  const getTotalPoints = () => {
    return content.questions.reduce((total, q) => total + q.points, 0)
  }

  const getQuestionTypeIcon = (type: Question["type"]) => {
    const typeConfig = questionTypes.find((t) => t.value === type)
    return typeConfig?.icon || HelpCircle
  }

  return (
    <div className="space-y-6">
      {/* Quiz Statistics */}
      <Card className="bg-blue-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{content.questions.length}</div>
              <div className="text-sm text-gray-600">Questões</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{getTotalPoints()}</div>
              <div className="text-sm text-gray-600">Pontos Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {content.questions.length > 0 ? Math.round((getTotalPoints() / content.questions.length) * 10) / 10 : 0}
              </div>
              <div className="text-sm text-gray-600">Média por Questão</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Questions */}
      {content.questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Questões do Quiz ({content.questions.length})
          </h3>

          {content.questions.map((question, index) => {
            const Icon = getQuestionTypeIcon(question.type)

            return (
              <Card key={question.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm capitalize">
                        {questionTypes.find((t) => t.value === question.type)?.label}
                      </span>
                      <Badge variant="secondary">{question.points} pts</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveQuestion(question.id, "down")}
                        disabled={index === content.questions.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingQuestion(editingQuestion === question.id ? null : question.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{question.question}</p>
                    </div>

                    {question.type === "multiple" && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded border ${
                              option === question.correctAnswer ? "bg-green-50 border-green-200" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono">{String.fromCharCode(65 + optIndex)})</span>
                              <span>{option}</span>
                              {option === question.correctAnswer && (
                                <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "truefalse" && (
                      <div className="flex gap-4">
                        <div
                          className={`p-2 rounded border ${
                            question.correctAnswer === "Verdadeiro" ? "bg-green-50 border-green-200" : "bg-gray-50"
                          }`}
                        >
                          Verdadeiro
                          {question.correctAnswer === "Verdadeiro" && (
                            <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                          )}
                        </div>
                        <div
                          className={`p-2 rounded border ${
                            question.correctAnswer === "Falso" ? "bg-green-50 border-green-200" : "bg-gray-50"
                          }`}
                        >
                          Falso
                          {question.correctAnswer === "Falso" && (
                            <CheckCircle className="h-4 w-4 text-green-600 inline ml-2" />
                          )}
                        </div>
                      </div>
                    )}

                    {question.type === "text" && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-gray-600">Resposta esperada:</p>
                        <p className="font-medium">{question.correctAnswer}</p>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Explicação:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Separator />

      {/* Add New Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Nova Questão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Questão</Label>
              <Select
                value={newQuestion.type}
                onValueChange={(type) => setNewQuestion({ ...newQuestion, type: type as Question["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pontuação</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newQuestion.points}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div>
            <Label>Pergunta *</Label>
            <Textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Digite a pergunta..."
              className="min-h-[80px]"
            />
          </div>

          {/* Multiple Choice Options */}
          {newQuestion.type === "multiple" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Opções de Resposta</Label>
                <Button variant="outline" size="sm" onClick={addNewQuestionOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Opção
                </Button>
              </div>

              {(newQuestion.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-mono w-6">{String.fromCharCode(65 + index)})</span>
                  <Input
                    value={option}
                    onChange={(e) => updateNewQuestionOption(index, e.target.value)}
                    placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNewQuestionOption(index)}
                    disabled={(newQuestion.options?.length || 0) <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Correct Answer */}
          <div>
            <Label>Resposta Correta *</Label>
            {newQuestion.type === "multiple" ? (
              <Select
                value={newQuestion.correctAnswer}
                onValueChange={(answer) => setNewQuestion({ ...newQuestion, correctAnswer: answer })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a resposta correta" />
                </SelectTrigger>
                <SelectContent>
                  {(newQuestion.options || [])
                    .filter((opt) => opt.trim())
                    .map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {String.fromCharCode(65 + index)}) {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : newQuestion.type === "truefalse" ? (
              <Select
                value={newQuestion.correctAnswer}
                onValueChange={(answer) => setNewQuestion({ ...newQuestion, correctAnswer: answer })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione verdadeiro ou falso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Verdadeiro">Verdadeiro</SelectItem>
                  <SelectItem value="Falso">Falso</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Textarea
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                placeholder="Digite a resposta esperada..."
              />
            )}
          </div>

          <div>
            <Label>Explicação (Opcional)</Label>
            <Textarea
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              placeholder="Explique por que esta é a resposta correta..."
            />
          </div>

          <Button
            onClick={addQuestion}
            disabled={!newQuestion.question || !newQuestion.correctAnswer}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Questão
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuizCreator
