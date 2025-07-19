import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, RotateCcw } from "lucide-react";

interface ChordCreatorProps {
  content: { name: string; frets: number[]; fingers?: number[] };
  onChange: (content: { name: string; frets: number[]; fingers?: number[] }) => void;
}

const ChordCreator = ({ content, onChange }: ChordCreatorProps) => {
  const [selectedString, setSelectedString] = useState<number | null>(null);

  const strings = ['E', 'A', 'D', 'G', 'B', 'E'];
  const frets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleFretClick = (stringIndex: number, fret: number) => {
    const newFrets = [...content.frets];
    newFrets[stringIndex] = fret;
    onChange({ ...content, frets: newFrets });
  };

  const handleNameChange = (name: string) => {
    onChange({ ...content, name });
  };

  const resetChord = () => {
    onChange({ name: '', frets: [0, 0, 0, 0, 0, 0] });
  };

  const commonChords = [
    { name: 'C', frets: [0, 3, 2, 0, 1, 0] },
    { name: 'G', frets: [3, 2, 0, 0, 3, 3] },
    { name: 'Am', frets: [0, 0, 2, 2, 1, 0] },
    { name: 'F', frets: [1, 3, 3, 2, 1, 1] },
    { name: 'D', frets: [0, 0, 0, 2, 3, 2] },
    { name: 'Em', frets: [0, 2, 2, 0, 0, 0] },
    { name: 'E', frets: [0, 2, 2, 1, 0, 0] },
    { name: 'A', frets: [0, 0, 2, 2, 2, 0] }
  ];

  const loadCommonChord = (chord: { name: string; frets: number[] }) => {
    onChange({ ...content, name: chord.name, frets: chord.frets });
  };

  const getFretDisplay = (fret: number) => {
    if (fret === 0) return 'o'; // Open string
    if (fret === -1) return 'x'; // Muted string
    return fret.toString();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="chord-name">Nome do Acorde</Label>
            <Input
              id="chord-name"
              placeholder="Ex: C, Am, G7..."
              value={content.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={resetChord} size="sm">
            <RotateCcw className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        </div>

        {/* Common Chords */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Acordes Comuns</Label>
          <div className="flex flex-wrap gap-2">
            {commonChords.map((chord, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => loadCommonChord(chord)}
                className="text-xs"
              >
                {chord.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Chord Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Music className="h-5 w-5" />
            {content.name || 'Acorde'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Fret Numbers Display */}
            <div className="flex justify-center items-center gap-8 mb-4">
              {content.frets.map((fret, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">
                    {strings[index]}
                  </div>
                  <Badge 
                    variant={fret === 0 ? "secondary" : "default"}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono"
                  >
                    {getFretDisplay(fret)}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Visual Fretboard */}
            <div className="relative">
              <div className="grid grid-cols-6 gap-1">
                {/* Strings (vertical lines) */}
                {strings.map((string, stringIndex) => (
                  <div key={stringIndex} className="flex flex-col items-center">
                    {/* String name */}
                    <div className="text-xs font-medium mb-2 text-muted-foreground">
                      {string}
                    </div>
                    
                    {/* Frets for this string */}
                    <div className="flex flex-col space-y-1">
                      {frets.slice(0, 5).map((fret, fretIndex) => (
                        <button
                          key={fret}
                          onClick={() => handleFretClick(stringIndex, fret)}
                          className={`
                            w-8 h-6 border border-muted-foreground/30 rounded-sm
                            transition-all duration-200 hover:bg-accent
                            ${content.frets[stringIndex] === fret 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-background'
                            }
                            ${fret === 0 ? 'border-2 border-primary/50' : ''}
                          `}
                        >
                          {content.frets[stringIndex] === fret && (
                            <div className="w-3 h-3 bg-current rounded-full mx-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fret numbers */}
              <div className="flex flex-col items-start ml-4 mt-8 space-y-1">
                {frets.slice(0, 5).map((fret) => (
                  <div 
                    key={fret} 
                    className="h-6 flex items-center text-xs text-muted-foreground"
                  >
                    {fret === 0 ? 'Nut' : fret}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Clique nas casas para posicionar os dedos</p>
              <p className="text-xs mt-1">
                <span className="font-medium">o</span> = corda solta • 
                <span className="font-medium">números</span> = casa pressionada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chord Notation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Notação do Acorde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-center space-y-2">
            <div className="text-xs text-muted-foreground">
              {strings.join('  ')}
            </div>
            <div className="text-lg font-bold">
              {content.frets.map(fret => getFretDisplay(fret)).join('  ')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChordCreator;
