import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const userId = searchParams.get("userId")

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Determinar qual usuário buscar o progresso
    let targetUserId = user.userId
    if (userId && (user.role === "admin" || user.role === "teacher")) {
      targetUserId = userId
    }

    let query = supabase
      .from("progress")
      .select(`
        *,
        lessons(title, course_id),
        courses(title)
      `)
      .eq("user_id", targetUserId)

    if (courseId) {
      query = query.eq("course_id", courseId)
    }

    const { data: progress, error } = await query

    if (error) {
      console.error("Erro ao buscar progresso:", error)
      return NextResponse.json({ error: "Erro ao buscar progresso" }, { status: 500 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Erro na API de progresso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Apenas alunos podem registrar progresso" }, { status: 403 })
    }

    const { lesson_id, course_id, progress_percentage, completed, time_spent } = await request.json()

    if (!lesson_id || !course_id) {
      return NextResponse.json({ error: "ID da aula e do curso são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verificar se o aluno está inscrito no curso
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.userId)
      .eq("course_id", course_id)
      .eq("status", "active")
      .single()

    if (!enrollment) {
      return NextResponse.json({ error: "Você não está inscrito neste curso" }, { status: 403 })
    }

    // Verificar se já existe progresso para esta aula
    const { data: existingProgress } = await supabase
      .from("progress")
      .select("id")
      .eq("user_id", user.userId)
      .eq("lesson_id", lesson_id)
      .single()

    let result
    if (existingProgress) {
      // Atualizar progresso existente
      const { data, error } = await supabase
        .from("progress")
        .update({
          progress_percentage: Math.max(progress_percentage || 0, 0),
          completed: completed || false,
          time_spent: (time_spent || 0) + (existingProgress.time_spent || 0),
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingProgress.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Criar novo progresso
      const { data, error } = await supabase
        .from("progress")
        .insert({
          user_id: user.userId,
          lesson_id,
          course_id,
          progress_percentage: Math.max(progress_percentage || 0, 0),
          completed: completed || false,
          time_spent: time_spent || 0,
          started_at: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error("Erro ao salvar progresso:", result.error)
      return NextResponse.json({ error: "Erro ao salvar progresso" }, { status: 500 })
    }

    return NextResponse.json({ progress: result.data })
  } catch (error) {
    console.error("Erro no registro de progresso:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
