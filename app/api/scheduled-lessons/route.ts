import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const teacherId = searchParams.get("teacherId")
    const studentId = searchParams.get("studentId")
    const upcoming = searchParams.get("upcoming") === "true"
    const today = searchParams.get("today") === "true"
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase.from("scheduled_lessons").select(`
        *,
        lesson_enrollments!inner(
          student_id,
          status as enrollment_status,
          payment_status
        ),
        lesson_attendance(
          student_id,
          attendance_status,
          participation_score
        )
      `)

    // Filtros
    if (teacherId) {
      query = query.eq("teacher_id", teacherId)
    }

    if (studentId) {
      query = query.eq("lesson_enrollments.student_id", studentId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    if (upcoming) {
      const now = new Date()
      query = query.gte("scheduled_date", now.toISOString().split("T")[0])
    }

    if (today) {
      const today = new Date().toISOString().split("T")[0]
      query = query.eq("scheduled_date", today)
    }

    // Ordenação e paginação
    query = query
      .order("scheduled_date", { ascending: true })
      .order("scheduled_time", { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: lessons, error } = await query

    if (error) {
      console.error("Erro ao buscar aulas:", error)
      return NextResponse.json({ error: "Erro ao buscar aulas" }, { status: 500 })
    }

    // Processar dados para incluir informações adicionais
    const processedLessons = lessons?.map((lesson) => {
      const now = new Date()
      const lessonDateTime = new Date(`${lesson.scheduled_date}T${lesson.scheduled_time}`)
      const lessonEndTime = new Date(lessonDateTime.getTime() + lesson.duration_minutes * 60000)

      return {
        ...lesson,
        is_today: lesson.scheduled_date === now.toISOString().split("T")[0],
        is_live: now >= lessonDateTime && now <= lessonEndTime,
        can_join: now >= new Date(lessonDateTime.getTime() - 15 * 60000), // 15 min antes
        student_count: lesson.lesson_enrollments?.length || 0,
        attendance_count: lesson.lesson_attendance?.length || 0,
      }
    })

    return NextResponse.json({
      lessons: processedLessons,
      total: lessons?.length || 0,
    })
  } catch (error) {
    console.error("Erro na API de aulas agendadas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      title,
      description,
      teacher_id,
      lesson_content_id,
      scheduled_date,
      scheduled_time,
      duration_minutes = 60,
      max_students = 1,
      requirements,
      materials,
      notes,
      is_recurring = false,
      recurrence_pattern,
      recurrence_end_date,
    } = body

    // Validações básicas
    if (!title || !teacher_id || !scheduled_date || !scheduled_time) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, teacher_id, scheduled_date, scheduled_time" },
        { status: 400 },
      )
    }

    // Verificar conflitos de horário
    const endTime = new Date(`1970-01-01T${scheduled_time}`)
    endTime.setMinutes(endTime.getMinutes() + duration_minutes)
    const endTimeString = endTime.toTimeString().slice(0, 5)

    const { data: conflicts } = await supabase.rpc("check_schedule_conflict", {
      p_teacher_id: teacher_id,
      p_date: scheduled_date,
      p_start_time: scheduled_time,
      p_end_time: endTimeString,
    })

    if (conflicts) {
      return NextResponse.json({ error: "Conflito de horário detectado" }, { status: 409 })
    }

    // Verificar disponibilidade do professor
    const { data: isAvailable } = await supabase.rpc("check_teacher_availability", {
      p_teacher_id: teacher_id,
      p_date: scheduled_date,
      p_time: scheduled_time,
    })

    if (!isAvailable) {
      return NextResponse.json({ error: "Professor não disponível neste horário" }, { status: 409 })
    }

    // Gerar link da reunião (simulado)
    const meetingLink = `https://meet.cantinhomusical.com/${Math.random().toString(36).substr(2, 9)}`

    // Criar a aula
    const { data: lesson, error } = await supabase
      .from("scheduled_lessons")
      .insert({
        title,
        description,
        teacher_id,
        lesson_content_id,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        max_students,
        meeting_link: meetingLink,
        requirements,
        materials,
        notes,
        is_recurring,
        recurrence_pattern,
        recurrence_end_date,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar aula:", error)
      return NextResponse.json({ error: "Erro ao criar aula" }, { status: 500 })
    }

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Erro na API de criação de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
