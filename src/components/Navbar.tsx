import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import UserProfile from "@/components/UserProfile";

interface NavbarProps {
  onLogin: () => void;
}

const Navbar = ({ onLogin }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Para demo - verificar se é admin
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const isLoggedIn = !!user.name;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Cantinho do Canto</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-amber-500 transition-colors">
              Início
            </Link>
            <Link to="/aulas" className="text-gray-600 hover:text-amber-500 transition-colors">
              Aulas
            </Link>
            <Link to="/cursos" className="text-gray-600 hover:text-amber-500 transition-colors">
              Cursos
            </Link>
            <Link to="/sobre" className="text-gray-600 hover:text-amber-500 transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="text-gray-600 hover:text-amber-500 transition-colors">
              Contato
            </Link>
            {isLoggedIn ? (
              <UserProfile user={user} onLogout={() => window.location.reload()} />
            ) : (
              <Button onClick={onLogin} variant="outline">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-amber-500 transition-colors">
                Início
              </Link>
              <Link to="/aulas" className="text-gray-600 hover:text-amber-500 transition-colors">
                Aulas
              </Link>
              <Link to="/cursos" className="text-gray-600 hover:text-amber-500 transition-colors">
                Cursos
              </Link>
              <Link to="/sobre" className="text-gray-600 hover:text-amber-500 transition-colors">
                Sobre
              </Link>
              <Link to="/contato" className="text-gray-600 hover:text-amber-500 transition-colors">
                Contato
              </Link>
              {isLoggedIn ? (
                <div className="self-start">
                  <UserProfile user={user} onLogout={() => window.location.reload()} />
                </div>
              ) : (
                <Button onClick={onLogin} variant="outline" className="self-start">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
