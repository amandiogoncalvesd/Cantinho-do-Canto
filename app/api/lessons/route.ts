import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    let query = supabase
      .from("lessons")
      .select(`
        *,
        courses(title, teacher_id)
      `)
      .eq("active", true)
      .order("order_index", { ascending: true })

    if (courseId) {
      query = query.eq("course_id", courseId)
    }

    const { data: lessons, error } = await query

    if (error) {
      console.error("Erro ao buscar aulas:", error)
      return NextResponse.json({ error: "Erro ao buscar aulas" }, { status: 500 })
    }

    // Filtrar aulas baseado no papel do usuário
    const filteredLessons = lessons?.filter((lesson) => {
      if (user.role === "admin") return true
      if (user.role === "teacher" && lesson.courses?.teacher_id === user.userId) return true
      if (user.role === "student") {
        // Verificar se o aluno está inscrito no curso
        // Esta verificação seria feita com uma query adicional em um cenário real
        return true
      }
      return false
    })

    return NextResponse.json({ lessons: filteredLessons })
  } catch (error) {
    console.error("Erro na API de aulas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { title, description, content, course_id, video_url, duration, order_index, is_free } = await request.json()

    if (!title || !course_id) {
      return NextResponse.json({ error: "Título e curso são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário pode criar aulas neste curso
    if (user.role === "teacher") {
      const { data: course } = await supabase.from("courses").select("teacher_id").eq("id", course_id).single()

      if (!course || course.teacher_id !== user.userId) {
        return NextResponse.json({ error: "Você não pode criar aulas neste curso" }, { status: 403 })
      }
    }

    const { data: lesson, error } = await supabase
      .from("lessons")
      .insert({
        title,
        description,
        content,
        course_id,
        video_url,
        duration,
        order_index: order_index || 0,
        is_free: is_free || false,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar aula:", error)
      return NextResponse.json({ error: "Erro ao criar aula" }, { status: 500 })
    }

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Erro na criação de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
