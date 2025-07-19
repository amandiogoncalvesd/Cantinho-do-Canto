import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Plus, X, Check } from "lucide-react";

interface QuizContent {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options?: string[];
  correct?: number | number[] | string;
  explanation?: string;
}

interface QuizCreatorProps {
  content: QuizContent;
  onChange: (content: QuizContent) => void;
}

const QuizCreator = ({ content, onChange }: QuizCreatorProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState<any>(null);

  const handleQuestionChange = (question: string) => {
    onChange({ ...content, question });
  };

  const handleTypeChange = (type: 'multiple-choice' | 'true-false' | 'open-ended') => {
    let newContent: QuizContent = { ...content, type };
    
    if (type === 'multiple-choice') {
      newContent.options = content.options || ['', '', '', ''];
      newContent.correct = 0;
    } else if (type === 'true-false') {
      newContent.options = ['Verdadeiro', 'Falso'];
      newContent.correct = 0;
    } else {
      newContent.options = undefined;
      newContent.correct = '';
    }
    
    onChange(newContent);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!content.options) return;
    const newOptions = [...content.options];
    newOptions[index] = value;
    onChange({ ...content, options: newOptions });
  };

  const addOption = () => {
    if (!content.options) return;
    onChange({ 
      ...content, 
      options: [...content.options, ''] 
    });
  };

  const removeOption = (index: number) => {
    if (!content.options || content.options.length <= 2) return;
    const newOptions = content.options.filter((_, i) => i !== index);
    onChange({ 
      ...content, 
      options: newOptions,
      correct: typeof content.correct === 'number' && content.correct >= index 
        ? Math.max(0, content.correct - 1) 
        : content.correct
    });
  };

  const handleCorrectAnswerChange = (value: any) => {
    onChange({ ...content, correct: value });
  };

  const handleExplanationChange = (explanation: string) => {
    onChange({ ...content, explanation });
  };

  const checkAnswer = () => {
    if (content.type === 'open-ended') {
      return true; // Always correct for open-ended questions
    }
    
    if (content.type === 'multiple-choice' || content.type === 'true-false') {
      return userAnswer === content.correct;
    }
    
    return false;
  };

  const resetPreview = () => {
    setUserAnswer(null);
    setPreviewMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Quiz Type Selection */}
      <div className="space-y-2">
        <Label>Tipo de Pergunta</Label>
        <Select value={content.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de pergunta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple-choice">Múltipla Escolha</SelectItem>
            <SelectItem value="true-false">Verdadeiro ou Falso</SelectItem>
            <SelectItem value="open-ended">Resposta Aberta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Question */}
      <div className="space-y-2">
        <Label htmlFor="question">Pergunta *</Label>
        <Textarea
          id="question"
          placeholder="Digite sua pergunta aqui..."
          value={content.question}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      {/* Options for Multiple Choice and True/False */}
      {(content.type === 'multiple-choice' || content.type === 'true-false') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Opções de Resposta</Label>
            {content.type === 'multiple-choice' && (
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Opção
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {content.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <Badge variant="outline" className="min-w-[24px] h-6 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <Input
                  placeholder={`Opção ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={content.correct === index}
                    onCheckedChange={(checked) => {
                      if (checked) handleCorrectAnswerChange(index);
                    }}
                  />
                  <span className="text-xs text-muted-foreground">Correta</span>
                  {content.type === 'multiple-choice' && content.options && content.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Correct Answer for Open-ended */}
      {content.type === 'open-ended' && (
        <div className="space-y-2">
          <Label htmlFor="correct-answer">Resposta Modelo (opcional)</Label>
          <Textarea
            id="correct-answer"
            placeholder="Digite uma resposta modelo ou palavras-chave..."
            value={content.correct as string || ''}
            onChange={(e) => handleCorrectAnswerChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Esta resposta será usada como referência para o professor avaliar as respostas dos alunos.
          </p>
        </div>
      )}

      {/* Explanation */}
      <div className="space-y-2">
        <Label htmlFor="explanation">Explicação (opcional)</Label>
        <Textarea
          id="explanation"
          placeholder="Explique a resposta correta ou forneça informações adicionais..."
          value={content.explanation || ''}
          onChange={(e) => handleExplanationChange(e.target.value)}
        />
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Preview da Pergunta
            </span>
            <div className="flex gap-2">
              <Button
                variant={previewMode ? "outline" : "default"}
                size="sm"
                onClick={() => setPreviewMode(false)}
              >
                Editar
              </Button>
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(true)}
                disabled={!content.question}
              >
                Testar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!previewMode ? (
            <div className="text-center text-muted-foreground py-8">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Clique em "Testar" para ver como a pergunta aparecerá para os alunos</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Display */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{content.question}</h3>
                
                {/* Answer Options */}
                {content.type === 'multiple-choice' && content.options && (
                  <RadioGroup value={userAnswer?.toString()} onValueChange={(value) => setUserAnswer(parseInt(value))}>
                    {content.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {content.type === 'true-false' && content.options && (
                  <RadioGroup value={userAnswer?.toString()} onValueChange={(value) => setUserAnswer(parseInt(value))}>
                    {content.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`tf-${index}`} />
                        <Label htmlFor={`tf-${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {content.type === 'open-ended' && (
                  <Textarea
                    placeholder="Digite sua resposta aqui..."
                    value={userAnswer || ''}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="min-h-[100px]"
                  />
                )}
              </div>
              
              {/* Check Answer Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={() => {
                    const isCorrect = checkAnswer();
                    // Show result in a simple way
                    alert(content.type === 'open-ended' 
                      ? 'Resposta registrada!' 
                      : isCorrect 
                        ? 'Correto! ✅' 
                        : 'Incorreto. ❌'
                    );
                  }}
                  disabled={userAnswer === null || userAnswer === ''}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Verificar Resposta
                </Button>
              </div>
              
              {/* Explanation */}
              {content.explanation && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Explicação:</h4>
                  <p className="text-sm">{content.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-center">
                <Button variant="outline" onClick={resetPreview}>
                  Resetar Teste
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreator;
