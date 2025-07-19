"use client"

import { Music, MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Music className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold">Cantinho do Canto</span>
            </div>
            <p className="text-gray-300 mb-4">
              Escola de música especializada no ensino do violão. Transformando vidas através da música desde 2020.
            </p>
            <p className="text-amber-400 italic">"A vida sem música seria um erro."</p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-amber-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300 text-sm">Huambo, Centralidade do Lossambo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300 text-sm">930 557 454</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300 text-sm">contato@cantinhodocanto.co.ao</span>
              </li>
            </ul>
          </div>

          {/* Horários */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horários</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300 text-sm">Manhã: 07:00 - 09:00</span>
              </div>
              <div className="text-gray-400 text-xs ml-6">Terça, Quarta e Quinta</div>
              <div className="flex items-center gap-2 mt-3">
                <Clock className="h-4 w-4 text-amber-500" />
                <span className="text-gray-300 text-sm">Tarde: 17:50 - 19:00</span>
              </div>
              <div className="text-gray-400 text-xs ml-6">Segunda, Quarta e Sexta</div>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <span className="text-gray-300">Siga-nos:</span>
              <div className="flex gap-3">
                <Link
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">© 2024 Cantinho do Canto. Todos os direitos reservados.</p>
              <p className="text-gray-500 text-xs mt-1">Desenvolvido com ❤️ para a música angolana</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
