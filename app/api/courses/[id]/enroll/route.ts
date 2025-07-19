import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Apenas alunos podem se inscrever em cursos" }, { status: 403 })
    }

    const supabase = createServerClient()

    // Verificar se o curso existe e está ativo
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", params.id)
      .eq("active", true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 })
    }

    // Verificar se já está inscrito
    const { data: existingEnrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.userId)
      .eq("course_id", params.id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json({ error: "Você já está inscrito neste curso" }, { status: 400 })
    }

    // Criar inscrição
    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.userId,
        course_id: params.id,
        enrolled_at: new Date().toISOString(),
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar inscrição:", error)
      return NextResponse.json({ error: "Erro ao se inscrever no curso" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Inscrição realizada com sucesso",
        enrollment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erro na inscrição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
