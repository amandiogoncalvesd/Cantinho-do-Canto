import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        // Simulação de verificação de token - substituir por API real
        const mockUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (requiredRole && mockUser.role !== requiredRole) {
          setIsAuthorized(false);
          toast({ 
            title: "Erro", 
            description: "Acesso não autorizado",
            variant: "destructive" 
          });
        } else {
          setIsAuthorized(true);
        }
      } catch {
        setIsAuthorized(false);
        toast({ 
          title: "Erro", 
          description: "Falha na autenticação",
          variant: "destructive" 
        });
      }
    };

    checkAuth();
  }, [requiredRole, toast]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }
  
  if (!isAuthorized) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
