import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Music, 
  BookOpen, 
  MessageCircle, 
  Award, 
  Clock,
  TrendingUp,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Home } from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data - in real app, this would come from API
  const studentData = {
    name: "João Silva",
    level: "Intermediário",
    progress: 65,
    nextClass: "Quarta-feira, 18:00",
    totalClasses: 24,
    attendedClasses: 20,
    currentSong: "Wonderwall - Oasis",
    recentGrades: [
      { subject: "Técnica", grade: 8.5, date: "2024-01-10" },
      { subject: "Ritmo", grade: 9.0, date: "2024-01-08" },
      { subject: "Harmonia", grade: 7.5, date: "2024-01-05" }
    ]
  };

  const upcomingClasses = [
    { date: "2024-01-15", time: "18:00", topic: "Acordes Avançados", status: "confirmed" },
    { date: "2024-01-17", time: "18:00", topic: "Técnica de Dedilhado", status: "pending" },
    { date: "2024-01-19", time: "18:00", topic: "Repertório Popular", status: "confirmed" }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Dashboard do Aluno</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline" 
              className="text-white border-white hover:bg-blue-500 hover:border-blue-500"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="text-white border-white hover:bg-amber-500 hover:border-amber-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Olá, {studentData.name}! 👋
          </h2>
          <p className="text-white/80">Bem-vindo ao seu painel de estudos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Seu Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Nível Geral</span>
                      <span className="text-sm text-gray-600">{studentData.progress}%</span>
                    </div>
                    <Progress value={studentData.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{studentData.totalClasses}</div>
                      <div className="text-sm text-gray-600">Aulas Totais</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{studentData.attendedClasses}</div>
                      <div className="text-sm text-gray-600">Presenças</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{studentData.level}</div>
                      <div className="text-sm text-gray-600">Nível</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">8.7</div>
                      <div className="text-sm text-gray-600">Média</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Learning */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-amber-500" />
                  Estudando Agora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-lg">{studentData.currentSong}</h3>
                    <p className="text-gray-600">Progresso: 75% concluído</p>
                  </div>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Ver Partituras
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Notas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentData.recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{grade.subject}</div>
                        <div className="text-sm text-gray-600">{grade.date}</div>
                      </div>
                      <Badge 
                        variant={grade.grade >= 8 ? "default" : grade.grade >= 7 ? "secondary" : "destructive"}
                        className="text-lg px-3 py-1"
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Class */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Próxima Aula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600 mb-2">
                    {studentData.nextClass}
                  </div>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ver Agenda
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Próximas Aulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingClasses.map((class_, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-sm font-medium">{class_.date}</div>
                        <Badge variant={class_.status === "confirmed" ? "default" : "secondary"}>
                          {class_.status === "confirmed" ? "Confirmado" : "Pendente"}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{class_.time}</div>
                      <div className="text-sm">{class_.topic}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat com Professor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Material de Estudo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Meu Perfil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
