import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Aulas from "./pages/Aulas"
import Chat from "./pages/Chat"
import Cursos from "./pages/Cursos"
import Sobre from "./pages/Sobre"
import Contato from "./pages/Contato"
import PaisDashboard from "./pages/PaisDashboard"
import StudentDashboard from "./pages/StudentDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import TeacherDashboard from "./pages/TeacherDashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import CriarAula from "./pages/CriarAula"
import CalendarioAulas from "./pages/CalendarioAulas"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/pais" element={<PaisDashboard />} />
          <Route path="/dashboard/aluno" element={<StudentDashboard />} />
          <Route path="/dashboard/professor" element={<TeacherDashboard />} />
          <Route path="/dashboard/pais" element={<PaisDashboard />} />
          <Route path="/criar-aula" element={<CriarAula />} />
          <Route path="/calendario-aulas" element={<CalendarioAulas />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
