"use client"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import LoginModal from "@/components/LoginModal"
import RegistrationModal from "@/components/RegistrationModal"
import TestimonialsSection from "@/components/TestimonialsSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Music, Calendar, Users, Award, Clock, MapPin, Phone, CreditCard, MessageCircle } from "lucide-react"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const scheduleData = [
    { day: "Segunda", morning: "", afternoon: "17:50 - 19:00" },
    { day: "Terça", morning: "07:00 - 09:00", afternoon: "" },
    { day: "Quarta", morning: "07:00 - 09:00", afternoon: "17:50 - 19:00" },
    { day: "Quinta", morning: "07:00 - 09:00", afternoon: "" },
    { day: "Sexta", morning: "", afternoon: "17:50 - 19:00" },
    { day: "Sábado", morning: "", afternoon: "" },
    { day: "Domingo", morning: "", afternoon: "" },
  ]

  const teamMembers = [
    {
      name: "Esmael Nelson Macedo",
      role: "Professor de Violão",
      description: "Especialista em violão clássico e popular com mais de 10 anos de experiência.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Helena Feliciano Alberto",
      role: "Secretária",
      description: "Responsável pelo atendimento e organização administrativa da escola.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Amândio Gonçalves",
      role: "Técnico",
      description: "Suporte técnico e manutenção dos equipamentos musicais.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const features = [
    {
      icon: Music,
      title: "Aulas Personalizadas",
      description: "Metodologia adaptada ao seu nível e estilo musical preferido",
    },
    {
      icon: Calendar,
      title: "Horários Flexíveis",
      description: "Aulas nos períodos da manhã e tarde para sua conveniência",
    },
    {
      icon: Users,
      title: "Professores Qualificados",
      description: "Equipe experiente e apaixonada pelo ensino musical",
    },
    {
      icon: Award,
      title: "Certificação",
      description: "Certificados de conclusão para cada nível completado",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar onLogin={() => setShowLogin(true)} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-amber-900/90" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-20" />

        <div className="relative container mx-auto text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Cantinho do Canto</h1>
            <p className="text-xl md:text-2xl mb-4 font-light italic">"A vida sem música seria um erro."</p>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Descubra o mundo da música através do violão. Aulas personalizadas para todos os níveis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg"
                onClick={() => setShowRegister(true)}
              >
                <Music className="mr-2 h-5 w-5" />
                Inscreva-se Agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent"
                onClick={() => window.open("https://wa.me/244930557454", "_blank")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Por que escolher o Cantinho do Canto?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa metodologia única combina tradição e inovação para oferecer a melhor experiência de aprendizado
              musical.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Horários das Aulas</h2>
            <p className="text-lg text-gray-600">Escolha o horário que melhor se adapta à sua rotina</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  Cronograma Semanal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Dia</th>
                        <th className="text-left py-3 px-4 font-semibold">Manhã</th>
                        <th className="text-left py-3 px-4 font-semibold">Tarde</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((schedule, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{schedule.day}</td>
                          <td className="py-3 px-4">
                            {schedule.morning ? (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {schedule.morning}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {schedule.afternoon ? (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {schedule.afternoon}
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nossa Equipe</h2>
            <p className="text-lg text-gray-600">Profissionais dedicados ao seu sucesso musical</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mx-auto w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-amber-600 font-semibold">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Investimento</h2>
            <p className="text-lg text-gray-600">Valores acessíveis para uma educação musical de qualidade</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-amber-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-amber-600">Plano Mensal</CardTitle>
                <CardDescription>Acesso completo às aulas e materiais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-2">6.000 Kz</div>
                  <p className="text-gray-600">por mês</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-amber-500" />
                    <span>Taxa de inscrição: 3.000 Kz (única vez)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-amber-500" />
                    <span>Localização: Huambo / Centralidade do Lossambo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-amber-500" />
                    <span>Contato: 930 557 454</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Dados para Pagamento:</strong>
                  </p>
                  <p className="text-sm font-mono bg-white p-2 rounded border">
                    IBAN: 004400001758808610194 (Banco BAI)
                  </p>
                </div>

                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => setShowRegister(true)}
                >
                  Inscrever-se Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-900 to-amber-900">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar sua jornada musical?</h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a centenas de alunos que já transformaram suas vidas através da música
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4"
              onClick={() => setShowRegister(true)}
            >
              <Music className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 bg-transparent"
              onClick={() => window.open("https://wa.me/244930557454", "_blank")}
            >
              <Phone className="mr-2 h-5 w-5" />
              Falar Conosco
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      <RegistrationModal open={showRegister} onOpenChange={setShowRegister} />

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg"
          onClick={() => window.open("https://wa.me/244930557454", "_blank")}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
