"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ana Beatriz",
      role: "Aluna há 6 meses",
      content:
        "O Cantinho do Canto transformou minha relação com a música. Em poucos meses já consigo tocar minhas músicas favoritas!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Carlos Eduardo",
      role: "Pai de aluno",
      content: "Meu filho desenvolveu muito com as aulas. O professor Esmael é muito dedicado e paciente. Recomendo!",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mariana Silva",
      role: "Aluna há 1 ano",
      content:
        "Excelente metodologia e acompanhamento personalizado. Já participei de apresentações e me sinto muito mais confiante.",
      rating: 5,
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">O que nossos alunos dizem</h2>
          <p className="text-lg text-gray-600">Depoimentos reais de quem já faz parte da nossa família musical</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
