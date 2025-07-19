import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Clock, DollarSign, Star, Users, BookOpen, Guitar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import TestimonialsSection from "@/components/TestimonialsSection";

const Cursos = () => {
  const [showLogin, setShowLogin] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Violão Iniciante",
      level: "Básico",
      duration: "3 meses",
      price: "6.000 Kz/mês",
      description: "Perfeito para quem está começando sua jornada musical",
      topics: [
        "Postura e empunhadura",
        "Acordes básicos (C, G, Am, F)",
        "Ritmos simples",
        "Primeiras músicas",
        "Leitura de cifras"
      ],
      icon: BookOpen,
      color: "from-green-400 to-green-600"
    },
    {
      id: 2,
      title: "Violão Intermediário",
      level: "Médio",
      duration: "6 meses",
      price: "6.000 Kz/mês",
      description: "Desenvolva suas habilidades e explore novos estilos",
      topics: [
        "Acordes com pestana",
        "Escalas pentatônicas",
        "Técnicas de dedilhado",
        "Ritmos brasileiros",
        "Improvisação básica"
      ],
      icon: Music,
      color: "from-amber-400 to-amber-600"
    },
    {
      id: 3,
      title: "Violão Avançado",
      level: "Avançado",
      duration: "12 meses",
      price: "6.000 Kz/mês",
      description: "Torne-se um violonista completo e versátil",
      topics: [
        "Harmonia avançada",
        "Técnicas de solo",
        "Composição musical",
        "Estilos diversos (Jazz, Blues, Clássico)",
        "Performance e palco"
      ],
      icon: Guitar,
      color: "from-blue-400 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="musical-animation mb-8">
              <Music className="h-16 w-16 mx-auto text-amber-400 mb-4" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Descubra Nossos Cursos de
              <span className="text-amber-400 block mt-2">Violão</span>
            </h1>
            
            <blockquote className="text-xl md:text-2xl text-gray-300 italic mb-8 border-l-4 border-amber-400 pl-6">
              "A música é a linguagem da alma"
            </blockquote>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Transforme sua paixão pela música em realidade. Nossos cursos são projetados 
              para levar você do primeiro acorde às performances mais complexas.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <Card 
                key={course.id} 
                className={`card-hover bg-white/95 backdrop-blur-sm border-0 shadow-xl animate-fade-in overflow-hidden`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className={`bg-gradient-to-r ${course.color} text-white relative`}>
                  <div className="absolute top-4 right-4">
                    <course.icon className="h-8 w-8 opacity-50" />
                  </div>
                  
                  <Badge variant="secondary" className="w-fit mb-2 bg-white/20 text-white border-white/30">
                    {course.level}
                  </Badge>
                  
                  <CardTitle className="text-2xl font-bold">
                    {course.title}
                  </CardTitle>
                  
                  <p className="text-white/90 text-sm">
                    {course.description}
                  </p>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">{course.price}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-amber-500" />
                      O que você vai aprender:
                    </h4>
                    <ul className="space-y-2">
                      {course.topics.map((topic, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <Star className="h-3 w-3 text-amber-400 mt-1 flex-shrink-0" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => setShowLogin(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Inscreva-se Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-amber-500/20 to-blue-500/20 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para Começar sua Jornada Musical?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Junte-se a centenas de alunos que já transformaram suas vidas através da música
            </p>
            <Button 
              onClick={() => setShowLogin(true)}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Music className="h-5 w-5 mr-2" />
              Comece Hoje Mesmo
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
};

export default Cursos;
