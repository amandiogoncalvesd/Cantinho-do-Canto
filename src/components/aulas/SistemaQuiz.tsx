import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, HelpCircle, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  type: "multiple" | "text" | "truefalse";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

interface SistemaQuizProps {
  questions: Question[];
  onComplete?: (score: number) => void;
}

const SistemaQuiz = ({ questions, onComplete }: SistemaQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
    setUserAnswer(answer);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setUserAnswer(answers[currentQuestion + 1] || "");
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setUserAnswer(answers[currentQuestion - 1] || "");
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    const score = calculateScore();
    if (onComplete) {
      onComplete(score);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excelente! Você domina o conteúdo!";
    if (score >= 60) return "Bom trabalho! Continue praticando.";
    return "Precisa estudar mais. Revise o conteúdo.";
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Resultados do Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <p className="text-lg text-gray-600">
                {getScoreMessage(score)}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-left">Revisão das Respostas:</h3>
              {questions.map((question, index) => {
                const isCorrect = answers[index] === question.correctAnswer;
                return (
                  <div key={index} className="text-left p-4 border rounded-lg">
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Sua resposta: <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                            {answers[index] || "Não respondida"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600 mt-1">
                            Resposta correta: {question.correctAnswer}
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setAnswers({});
                setUserAnswer("");
              }}>
                Refazer Quiz
              </Button>
              <Button variant="outline">
                Continuar Estudando
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quiz - Questão {currentQuestion + 1} de {questions.length}
          </CardTitle>
          <Badge variant="outline">
            {Math.round(progress)}% completo
          </Badge>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            
            {question.type === "multiple" && question.options && (
              <RadioGroup value={userAnswer} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "truefalse" && (
              <RadioGroup value={userAnswer} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Verdadeiro" id="true" />
                    <Label htmlFor="true" className="flex-1 cursor-pointer">
                      Verdadeiro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Falso" id="false" />
                    <Label htmlFor="false" className="flex-1 cursor-pointer">
                      Falso
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            )}

            {question.type === "text" && (
              <Textarea
                value={userAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Digite sua resposta..."
                className="min-h-[100px]"
              />
            )}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!userAnswer}
            >
              {currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SistemaQuiz;
