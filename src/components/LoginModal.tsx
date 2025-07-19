import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LogIn, User, Users, GraduationCap, Shield } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [userType, setUserType] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userTypes = [
    { value: "student", label: "Aluno", icon: User, description: "Acesso às suas aulas e progresso" },
    { value: "parent", label: "Pai/Responsável", icon: Users, description: "Acompanhe o progresso do seu filho" },
    { value: "teacher", label: "Professor", icon: GraduationCap, description: "Gerenciar aulas e alunos" },
    { value: "admin", label: "Administrador", icon: Shield, description: "Controle total do sistema" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType || !email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Simulate login - in real app, this would call an API
    toast({
      title: "Login realizado!",
      description: `Bem-vindo, ${userTypes.find(t => t.value === userType)?.label}!`,
    });
    
    onOpenChange(false);
    
    // Reset form
    setUserType("");
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5 text-amber-500" />
            Fazer Login
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu tipo de acesso" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userType && (
              <p className="text-sm text-gray-600">
                {userTypes.find(t => t.value === userType)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
            Entrar
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <button 
              className="text-amber-500 hover:underline"
              onClick={() => {
                onOpenChange(false);
                // This would open registration modal
              }}
            >
              Registre-se aqui
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
