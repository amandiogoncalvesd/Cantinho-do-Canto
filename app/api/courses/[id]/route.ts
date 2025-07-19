import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { data: course, error } = await supabase
      .from("courses")
      .select(`
        *,
        lessons(*),
        users!courses_teacher_id_fkey(name, email)
      `)
      .eq("id", params.id)
      .eq("active", true)
      .single()

    if (error || !course) {
      return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Erro ao buscar curso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário pode editar este curso
    const { data: course } = await supabase.from("courses").select("teacher_id").eq("id", params.id).single()

    if (!course || (course.teacher_id !== user.userId && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { title, description, level, duration, price, thumbnail } = await request.json()

    const { data: updatedCourse, error } = await supabase
      .from("courses")
      .update({
        title,
        description,
        level,
        duration,
        price,
        thumbnail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar curso:", error)
      return NextResponse.json({ error: "Erro ao atualizar curso" }, { status: 500 })
    }

    return NextResponse.json({ course: updatedCourse })
  } catch (error) {
    console.error("Erro na atualização de curso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário pode deletar este curso
    const { data: course } = await supabase.from("courses").select("teacher_id").eq("id", params.id).single()

    if (!course || (course.teacher_id !== user.userId && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    // Soft delete - marcar como inativo
    const { error } = await supabase
      .from("courses")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", params.id)

    if (error) {
      console.error("Erro ao deletar curso:", error)
      return NextResponse.json({ error: "Erro ao deletar curso" }, { status: 500 })
    }

    return NextResponse.json({ message: "Curso deletado com sucesso" })
  } catch (error) {
    console.error("Erro na deleção de curso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
