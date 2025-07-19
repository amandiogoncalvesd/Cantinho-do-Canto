"use client"

import { Table } from "@/components/ui/table"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  ImageIcon,
  Video,
  Music,
  Play,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const RichTextEditor = ({ content, onChange, placeholder = "Escreva o conteúdo da aula..." }: RichTextEditorProps) => {
  const [showPreview, setShowPreview] = useState(false)
  const [showToolbar, setShowToolbar] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [selectedFont, setSelectedFont] = useState("Arial")
  const [selectedSize, setSelectedSize] = useState("14")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [selectedBgColor, setSelectedBgColor] = useState("#ffffff")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const fonts = [
    "Arial",
    "Georgia",
    "Times New Roman",
    "Helvetica",
    "Verdana",
    "Courier New",
    "Comic Sans MS",
    "Impact",
    "Trebuchet MS",
    "Palatino",
  ]

  const sizes = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32"]

  const colors = [
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#cccccc",
    "#ffffff",
    "#ff0000",
    "#ff6600",
    "#ffcc00",
    "#33cc00",
    "#0066cc",
    "#6600cc",
    "#ff3366",
    "#ff9933",
    "#ffff33",
    "#66ff33",
    "#3366ff",
    "#9933ff",
    "#cc0000",
    "#cc6600",
    "#cccc00",
    "#00cc00",
    "#0000cc",
    "#6600cc",
  ]

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newText = content.substring(0, start) + text + content.substring(start)
    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  const handleSearch = () => {
    if (!searchTerm) return
    const textarea = textareaRef.current
    if (!textarea) return

    const index = content.toLowerCase().indexOf(searchTerm.toLowerCase())
    if (index !== -1) {
      textarea.focus()
      textarea.setSelectionRange(index, index + searchTerm.length)
    }
  }

  const handleReplace = () => {
    if (!searchTerm || !replaceTerm) return
    const newContent = content.replace(new RegExp(searchTerm, "gi"), replaceTerm)
    onChange(newContent)
  }

  const getWordCount = () => {
    return content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const getCharCount = () => {
    return content.length
  }

  const formatPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^&gt; (.*$)/gm, "<blockquote>$1</blockquote>")
      .replace(/\n/g, "<br>")
  }

  const toolbarSections = {
    formatting: [
      { icon: Bold, label: "Negrito", action: () => insertText("**", "**"), shortcut: "Ctrl+B" },
      { icon: Italic, label: "Itálico", action: () => insertText("*", "*"), shortcut: "Ctrl+I" },
      { icon: Underline, label: "Sublinhado", action: () => insertText("__", "__"), shortcut: "Ctrl+U" },
      { icon: Strikethrough, label: "Riscado", action: () => insertText("~~", "~~") },
      { icon: Highlighter, label: "Destacar", action: () => insertText("==", "==") },
      { icon: Code, label: "Código", action: () => insertText("`", "`") },
    ],
    structure: [
      { icon: Heading1, label: "Título 1", action: () => insertText("# ") },
      { icon: Heading2, label: "Título 2", action: () => insertText("## ") },
      { icon: Heading3, label: "Título 3", action: () => insertText("### ") },
      { icon: Quote, label: "Citação", action: () => insertText("&gt; ") },
      { icon: Minus, label: "Separador", action: () => insertText("\n---\n") },
    ],
    lists: [
      { icon: List, label: "Lista", action: () => insertText("- ") },
      { icon: ListOrdered, label: "Lista Numerada", action: () => insertText("1. ") },
      { icon: AlignLeft, label: "Alinhar Esquerda", action: () => insertText("[left]", "[/left]") },
      { icon: AlignCenter, label: "Centralizar", action: () => insertText("[center]", "[/center]") },
      { icon: AlignRight, label: "Alinhar Direita", action: () => insertText("[right]", "[/right]") },
      { icon: AlignJustify, label: "Justificar", action: () => insertText("[justify]", "[/justify]") },
    ],
    media: [
      { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
      { icon: ImageIcon, label: "Imagem", action: () => insertText("![alt](", ")") },
      { icon: Video, label: "Vídeo", action: () => insertText("[video](", ")") },
      { icon: Music, label: "Áudio", action: () => insertText("[audio](", ")") },
      {
        icon: Table,
        label: "Tabela",
        action: () => insertText("\n| Coluna 1 | Coluna 2 |\n|----------|----------|\n| Célula 1 | Célula 2 |\n"),
      },
    ],
    musical: [
      { icon: ImageIcon, label: "Acorde", action: () => insertText("[chord]", "[/chord]") },
      {
        icon: Music,
        label: "Tablatura",
        action: () => insertText("\n```tab\ne|-----|\nB|-----|\nG|-----|\nD|-----|\nA|-----|\nE|-----|\n```\n"),
      },
      { icon: Play, label: "BPM", action: () => insertText("[bpm]120[/bpm]") },
      { icon: ImageIcon, label: "Compasso", action: () => insertText("[time]4/4[/time]") },
    ],
    special: [
      { icon: ImageIcon, label: "Data", action: () => insertAtCursor(new Date().toLocaleDateString("pt-BR")) },
      { icon: ImageIcon, label: "Horário", action: () => insertAtCursor(new Date().toLocaleTimeString("pt-BR")) },
      { icon: ImageIcon, label: "Local", action: () => insertAtCursor("Cantinho do Canto - Huambo") },
      { icon: ImageIcon, label: "Emoji Musical", action: () => insertAtCursor("🎵") },
      { icon: ImageIcon, label: "Emoji Violão", action: () => insertAtCursor("🎸") },
      { icon: ImageIcon, label: "Motivação", action: () => insertAtCursor("💪 Você consegue!") },
    ],
    alerts: [
      {
        icon: ImageIcon,
        label: "Sucesso",
        action: () => insertText("\n[success]", "[/success]\n"),
        color: "text-green-600",
      },
      {
        icon: ImageIcon,
        label: "Aviso",
        action: () => insertText("\n[warning]", "[/warning]\n"),
        color: "text-yellow-600",
      },
      {
        icon: ImageIcon,
        label: "Informação",
        action: () => insertText("\n[info]", "[/info]\n"),
        color: "text-blue-600",
      },
      { icon: ImageIcon, label: "Erro", action: () => insertText("\n[error]", "[/error]\n"), color: "text-red-600" },
    ],
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Editor de Texto Avançado
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowToolbar(!showToolbar)}>
              {showToolbar ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              Ferramentas
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? <ImageIcon className="h-4 w-4" /> : <ImageIcon className="h-4 w-4" />}
              Preview
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ações Rápidas */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <Button variant="ghost" size="sm" onClick={() => insertText("", "")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => insertText("", "")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(content)}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onChange("")}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />

          {/* Buscar e Substituir */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-24 h-8"
            />
            <Button variant="ghost" size="sm" onClick={handleSearch}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Substituir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buscar e Substituir</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Buscar</Label>
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Texto a buscar..."
                  />
                </div>
                <div>
                  <Label>Substituir por</Label>
                  <Input
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    placeholder="Novo texto..."
                  />
                </div>
                <Button onClick={handleReplace} className="w-full">
                  Substituir Tudo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Controles de Estilo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="text-xs">Fonte</Label>
            <Select value={selectedFont} onValueChange={setSelectedFont}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Tamanho</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Cor do Texto</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-full bg-transparent">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-xs">Cor de Fundo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-full bg-transparent">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: selectedBgColor }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-6 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedBgColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Toolbar Organizada */}
        {showToolbar && (
          <Tabs defaultValue="formatting" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="formatting">Formatação</TabsTrigger>
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
              <TabsTrigger value="lists">Listas</TabsTrigger>
              <TabsTrigger value="media">Mídia</TabsTrigger>
              <TabsTrigger value="musical">Musical</TabsTrigger>
              <TabsTrigger value="special">Especiais</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
            </TabsList>

            {Object.entries(toolbarSections).map(([key, tools]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {tools.map((tool, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={tool.action}
                      className={`flex flex-col items-center gap-1 h-auto py-2 ${tool.color || ""}`}
                      title={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ""}`}
                    >
                      <tool.icon className="h-4 w-4" />
                      <span className="text-xs">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Editor e Preview */}
        <div className={`grid gap-4 ${showPreview ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Conteúdo da Aula</Label>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{getWordCount()} palavras</span>
                <span>{getCharCount()} caracteres</span>
              </div>
            </div>
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[400px] font-mono"
              style={{
                fontFamily: selectedFont,
                fontSize: `${selectedSize}px`,
                color: selectedColor,
                backgroundColor: selectedBgColor,
              }}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div
                className="min-h-[400px] p-4 border rounded-md bg-white prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatPreview(content) }}
              />
            </div>
          )}
        </div>

        {/* Guia de Formatação */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Guia Rápido de Formatação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <h4 className="font-semibold mb-2">Texto</h4>
                <ul className="space-y-1">
                  <li>
                    <code>**negrito**</code> → <strong>negrito</strong>
                  </li>
                  <li>
                    <code>*itálico*</code> → <em>itálico</em>
                  </li>
                  <li>
                    <code>__sublinhado__</code> → <u>sublinhado</u>
                  </li>
                  <li>
                    <code>~~riscado~~</code> → <del>riscado</del>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Estrutura</h4>
                <ul className="space-y-1">
                  <li>
                    <code># Título 1</code>
                  </li>
                  <li>
                    <code>## Título 2</code>
                  </li>
                  <li>
                    <code>### Título 3</code>
                  </li>
                  <li>
                    <code>&gt; Citação</code>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Musical</h4>
                <ul className="space-y-1">
                  <li>
                    <code>[chord]Am[/chord]</code>
                  </li>
                  <li>
                    <code>[bpm]120[/bpm]</code>
                  </li>
                  <li>
                    <code>[time]4/4[/time]</code>
                  </li>
                  <li>🎵 🎸 🎼 ♪ ♫</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default RichTextEditor
