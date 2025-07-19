import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Award, Target } from "lucide-react"

interface ProgressData {
  week: string
  score: number
  attendance: number
}

interface GraficoProgressoProps {
  studentName: string
  overallProgress: number
  weeklyData: ProgressData[]
  totalLessons: number
  completedLessons: number
  averageScore: number
  attendanceRate: number
}

const GraficoProgresso = ({
  studentName,
  overallProgress,
  weeklyData,
  totalLessons,
  completedLessons,
  averageScore,
  attendanceRate,
}: GraficoProgressoProps) => {
  const pieData = [
    { name: "Concluídas", value: completedLessons, color: "#22c55e" },
    { name: "Pendentes", value: totalLessons - completedLessons, color: "#e5e7eb" },
  ]

  const getProgressColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressBadge = (value: number) => {
    if (value >= 80) return { text: "Excelente", color: "bg-green-100 text-green-800" }
    if (value >= 60) return { text: "Bom", color: "bg-yellow-100 text-yellow-800" }
    return { text: "Precisa Melhorar", color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso Musical - {studentName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getProgressColor(overallProgress)}`}>{overallProgress}%</div>
              <p className="text-sm text-gray-600">Progresso Geral</p>
              <Badge className={getProgressBadge(overallProgress).color}>
                {getProgressBadge(overallProgress).text}
              </Badge>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {completedLessons}/{totalLessons}
              </div>
              <p className="text-sm text-gray-600">Aulas Concluídas</p>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold ${getProgressColor(averageScore)}`}>{averageScore}%</div>
              <p className="text-sm text-gray-600">Média de Notas</p>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold ${getProgressColor(attendanceRate)}`}>{attendanceRate}%</div>
              <p className="text-sm text-gray-600">Frequência</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gráfico de Evolução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Evolução Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Nota (%)" />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} name="Frequência (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Aulas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Distribuição de Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Progresso por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Teoria Musical</span>
                <span className="text-sm text-gray-600">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Técnica</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Repertório</span>
                <span className="text-sm text-gray-600">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Ritmo</span>
                <span className="text-sm text-gray-600">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GraficoProgresso
