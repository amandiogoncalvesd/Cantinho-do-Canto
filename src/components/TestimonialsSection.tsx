import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Maria Santos",
      age: "16 anos",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face",
      quote: "O Cantinho do Canto mudou minha vida! Agora toco nas reuniões da igreja.",
      rating: 5,
      course: "Intermediário"
    },
    {
      id: 2,
      name: "João Pereira",
      age: "23 anos", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote: "Professores incríveis e método muito eficiente. Recomendo!",
      rating: 5,
      course: "Avançado"
    },
    {
      id: 3,
      name: "Ana Costa",
      age: "19 anos",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote: "Começei do zero e em 6 meses já estava tocando minhas músicas favoritas!",
      rating: 5,
      course: "Iniciante"
    },
    {
      id: 4,
      name: "Carlos Silva",
      age: "28 anos",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote: "Ambiente acolhedor e aulas personalizadas. Melhor investimento que fiz!",
      rating: 5,
      course: "Intermediário"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            O Que Nossos Alunos Dizem
          </h2>
          <p className="text-xl text-gray-300">
            Histórias reais de transformação através da música
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className={`card-hover bg-white/95 backdrop-blur-sm border-0 shadow-xl animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-amber-400">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.age}</p>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {testimonial.course}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Quote className="h-8 w-8 text-amber-400/30 absolute -top-2 -left-1" />
                  <blockquote className="text-sm text-gray-700 italic pl-6 mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
