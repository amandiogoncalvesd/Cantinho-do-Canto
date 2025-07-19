import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import { useToast } from "@/hooks/use-toast";

const Contato = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Simular envio da mensagem
    toast({
      title: "Sucesso!",
      description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!"
    });

    // Limpar formulário
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      info: "Huambo, Centralidade do Lossambo",
      description: "Venha nos visitar em nossa sede"
    },
    {
      icon: Phone,
      title: "Telefone",
      info: "+244 923 456 789",
      description: "Ligue para tirar suas dúvidas"
    },
    {
      icon: Mail,
      title: "E-mail",
      info: "contato@cantinhodocanto.co.ao",
      description: "Envie sua mensagem"
    },
    {
      icon: Clock,
      title: "Horários",
      info: "Segunda a Sexta: 07:00 - 19:00",
      description: "Estamos aqui para você"
    }
  ];

  const faqs = [
    {
      question: "Qual é a idade mínima para começar as aulas?",
      answer: "Aceitamos alunos a partir dos 7 anos. Para crianças menores, recomendamos uma avaliação prévia."
    },
    {
      question: "Preciso ter meu próprio violão?",
      answer: "Não é obrigatório. Temos violões disponíveis para as aulas, mas recomendamos ter um para praticar em casa."
    },
    {
      question: "Quanto tempo leva para aprender a tocar?",
      answer: "Depende da dedicação e prática. Geralmente, em 3 meses você já consegue tocar suas primeiras músicas."
    },
    {
      question: "Vocês oferecem aulas particulares?",
      answer: "Sim! Oferecemos tanto aulas em grupo quanto aulas particulares, conforme sua preferência."
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
                <MessageCircle className="h-16 w-16 text-amber-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
              Entre em Contato
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Tem dúvidas? Quer saber mais sobre nossos cursos? Estamos aqui para ajudar!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Como nos Encontrar
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-t-4 border-t-amber-500">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-amber-100 rounded-full">
                        <item.icon className="h-8 w-8 text-amber-600" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-800">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-gray-800 mb-2">{item.info}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Envie sua Mensagem
            </h2>
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+244 923 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assunto
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Sobre o que você gostaria de falar?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Escreva sua mensagem aqui..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 text-lg"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  );
};

export default Contato;
