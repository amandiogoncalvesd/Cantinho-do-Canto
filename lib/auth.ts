import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { createServerClient } from "@/lib/supabase/server"

export interface AuthUser {
  userId: string
  email: string
  role: string
  name?: string
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Buscar dados atualizados do usuário
    const supabase = createServerClient()
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("id", decoded.userId)
      .single()

    if (error || !user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    }
  } catch (error) {
    console.error("Erro na verificação de auth:", error)
    return null
  }
}

export function requireAuth(roles?: string[]) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)

    if (!user) {
      throw new Error("Não autorizado")
    }

    if (roles && !roles.includes(user.role)) {
      throw new Error("Acesso negado")
    }

    return user
  }
}
