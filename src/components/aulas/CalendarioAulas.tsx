import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AulaAgendada {
  id: number;
  title: string;
  date: Date;
  time: string;
  student: string;
  status: "agendada" | "concluida" | "cancelada";
}

const CalendarioAulas = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterStudent, setFilterStudent] = useState<string>("all");

  // Dados de exemplo
  const aulasAgendadas: AulaAgendada[] = [
    {
      id: 1,
      title: "Acordes Básicos",
      date: new Date(2024, 0, 15),
      time: "08:00",
      student: "João Silva",
      status: "agendada"
    },
    {
      id: 2,
      title: "Ritmo de Valsa",
      date: new Date(2024, 0, 16),
      time: "14:00",
      student: "Maria Santos",
      status: "concluida"
    },
    {
      id: 3,
      title: "Técnicas de Dedilhado",
      date: new Date(2024, 0, 17),
      time: "16:00",
      student: "Pedro Costa",
      status: "agendada"
    }
  ];

  const students = ["João Silva", "Maria Santos", "Pedro Costa"];

  const filteredAulas = aulasAgendadas.filter(aula => {
    const matchesStudent = filterStudent === "all" || aula.student === filterStudent;
    const matchesDate = !selectedDate || 
      aula.date.toDateString() === selectedDate.toDateString();
    return matchesStudent && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendada": return "bg-blue-100 text-blue-800";
      case "concluida": return "bg-green-100 text-green-800";
      case "cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAulasForDate = (date: Date) => {
    return aulasAgendadas.filter(aula => 
      aula.date.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Calendário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasClass: (date) => getAulasForDate(date).length > 0,
            }}
            modifiersClassNames={{
              hasClass: "bg-primary/10 font-bold",
            }}
          />
        </CardContent>
      </Card>

      {/* Lista de Aulas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Aulas {selectedDate && `para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}`}
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterStudent} onValueChange={setFilterStudent}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por aluno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os alunos</SelectItem>
                  {students.map(student => (
                    <SelectItem key={student} value={student}>{student}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Aula
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAulas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma aula encontrada para os filtros selecionados</p>
              </div>
            ) : (
              filteredAulas.map((aula) => (
                <div key={aula.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium">{aula.time}</div>
                      <div className="text-xs text-gray-500">
                        {format(aula.date, "dd/MM")}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{aula.title}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        {aula.student}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(aula.status)}>
                      {aula.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarioAulas;
