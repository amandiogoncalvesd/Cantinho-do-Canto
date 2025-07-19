import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()
    const { student_id } = body

    if (!student_id) {
      return NextResponse.json({ error: "student_id é obrigatório" }, { status: 400 })
    }

    // Buscar informações da aula
    const { data: lesson, error: lessonError } = await supabase
      .from("scheduled_lessons")
      .select("*")
      .eq("id", id)
      .single()

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Verificar se o aluno está inscrito
    const { data: enrollment } = await supabase
      .from("lesson_enrollments")
      .select("*")
      .eq("lesson_id", id)
      .eq("student_id", student_id)
      .single()

    if (!enrollment) {
      return NextResponse.json({ error: "Aluno não está inscrito nesta aula" }, { status: 403 })
    }

    // Verificar se a aula pode ser acessada (15 minutos antes até o final)
    const now = new Date()
    const lessonDateTime = new Date(`${lesson.scheduled_date}T${lesson.scheduled_time}`)
    const lessonEndTime = new Date(lessonDateTime.getTime() + lesson.duration_minutes * 60000)
    const canJoinTime = new Date(lessonDateTime.getTime() - 15 * 60000) // 15 min antes

    if (now < canJoinTime) {
      const minutesUntilJoin = Math.ceil((canJoinTime.getTime() - now.getTime()) / (1000 * 60))
      return NextResponse.json(
        {
          error: "Aula ainda não está disponível",
          message: `Você poderá entrar na aula em ${minutesUntilJoin} minutos`,
          can_join_at: canJoinTime.toISOString(),
        },
        { status: 425 }, // Too Early
      )
    }

    if (now > lessonEndTime) {
      return NextResponse.json(
        { error: "Esta aula já terminou" },
        { status: 410 }, // Gone
      )
    }

    // Registrar entrada do aluno
    const { data: attendance, error: attendanceError } = await supabase
      .from("lesson_attendance")
      .upsert({
        lesson_id: id,
        student_id: student_id,
        joined_at: now.toISOString(),
        attendance_status: "present",
      })
      .select()
      .single()

    if (attendanceError) {
      console.error("Erro ao registrar presença:", attendanceError)
      // Não bloquear o acesso por erro de presença
    }

    // Atualizar status da aula se necessário
    if (lesson.status === "scheduled" && now >= lessonDateTime) {
      await supabase.from("scheduled_lessons").update({ status: "in_progress" }).eq("id", id)
    }

    // Retornar informações para acesso à aula
    return NextResponse.json({
      success: true,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        meeting_link: lesson.meeting_link,
        meeting_password: lesson.meeting_password,
        teacher_id: lesson.teacher_id,
        duration_minutes: lesson.duration_minutes,
        materials: lesson.materials,
        requirements: lesson.requirements,
      },
      message: "Acesso liberado à aula",
    })
  } catch (error) {
    console.error("Erro na API de entrada na aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Endpoint para registrar saída da aula
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()
    const { student_id } = body

    if (!student_id) {
      return NextResponse.json({ error: "student_id é obrigatório" }, { status: 400 })
    }

    const now = new Date()

    // Buscar registro de presença
    const { data: attendance } = await supabase
      .from("lesson_attendance")
      .select("*")
      .eq("lesson_id", id)
      .eq("student_id", student_id)
      .single()

    if (!attendance) {
      return NextResponse.json({ error: "Registro de presença não encontrado" }, { status: 404 })
    }

    // Calcular duração da participação
    const joinedAt = new Date(attendance.joined_at)
    const durationMinutes = Math.round((now.getTime() - joinedAt.getTime()) / (1000 * 60))

    // Atualizar registro de presença
    const { error } = await supabase
      .from("lesson_attendance")
      .update({
        left_at: now.toISOString(),
        duration_minutes: durationMinutes,
      })
      .eq("lesson_id", id)
      .eq("student_id", student_id)

    if (error) {
      console.error("Erro ao registrar saída:", error)
      return NextResponse.json({ error: "Erro ao registrar saída" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      duration_minutes: durationMinutes,
      message: "Saída registrada com sucesso",
    })
  } catch (error) {
    console.error("Erro na API de saída da aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
