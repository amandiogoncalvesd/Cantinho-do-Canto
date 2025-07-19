"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Guitar, Music, RotateCcw } from "lucide-react"

interface ChordCreatorProps {
  content: { name: string; frets: number[]; fingers: number[]; difficulty: string }
  onChange: (content: { name: string; frets: number[]; fingers: number[]; difficulty: string }) => void
}

const ChordCreator = ({ content, onChange }: ChordCreatorProps) => {
  const [selectedString, setSelectedString] = useState<number | null>(null)

  const strings = ["E", "A", "D", "G", "B", "e"]
  const difficulties = ["Fácil", "Médio", "Difícil"]
  const commonChords = [
    { name: "C", frets: [0, 1, 0, 2, 1, 0], fingers: [0, 1, 0, 3, 2, 0] },
    { name: "G", frets: [3, 2, 0, 0, 3, 3], fingers: [3, 2, 0, 0, 4, 4] },
    { name: "Am", frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    { name: "F", frets: [1, 1, 3, 3, 2, 1], fingers: [1, 1, 3, 4, 2, 1] },
    { name: "D", frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    { name: "Em", frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  ]

  const updateFret = (stringIndex: number, fret: number) => {
    const newFrets = [...content.frets]
    const newFingers = [...content.fingers]

    if (newFrets.length < 6) {
      newFrets.length = 6
      newFrets.fill(0)
    }
    if (newFingers.length < 6) {
      newFingers.length = 6
      newFingers.fill(0)
    }

    newFrets[stringIndex] = fret

    onChange({
      ...content,
      frets: newFrets,
      fingers: newFingers,
    })
  }

  const updateFinger = (stringIndex: number, finger: number) => {
    const newFingers = [...content.fingers]

    if (newFingers.length < 6) {
      newFingers.length = 6
      newFingers.fill(0)
    }

    newFingers[stringIndex] = finger

    onChange({
      ...content,
      fingers: newFingers,
    })
  }

  const loadPresetChord = (chord: (typeof commonChords)[0]) => {
    onChange({
      name: chord.name,
      frets: chord.frets,
      fingers: chord.fingers,
      difficulty: content.difficulty || "Fácil",
    })
  }

  const clearChord = () => {
    onChange({
      name: "",
      frets: [0, 0, 0, 0, 0, 0],
      fingers: [0, 0, 0, 0, 0, 0],
      difficulty: "Fácil",
    })
  }

  const renderChordDiagram = () => {
    const frets = content.frets.length === 6 ? content.frets : [0, 0, 0, 0, 0, 0]
    const fingers = content.fingers.length === 6 ? content.fingers : [0, 0, 0, 0, 0, 0]

    return (
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold">{content.name || "Acorde"}</h3>
          {content.difficulty && (
            <Badge variant="outline" className="mt-1">
              {content.difficulty}
            </Badge>
          )}
        </div>

        {/* Chord Diagram */}
        <div className="relative mx-auto" style={{ width: "200px", height: "240px" }}>
          {/* Nut */}
          <div className="absolute top-0 left-4 right-4 h-1 bg-gray-800 rounded"></div>

          {/* Frets */}
          {[1, 2, 3, 4, 5].map((fret) => (
            <div
              key={fret}
              className="absolute left-4 right-4 h-0.5 bg-gray-400"
              style={{ top: `${fret * 40}px` }}
            ></div>
          ))}

          {/* Strings */}
          {strings.map((string, index) => (
            <div key={index}>
              {/* String line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-gray-600" style={{ left: `${16 + index * 32}px` }}></div>

              {/* String label */}
              <div
                className="absolute text-xs font-bold text-center"
                style={{
                  left: `${12 + index * 32}px`,
                  top: "-20px",
                  width: "8px",
                }}
              >
                {string}
              </div>

              {/* Fret marker */}
              {frets[index] > 0 && frets[index] <= 5 && (
                <div
                  className="absolute w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    left: `${4 + index * 32}px`,
                    top: `${frets[index] * 40 - 20}px`,
                  }}
                >
                  {fingers[index] || ""}
                </div>
              )}

              {/* Open string marker */}
              {frets[index] === 0 && (
                <div
                  className="absolute w-4 h-4 border-2 border-gray-800 rounded-full bg-white"
                  style={{
                    left: `${8 + index * 32}px`,
                    top: "-28px",
                  }}
                ></div>
              )}

              {/* Muted string marker */}
              {frets[index] === -1 && (
                <div
                  className="absolute text-lg font-bold text-red-600"
                  style={{
                    left: `${10 + index * 32}px`,
                    top: "-28px",
                  }}
                >
                  ×
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ASCII Representation */}
        <div className="mt-6 p-3 bg-gray-100 rounded font-mono text-sm">
          <div className="text-center mb-2 font-bold">{content.name}</div>
          {strings.map((string, index) => (
            <div key={index}>
              {string}|{frets[index] === -1 ? "---X---" : `---${frets[index]}---`}|
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chord Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Guitar className="h-5 w-5" />
            Informações do Acorde
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Nome do Acorde</Label>
              <Input
                value={content.name}
                onChange={(e) => onChange({ ...content, name: e.target.value })}
                placeholder="Ex: C, Am, F#m7..."
              />
            </div>
            <div>
              <Label>Dificuldade</Label>
              <Select value={content.difficulty} onValueChange={(difficulty) => onChange({ ...content, difficulty })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preset Chords */}
          <div>
            <Label className="mb-2 block">Acordes Comuns</Label>
            <div className="flex flex-wrap gap-2">
              {commonChords.map((chord) => (
                <Button key={chord.name} variant="outline" size="sm" onClick={() => loadPresetChord(chord)}>
                  {chord.name}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={clearChord}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chord Editor */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Editor Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strings.map((string, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <Label className="font-mono font-bold">{string}</Label>
                  <div>
                    <Label className="text-xs">Casa</Label>
                    <Select
                      value={content.frets[index]?.toString() || "0"}
                      onValueChange={(value) => updateFret(index, Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1">X (mudo)</SelectItem>
                        <SelectItem value="0">0 (solto)</SelectItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((fret) => (
                          <SelectItem key={fret} value={fret.toString()}>
                            {fret}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Dedo</Label>
                    <Select
                      value={content.fingers[index]?.toString() || "0"}
                      onValueChange={(value) => updateFinger(index, Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">-</SelectItem>
                        <SelectItem value="1">1 (indicador)</SelectItem>
                        <SelectItem value="2">2 (médio)</SelectItem>
                        <SelectItem value="3">3 (anelar)</SelectItem>
                        <SelectItem value="4">4 (mínimo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {string} corda
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chord Diagram Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Visualização
            </CardTitle>
          </CardHeader>
          <CardContent>{renderChordDiagram()}</CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm">Como usar o Editor de Acordes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Casa:</strong> Número da casa onde pressionar a corda (0 = solto, X = mudo)
          </p>
          <p>
            <strong>Dedo:</strong> Qual dedo usar (1 = indicador, 2 = médio, 3 = anelar, 4 = mínimo)
          </p>
          <p>
            <strong>Cordas:</strong> E (6ª), A (5ª), D (4ª), G (3ª), B (2ª), e (1ª)
          </p>
          <p>
            <strong>Dica:</strong> Use os acordes comuns como base e modifique conforme necessário
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChordCreator
