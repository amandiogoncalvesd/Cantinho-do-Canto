"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Edit,
  LinkIcon,
  ImageIcon,
  Table,
  Code,
  Palette,
  Type,
  Highlighter,
  Music,
  FileText,
  Video,
  Mic,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  Smile,
  Zap,
  Target,
  Award,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Minus,
  RotateCcw,
  RotateCw,
  Copy,
  Scissors,
  ClipboardPaste,
  Search,
  Replace,
  Save,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react"

interface RichTextEditorProps {
  content: { content: string }
  onChange: (content: { content: string }) => void
}

interface ToolbarSection {
  title: string
  icon: any
  tools: ToolbarTool[]
}

interface ToolbarTool {
  name: string
  icon: any
  action: string
  shortcut?: string
  description?: string
  color?: string
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 })
  const [showToolbar, setShowToolbar] = useState(true)
  const [activeSection, setActiveSection] = useState("formatting")
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBgColor] = useState("#ffffff")
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Toolbar sections organized in lists
  const toolbarSections: ToolbarSection[] = [
    {
      title: "Formatação de Texto",
      icon: Type,
      tools: [
        { name: "Negrito", icon: Bold, action: "bold", shortcut: "Ctrl+B", description: "Deixar texto em negrito" },
        { name: "Itálico", icon: Italic, action: "italic", shortcut: "Ctrl+I", description: "Deixar texto em itálico" },
        {
          name: "Sublinhado",
          icon: Underline,
          action: "underline",
          shortcut: "Ctrl+U",
          description: "Sublinhar texto",
        },
        { name: "Riscado", icon: Strikethrough, action: "strikethrough", description: "Riscar texto" },
        { name: "Destacar", icon: Highlighter, action: "highlight", description: "Destacar texto com cor" },
        { name: "Código", icon: Code, action: "code", description: "Formatar como código" },
      ],
    },
    {
      title: "Títulos e Estrutura",
      icon: Heading1,
      tools: [
        {
          name: "Título Principal",
          icon: Heading1,
          action: "h1",
          shortcut: "Ctrl+1",
          description: "Título grande (H1)",
        },
        { name: "Subtítulo", icon: Heading2, action: "h2", shortcut: "Ctrl+2", description: "Subtítulo médio (H2)" },
        {
          name: "Título Pequeno",
          icon: Heading3,
          action: "h3",
          shortcut: "Ctrl+3",
          description: "Título pequeno (H3)",
        },
        { name: "Citação", icon: Quote, action: "quote", description: "Bloco de citação" },
        { name: "Separador", icon: Minus, action: "separator", description: "Linha separadora" },
      ],
    },
    {
      title: "Listas e Alinhamento",
      icon: List,
      tools: [
        { name: "Lista com Pontos", icon: List, action: "ul", description: "Lista não ordenada" },
        { name: "Lista Numerada", icon: ListOrdered, action: "ol", description: "Lista ordenada" },
        { name: "Alinhar Esquerda", icon: AlignLeft, action: "left", description: "Alinhar à esquerda" },
        { name: "Centralizar", icon: AlignCenter, action: "center", description: "Centralizar texto" },
        { name: "Alinhar Direita", icon: AlignRight, action: "right", description: "Alinhar à direita" },
        { name: "Justificar", icon: AlignJustify, action: "justify", description: "Justificar texto" },
      ],
    },
    {
      title: "Mídia e Links",
      icon: ImageIcon,
      tools: [
        { name: "Inserir Link", icon: LinkIcon, action: "link", shortcut: "Ctrl+K", description: "Adicionar link" },
        { name: "Inserir Imagem", icon: ImageIcon, action: "image", description: "Adicionar imagem" },
        { name: "Inserir Vídeo", icon: Video, action: "video", description: "Embed de vídeo" },
        { name: "Inserir Áudio", icon: Mic, action: "audio", description: "Embed de áudio" },
        { name: "Inserir Tabela", icon: Table, action: "table", description: "Criar tabela" },
      ],
    },
    {
      title: "Elementos Musicais",
      icon: Music,
      tools: [
        { name: "Acorde", icon: Music, action: "chord", description: "Inserir acorde de violão" },
        { name: "Tablatura", icon: FileText, action: "tab", description: "Inserir tablatura" },
        { name: "Partitura", icon: BookOpen, action: "sheet", description: "Inserir partitura" },
        { name: "Metrônomo", icon: Clock, action: "metronome", description: "Indicação de tempo" },
        { name: "Nota Musical", icon: Music, action: "note", description: "Símbolo de nota" },
      ],
    },
    {
      title: "Elementos Especiais",
      icon: Star,
      tools: [
        { name: "Data", icon: Calendar, action: "date", description: "Inserir data atual" },
        { name: "Horário", icon: Clock, action: "time", description: "Inserir horário atual" },
        { name: "Localização", icon: MapPin, action: "location", description: "Inserir localização" },
        { name: "Emoji Feliz", icon: Smile, action: "emoji-happy", description: "😊" },
        { name: "Estrela", icon: Star, action: "emoji-star", description: "⭐" },
        { name: "Coração", icon: Heart, action: "emoji-heart", description: "❤️" },
        { name: "Raio", icon: Zap, action: "emoji-zap", description: "⚡" },
        { name: "Alvo", icon: Target, action: "emoji-target", description: "🎯" },
        { name: "Troféu", icon: Award, action: "emoji-trophy", description: "🏆" },
        { name: "Lâmpada", icon: Lightbulb, action: "emoji-idea", description: "💡" },
      ],
    },
    {
      title: "Alertas e Avisos",
      icon: AlertCircle,
      tools: [
        {
          name: "Sucesso",
          icon: CheckCircle,
          action: "alert-success",
          description: "Caixa de sucesso",
          color: "text-green-600",
        },
        {
          name: "Aviso",
          icon: AlertCircle,
          action: "alert-warning",
          description: "Caixa de aviso",
          color: "text-yellow-600",
        },
        {
          name: "Informação",
          icon: Info,
          action: "alert-info",
          description: "Caixa de informação",
          color: "text-blue-600",
        },
        { name: "Erro", icon: XCircle, action: "alert-error", description: "Caixa de erro", color: "text-red-600" },
      ],
    },
  ]

  // Quick actions for common operations
  const quickActions = [
    { name: "Desfazer", icon: RotateCcw, action: "undo", shortcut: "Ctrl+Z" },
    { name: "Refazer", icon: RotateCw, action: "redo", shortcut: "Ctrl+Y" },
    { name: "Copiar", icon: Copy, action: "copy", shortcut: "Ctrl+C" },
    { name: "Recortar", icon: Scissors, action: "cut", shortcut: "Ctrl+X" },
    { name: "Colar", icon: ClipboardPaste, action: "paste", shortcut: "Ctrl+V" },
    { name: "Salvar", icon: Save, action: "save", shortcut: "Ctrl+S" },
  ]

  // Font families available
  const fontFamilies = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Monaco",
    "Roboto",
    "Open Sans",
  ]

  // Font sizes
  const fontSizes = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48"]

  // Color presets
  const colorPresets = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#8B4513",
    "#2F4F4F",
    "#800080",
    "#008080",
    "#FF4500",
    "#32CD32",
  ]

  useEffect(() => {
    const text = content.content
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    setCharCount(text.length)
  }, [content.content])

  const insertMarkdown = (markdown: string, wrapSelected = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = content.content
    const selectedText = text.substring(start, end)

    let newText = text
    let newCursorPos = start

    if (wrapSelected && selectedText) {
      // Wrap selected text
      newText = text.substring(0, start) + markdown.replace("{}", selectedText) + text.substring(end)
      newCursorPos = start + markdown.indexOf("{}") + selectedText.length
    } else {
      // Insert at cursor position
      newText = text.substring(0, start) + markdown + text.substring(end)
      newCursorPos = start + markdown.length
    }

    onChange({ content: newText })

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const formatText = (action: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.content.substring(start, end)

    switch (action) {
      case "bold":
        insertMarkdown(selectedText ? `**${selectedText}**` : "**texto em negrito**")
        break
      case "italic":
        insertMarkdown(selectedText ? `*${selectedText}*` : "*texto em itálico*")
        break
      case "underline":
        insertMarkdown(selectedText ? `<u>${selectedText}</u>` : "<u>texto sublinhado</u>")
        break
      case "strikethrough":
        insertMarkdown(selectedText ? `~~${selectedText}~~` : "~~texto riscado~~")
        break
      case "highlight":
        insertMarkdown(selectedText ? `<mark>${selectedText}</mark>` : "<mark>texto destacado</mark>")
        break
      case "code":
        insertMarkdown(selectedText ? `\`${selectedText}\`` : "`código`")
        break
      case "h1":
        insertMarkdown("# Título Principal\n")
        break
      case "h2":
        insertMarkdown("## Subtítulo\n")
        break
      case "h3":
        insertMarkdown("### Título Pequeno\n")
        break
      case "quote":
        insertMarkdown("> Citação importante\n")
        break
      case "separator":
        insertMarkdown("\n---\n")
        break
      case "ul":
        insertMarkdown("- Item da lista\n")
        break
      case "ol":
        insertMarkdown("1. Item numerado\n")
        break
      case "center":
        insertMarkdown(selectedText ? `<center>${selectedText}</center>` : "<center>texto centralizado</center>")
        break
      case "right":
        insertMarkdown(
          selectedText ? `<div align="right">${selectedText}</div>` : '<div align="right">texto à direita</div>',
        )
        break
      case "justify":
        insertMarkdown(
          selectedText ? `<div align="justify">${selectedText}</div>` : '<div align="justify">texto justificado</div>',
        )
        break
      case "link":
        const url = prompt("Digite a URL do link:")
        if (url) {
          insertMarkdown(selectedText ? `[${selectedText}](${url})` : `[texto do link](${url})`)
        }
        break
      case "image":
        const imgUrl = prompt("Digite a URL da imagem:")
        if (imgUrl) {
          const alt = prompt("Digite o texto alternativo (opcional):") || "Imagem"
          insertMarkdown(`![${alt}](${imgUrl})\n`)
        }
        break
      case "video":
        const videoUrl = prompt("Digite a URL do vídeo (YouTube, Vimeo, etc.):")
        if (videoUrl) {
          insertMarkdown(
            `\n<video controls>\n  <source src="${videoUrl}" type="video/mp4">\n  Seu navegador não suporta vídeo.\n</video>\n`,
          )
        }
        break
      case "audio":
        const audioUrl = prompt("Digite a URL do áudio:")
        if (audioUrl) {
          insertMarkdown(
            `\n<audio controls>\n  <source src="${audioUrl}" type="audio/mpeg">\n  Seu navegador não suporta áudio.\n</audio>\n`,
          )
        }
        break
      case "table":
        insertMarkdown(
          "\n| Coluna 1 | Coluna 2 | Coluna 3 |\n|----------|----------|----------|\n| Linha 1  | Dados    | Dados    |\n| Linha 2  | Dados    | Dados    |\n\n",
        )
        break
      case "chord":
        const chordName = prompt("Digite o nome do acorde (ex: Em, C, G):")
        if (chordName) {
          insertMarkdown(
            `\n**Acorde ${chordName}:**\n\`\`\`\ne|---0---|\nB|---0---|\nG|---0---|\nD|---2---|\nA|---2---|\nE|---0---|\n\`\`\`\n`,
          )
        }
        break
      case "tab":
        insertMarkdown(
          "\n**Tablatura:**\n```\ne|------------------------|\nB|------------------------|\nG|------------------------|\nD|------------------------|\nA|------------------------|\nE|------------------------|\n```\n",
        )
        break
      case "sheet":
        insertMarkdown("\n**Partitura:** [Inserir partitura aqui]\n")
        break
      case "metronome":
        const bpm = prompt("Digite o BPM (ex: 120):") || "120"
        insertMarkdown(`\n🎵 **Tempo:** ${bpm} BPM\n`)
        break
      case "note":
        insertMarkdown("♪ ")
        break
      case "date":
        insertMarkdown(new Date().toLocaleDateString("pt-BR"))
        break
      case "time":
        insertMarkdown(new Date().toLocaleTimeString("pt-BR"))
        break
      case "location":
        insertMarkdown("📍 Huambo / Centralidade do Lossambo")
        break
      case "emoji-happy":
        insertMarkdown("😊 ")
        break
      case "emoji-star":
        insertMarkdown("⭐ ")
        break
      case "emoji-heart":
        insertMarkdown("❤️ ")
        break
      case "emoji-zap":
        insertMarkdown("⚡ ")
        break
      case "emoji-target":
        insertMarkdown("🎯 ")
        break
      case "emoji-trophy":
        insertMarkdown("🏆 ")
        break
      case "emoji-idea":
        insertMarkdown("💡 ")
        break
      case "alert-success":
        insertMarkdown("\n> ✅ **Sucesso:** Mensagem de sucesso aqui\n")
        break
      case "alert-warning":
        insertMarkdown("\n> ⚠️ **Aviso:** Mensagem de aviso aqui\n")
        break
      case "alert-info":
        insertMarkdown("\n> ℹ️ **Informação:** Mensagem informativa aqui\n")
        break
      case "alert-error":
        insertMarkdown("\n> ❌ **Erro:** Mensagem de erro aqui\n")
        break
      case "save":
        // Trigger save action
        console.log("Salvando conteúdo...")
        break
    }
  }

  const findAndReplace = () => {
    if (!searchTerm) return

    const newContent = content.content.replaceAll(searchTerm, replaceTerm)
    onChange({ content: newContent })
    setSearchTerm("")
    setReplaceTerm("")
  }

  const renderPreview = (text: string) => {
    return text
      .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2 text-blue-800">$1</h3>')
      .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-semibold mt-6 mb-3 text-blue-900">$1</h2>')
      .replace(/# (.*?)(\n|$)/g, '<h1 class="text-2xl font-bold mt-8 mb-4 text-blue-950">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline text-gray-800">$1</u>')
      .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-600">$1</del>')
      .replace(/<mark>(.*?)<\/mark>/g, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded font-mono text-sm">$1</code>')
      .replace(
        /> (.*?)(\n|$)/g,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50 py-2">$1</blockquote>',
      )
      .replace(/^---$/gm, '<hr class="my-6 border-gray-300">')
      .replace(/- (.*?)(\n|$)/g, '<li class="ml-6 list-disc mb-1">$1</li>')
      .replace(/\d+\. (.*?)(\n|$)/g, '<li class="ml-6 list-decimal mb-1">$1</li>')
      .replace(
        /\[(.*?)\]$$(.*?)$$/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank">$1</a>',
      )
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 shadow-md">')
      .replace(/\n/g, "<br>")
      .replace(/<center>(.*?)<\/center>/g, '<div class="text-center">$1</div>')
      .replace(/<div align="right">(.*?)<\/div>/g, '<div class="text-right">$1</div>')
      .replace(/<div align="justify">(.*?)<\/div>/g, '<div class="text-justify">$1</div>')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-lg font-semibold">Editor de Conteúdo Avançado</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Use as ferramentas abaixo para criar conteúdo rico e interativo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {wordCount} palavras • {charCount} caracteres
          </Badge>
          <Button variant={isPreview ? "outline" : "default"} size="sm" onClick={() => setIsPreview(false)}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant={isPreview ? "default" : "outline"} size="sm" onClick={() => setIsPreview(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {!isPreview && (
        <>
          {/* Quick Actions Bar */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Ações Rápidas
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowToolbar(!showToolbar)}>
                  {showToolbar ? "Ocultar" : "Mostrar"} Ferramentas
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showToolbar ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => formatText(action.action)}
                    title={`${action.name} (${action.shortcut})`}
                    className="flex items-center gap-1"
                  >
                    <action.icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Toolbar */}
          {showToolbar && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Ferramentas de Formatação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeSection} onValueChange={setActiveSection}>
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                    {toolbarSections.map((section) => (
                      <TabsTrigger
                        key={section.title}
                        value={section.title.toLowerCase().replace(/\s+/g, "")}
                        className="text-xs"
                      >
                        <section.icon className="h-3 w-3 mr-1" />
                        <span className="hidden lg:inline">{section.title.split(" ")[0]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {toolbarSections.map((section) => (
                    <TabsContent
                      key={section.title}
                      value={section.title.toLowerCase().replace(/\s+/g, "")}
                      className="mt-4"
                    >
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <section.icon className="h-4 w-4" />
                          {section.title}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                          {section.tools.map((tool) => (
                            <Button
                              key={tool.action}
                              variant="outline"
                              size="sm"
                              onClick={() => formatText(tool.action)}
                              title={tool.description + (tool.shortcut ? ` (${tool.shortcut})` : "")}
                              className={`flex items-center gap-2 justify-start h-auto py-2 px-3 ${tool.color || ""}`}
                            >
                              <tool.icon className="h-3 w-3 flex-shrink-0" />
                              <div className="text-left">
                                <div className="text-xs font-medium">{tool.name}</div>
                                {tool.shortcut && <div className="text-xs text-muted-foreground">{tool.shortcut}</div>}
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Style Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Controles de Estilo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Fonte</Label>
                  <Select value={fontFamily} onValueChange={setFontFamily}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Tamanho</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cor do Texto</Label>
                  <div className="flex gap-1 flex-wrap">
                    {colorPresets.slice(0, 12).map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                        style={{ backgroundColor: color }}
                        onClick={() => setTextColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Cor de Fundo</Label>
                  <div className="flex gap-1 flex-wrap">
                    {colorPresets.slice(12).map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-500"
                        style={{ backgroundColor: color }}
                        onClick={() => setBgColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Replace */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar e Substituir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="Buscar texto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
                <Input
                  placeholder="Substituir por..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="h-8"
                />
                <Button onClick={findAndReplace} disabled={!searchTerm} size="sm" className="h-8">
                  <Replace className="h-3 w-3 mr-1" />
                  Substituir Tudo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              placeholder="Digite o conteúdo da sua lição aqui...

🎸 Dicas de formatação:
• **negrito** ou *itálico*
• # Título ou ## Subtítulo  
• - Lista ou 1. Lista numerada
• > Citação importante
• [link](url) ou ![imagem](url)
• `código` ou \`\`\`bloco de código\`\`\`

🎵 Elementos musicais:
• Use as ferramentas acima para inserir acordes, tablaturas e partituras
• Adicione elementos interativos como quizzes e exercícios
• Insira mídias como vídeos e áudios para enriquecer o conteúdo"
              value={content.content}
              onChange={(e) => onChange({ content: e.target.value })}
              className="min-h-[400px] font-mono text-sm resize-none"
              style={{
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                color: textColor,
                backgroundColor: backgroundColor,
              }}
            />
          </div>

          {/* Help Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Guia Rápido de Formatação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <h5 className="font-medium mb-2">Texto</h5>
                  <div className="space-y-1 text-muted-foreground">
                    <div>
                      **negrito** → <strong>negrito</strong>
                    </div>
                    <div>
                      *itálico* → <em>itálico</em>
                    </div>
                    <div>
                      ~~riscado~~ → <del>riscado</del>
                    </div>
                    <div>
                      `código` → <code>código</code>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Estrutura</h5>
                  <div className="space-y-1 text-muted-foreground">
                    <div># Título Principal</div>
                    <div>## Subtítulo</div>
                    <div>### Título Pequeno</div>
                    <div>&gt; Citação</div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Listas</h5>
                  <div className="space-y-1 text-muted-foreground">
                    <div>- Item da lista</div>
                    <div>1. Item numerado</div>
                    <div>[link](url)</div>
                    <div>![imagem](url)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Preview */}
      {isPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização do Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] w-full">
              {content.content ? (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderPreview(content.content),
                  }}
                />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhum conteúdo para visualizar</p>
                  <p className="text-sm">Digite algo no editor para ver o preview</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RichTextEditor
