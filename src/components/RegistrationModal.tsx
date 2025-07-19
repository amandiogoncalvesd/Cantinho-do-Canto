import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { UserPlus, Music } from "lucide-react";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrationModal = ({ open, onOpenChange }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    reason: "",
    motivation: "",
    hasInstrument: false,
    previousExperience: "",
    availableSchedule: "",
    parentName: "",
    parentPhone: "",
    parentEmail: ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || !formData.email) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simulate registration - in real app, this would call an API
    toast({
      title: "Inscrição realizada!",
      description: "Entraremos em contato em breve. Bem-vindo ao Cantinho do Canto!",
    });
    
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      reason: "",
      motivation: "",
      hasInstrument: false,
      previousExperience: "",
      availableSchedule: "",
      parentName: "",
      parentPhone: "",
      parentEmail: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-amber-500" />
            Inscrição - Cantinho do Canto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="age">Idade *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Ex: 25"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Gênero *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masculino" id="masculino" />
                    <Label htmlFor="masculino">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="feminino" id="feminino" />
                    <Label htmlFor="feminino">Feminino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outro" id="outro" />
                    <Label htmlFor="outro">Outro</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Ex: 930 557 454"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motivação Musical */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Music className="h-5 w-5 text-amber-500" />
                Sobre sua Motivação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reason">Por que deseja aprender violão?</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder="Conte-nos sua motivação..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="motivation">A vontade que tens é maior do que o desejo de desistir?</Label>
                <RadioGroup
                  value={formData.motivation}
                  onValueChange={(value) => handleInputChange("motivation", value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="sim" />
                    <Label htmlFor="sim">Sim, estou determinado(a)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="talvez" id="talvez" />
                    <Label htmlFor="talvez">Ainda não tenho certeza</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasInstrument"
                  checked={formData.hasInstrument}
                  onCheckedChange={(checked) => handleInputChange("hasInstrument", checked)}
                />
                <Label htmlFor="hasInstrument">Já possui um violão</Label>
              </div>

              <div>
                <Label htmlFor="previousExperience">Experiência anterior com música</Label>
                <Select 
                  value={formData.previousExperience} 
                  onValueChange={(value) => handleInputChange("previousExperience", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante total</SelectItem>
                    <SelectItem value="basico">Noções básicas</SelectItem>
                    <SelectItem value="intermediario">Intermediário</SelectItem>
                    <SelectItem value="outro-instrumento">Toco outro instrumento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="availableSchedule">Preferência de horário</Label>
                <Select 
                  value={formData.availableSchedule} 
                  onValueChange={(value) => handleInputChange("availableSchedule", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione seu horário preferido" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã (07:00 - 09:00)</SelectItem>
                    <SelectItem value="tarde">Tarde (17:50 - 19:00)</SelectItem>
                    <SelectItem value="flexivel">Flexível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Responsável (para menores) */}
          {parseInt(formData.age) < 18 && formData.age && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Responsável</CardTitle>
                <CardDescription>Obrigatório para menores de 18 anos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="parentName">Nome do Pai/Responsável</Label>
                  <Input
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => handleInputChange("parentName", e.target.value)}
                    placeholder="Nome completo do responsável"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parentPhone">Telefone do Responsável</Label>
                    <Input
                      id="parentPhone"
                      value={formData.parentPhone}
                      onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                      placeholder="Telefone para contato"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parentEmail">Email do Responsável</Label>
                    <Input
                      id="parentEmail"
                      type="email"
                      value={formData.parentEmail}
                      onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                      placeholder="Email do responsável"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações de Pagamento */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-lg">Informações de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Mensalidade:</strong> 6.000 Kz</p>
                <p><strong>Taxa de Inscrição:</strong> 3.000 Kz</p>
                <p><strong>IBAN para pagamento:</strong> 004400001758808610194</p>
                <p className="text-amber-700 font-medium">
                  * Entraremos em contato para orientações sobre o pagamento
                </p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600">
            Finalizar Inscrição
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
