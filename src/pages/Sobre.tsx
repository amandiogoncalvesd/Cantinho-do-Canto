import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart, Users, Award, Clock, MapPin, Phone, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";

const Sobre = () => {
  const [showLogin, setShowLogin] = useState(false);

  const values = [
    {
      icon: Heart,
      title: "Paixão pela Música",
      description: "Acreditamos que a música é uma linguagem universal que conecta pessoas e desperta emoções."
    },
    {
      icon: Users,
      title: "Ensino Personalizado",
      description: "Cada aluno é único, por isso desenvolvemos métodos adaptados ao ritmo e estilo de cada pessoa."
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos sempre a melhor qualidade no ensino, com professores qualificados e metodologia comprovada."
    }
  ];

  const team = [
    {
      name: "Carlos Mendes",
      role: "Diretor e Professor",
      experience: "15 anos de experiência",
      specialization: "Violão Clássico e Popular",
      description: "Formado em música com especialização em violão clássico. Apaixonado por ensinar e descobrir novos talentos."
    },
    {
      name: "Ana Silva",
      role: "Professora",
      experience: "10 anos de experiência",
      specialization: "Violão Popular e Bossa Nova",
      description: "Especialista em música popular brasileira, com foco em bossa nova e MPB."
    },
    {
      name: "Pedro Santos",
      role: "Professor",
      experience: "8 anos de experiência",
      specialization: "Violão Rock e Blues",
      description: "Guitarrista experiente em rock e blues, trazendo energia e técnica para as aulas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar onLogin={() => setShowLogin(true)} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-amber-500/20 rounded-full">
                <Music className="h-16 w-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Sobre o Cantinho do Canto
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Há mais de 10 anos transformando vidas através da música, oferecendo ensino de qualidade 
              em um ambiente acolhedor e inspirador.
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nossa História
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                O Cantinho do Canto nasceu em 2014 de um sonho simples: criar um espaço onde pessoas 
                de todas as idades pudessem descobrir e desenvolver seu talento musical. Localizado 
                no coração da Centralidade do Lossambo, em Huambo, começamos com apenas uma sala e 
                um violão.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Ao longo dos anos, crescemos não apenas em estrutura, mas em propósito. Hoje, somos 
                uma referência no ensino de violão em Angola, tendo formado centenas de músicos que 
                levam nossa paixão pela música para todos os cantos do país.
              </p>
              <p className="text-lg leading-relaxed">
                Nosso compromisso vai além do ensino técnico. Acreditamos na música como ferramenta 
                de transformação social, construção de caráter e desenvolvimento pessoal. Cada nota 
                ensinada aqui carrega o amor pela arte e o desejo de ver nossos alunos brilharem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-t-4 border-t-amber-500">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <value.icon className="h-8 w-8 text-amber-600" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-800">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nossa Equipe
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Music className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-800">{member.name}</CardTitle>
                    <p className="text-amber-600 font-semibold">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.experience}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-blue-600 font-medium mb-3">{member.specialization}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Localização */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Venha nos Visitar</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <MapPin className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Localização</h3>
                <p>Huambo, Centralidade do Lossambo</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Horários</h3>
                <p>Segunda a Sexta<br />07:00 - 19:00</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contato</h3>
                <p>+244 923 456 789</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
};

export default Sobre;
