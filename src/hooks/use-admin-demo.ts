import { useEffect } from "react";

export const useAdminDemo = () => {
  useEffect(() => {
    // Simula um usuário admin logado para demonstração
    const mockUser = {
      id: 1,
      name: "Administrador",
      email: "admin@cantinhodocanto.com",
      role: "admin"
    };
    
    const mockToken = "mock-admin-token";
    
    // Só define se não existir um usuário logado
    if (!localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);
    }
  }, []);
};
