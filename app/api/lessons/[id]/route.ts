import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: lesson, error } = await supabase
      .from("lessons")
      .select(`
        *,
        courses(title, teacher_id)
      `)
      .eq("id", params.id)
      .eq("active", true)
      .single()

    if (error || !lesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Verificar acesso baseado no papel do usuário
    if (user.role === "student") {
      // Verificar se o aluno está inscrito no curso
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.userId)
        .eq("course_id", lesson.course_id)
        .eq("status", "active")
        .single()

      if (!enrollment && !lesson.is_free) {
        return NextResponse.json({ error: "Você não tem acesso a esta aula" }, { status: 403 })
      }
    } else if (user.role === "teacher" && lesson.courses?.teacher_id !== user.userId) {
      return NextResponse.json({ error: "Você não tem acesso a esta aula" }, { status: 403 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error("Erro ao buscar aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário pode editar esta aula
    const { data: lesson } = await supabase
      .from("lessons")
      .select(`
        course_id,
        courses(teacher_id)
      `)
      .eq("id", params.id)
      .single()

    if (!lesson || (user.role === "teacher" && lesson.courses?.teacher_id !== user.userId)) {
      return NextResponse.json({ error: "Você não pode editar esta aula" }, { status: 403 })
    }

    const { title, description, content, video_url, duration, order_index, is_free } = await request.json()

    const { data: updatedLesson, error } = await supabase
      .from("lessons")
      .update({
        title,
        description,
        content,
        video_url,
        duration,
        order_index,
        is_free,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar aula:", error)
      return NextResponse.json({ error: "Erro ao atualizar aula" }, { status: 500 })
    }

    return NextResponse.json({ lesson: updatedLesson })
  } catch (error) {
    console.error("Erro na atualização de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário pode deletar esta aula
    const { data: lesson } = await supabase
      .from("lessons")
      .select(`
        course_id,
        courses(teacher_id)
      `)
      .eq("id", params.id)
      .single()

    if (!lesson || (user.role === "teacher" && lesson.courses?.teacher_id !== user.userId)) {
      return NextResponse.json({ error: "Você não pode deletar esta aula" }, { status: 403 })
    }

    // Soft delete - marcar como inativo
    const { error } = await supabase
      .from("lessons")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", params.id)

    if (error) {
      console.error("Erro ao deletar aula:", error)
      return NextResponse.json({ error: "Erro ao deletar aula" }, { status: 500 })
    }

    return NextResponse.json({ message: "Aula deletada com sucesso" })
  } catch (error) {
    console.error("Erro na deleção de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
