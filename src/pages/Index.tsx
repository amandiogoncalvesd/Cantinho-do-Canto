import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, BookOpen, Calendar, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import RegistrationModal from "@/components/RegistrationModal";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useAdminDemo } from "@/hooks/use-admin-demo";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  // Inicializa dados de demo do admin
  useAdminDemo();

  const features = [
    {
      icon: BookOpen,
      title: "Cursos Estruturados",
      description: "Do iniciante ao avançado, com metodologia comprovada e acompanhamento personalizado."
    },
    {
      icon: Users,
      title: "Professores Qualificados",
      description: "Instrutores experientes e apaixonados pela música, prontos para guiar sua jornada."
    },
    {
      icon: Calendar,
      title: "Horários Flexíveis",
      description: "Aulas nos períodos matutino e vespertino para se adequar à sua rotina."
    },
    {
      icon: Star,
      title: "Ambiente Acolhedor",
      description: "Espaço pensado para inspirar e desenvolver seu talento musical em um ambiente familiar."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent/20 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-accent/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent/25 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 animate-fade-in">
              <Music className="h-16 w-16 text-accent mx-auto mb-4 musical-animation" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-primary-foreground to-accent bg-clip-text text-transparent">
              Desperte Seu Talento Musical no
              <span className="text-accent block mt-2">Cantinho do Canto</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-fade-in max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Aprenda violão com professores qualificados em um ambiente acolhedor e inspirador. 
              Transforme sua paixão em arte!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setShowRegistration(true)}
              >
                Inscreva-se Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Link to="/cursos" className="flex items-center">
                  Conheça os Cursos
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
              Por que escolher o Cantinho do Canto?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="text-center card-hover border-l-4 border-l-accent group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit group-hover:bg-accent/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Nossos Números Falam Por Si
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <p className="text-lg">Alunos Formados</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">10</div>
                <p className="text-lg">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">95%</div>
                <p className="text-lg">Satisfação dos Pais</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
                <p className="text-lg">Professores Qualificados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comece sua jornada musical hoje!
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Transforme sua paixão pela música em realidade. Junte-se à nossa comunidade musical e descubra o músico que existe em você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setShowRegistration(true)}
            >
              <Music className="mr-2 h-5 w-5" />
              Fazer Inscrição
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-4"
            >
              <Link to="/aulas" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Ver Horários
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      <RegistrationModal open={showRegistration} onOpenChange={setShowRegistration} />
    </div>
  );
};

export default Index;
