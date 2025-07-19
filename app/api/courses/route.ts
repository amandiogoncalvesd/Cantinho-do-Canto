import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: courses, error } = await supabase
      .from("courses")
      .select(`
        *,
        lessons(count),
        enrollments(count)
      `)
      .eq("active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar cursos:", error)
      return NextResponse.json({ error: "Erro ao buscar cursos" }, { status: 500 })
    }

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Erro na API de cursos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { title, description, level, duration, price, thumbnail } = await request.json()

    if (!title || !description || !level) {
      return NextResponse.json({ error: "Título, descrição e nível são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: course, error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        level,
        duration,
        price: price || 0,
        thumbnail,
        teacher_id: user.userId,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar curso:", error)
      return NextResponse.json({ error: "Erro ao criar curso" }, { status: 500 })
    }

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Erro na criação de curso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
