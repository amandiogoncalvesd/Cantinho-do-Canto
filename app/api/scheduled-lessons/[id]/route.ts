import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: lesson, error } = await supabase
      .from("scheduled_lessons")
      .select(`
        *,
        lesson_enrollments(
          id,
          student_id,
          enrolled_at,
          status,
          payment_status,
          payment_amount
        ),
        lesson_attendance(
          student_id,
          joined_at,
          left_at,
          duration_minutes,
          attendance_status,
          participation_score,
          teacher_notes
        ),
        lesson_feedback(
          student_id,
          rating,
          student_comment,
          lesson_quality_rating,
          technical_quality_rating,
          would_recommend
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Erro ao buscar aula:", error)
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Adicionar informações de status em tempo real
    const now = new Date()
    const lessonDateTime = new Date(`${lesson.scheduled_date}T${lesson.scheduled_time}`)
    const lessonEndTime = new Date(lessonDateTime.getTime() + lesson.duration_minutes * 60000)

    const processedLesson = {
      ...lesson,
      is_today: lesson.scheduled_date === now.toISOString().split("T")[0],
      is_live: now >= lessonDateTime && now <= lessonEndTime,
      can_join: now >= new Date(lessonDateTime.getTime() - 15 * 60000), // 15 min antes
      has_ended: now > lessonEndTime,
      student_count: lesson.lesson_enrollments?.length || 0,
      attendance_count: lesson.lesson_attendance?.length || 0,
      average_rating:
        lesson.lesson_feedback?.length > 0
          ? lesson.lesson_feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / lesson.lesson_feedback.length
          : null,
    }

    return NextResponse.json({ lesson: processedLesson })
  } catch (error) {
    console.error("Erro na API de busca de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    const {
      title,
      description,
      scheduled_date,
      scheduled_time,
      duration_minutes,
      max_students,
      status,
      requirements,
      materials,
      notes,
    } = body

    // Se estiver alterando data/hora, verificar conflitos
    if (scheduled_date && scheduled_time) {
      const endTime = new Date(`1970-01-01T${scheduled_time}`)
      endTime.setMinutes(endTime.getMinutes() + (duration_minutes || 60))
      const endTimeString = endTime.toTimeString().slice(0, 5)

      // Buscar teacher_id da aula atual
      const { data: currentLesson } = await supabase
        .from("scheduled_lessons")
        .select("teacher_id")
        .eq("id", id)
        .single()

      if (currentLesson) {
        const { data: conflicts } = await supabase.rpc("check_schedule_conflict", {
          p_teacher_id: currentLesson.teacher_id,
          p_date: scheduled_date,
          p_start_time: scheduled_time,
          p_end_time: endTimeString,
          p_exclude_lesson_id: id,
        })

        if (conflicts) {
          return NextResponse.json({ error: "Conflito de horário detectado" }, { status: 409 })
        }
      }
    }

    const { data: lesson, error } = await supabase
      .from("scheduled_lessons")
      .update({
        title,
        description,
        scheduled_date,
        scheduled_time,
        duration_minutes,
        max_students,
        status,
        requirements,
        materials,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Erro ao atualizar aula:", error)
      return NextResponse.json({ error: "Erro ao atualizar aula" }, { status: 500 })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error("Erro na API de atualização de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { error } = await supabase.from("scheduled_lessons").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar aula:", error)
      return NextResponse.json({ error: "Erro ao deletar aula" }, { status: 500 })
    }

    return NextResponse.json({ message: "Aula deletada com sucesso" })
  } catch (error) {
    console.error("Erro na API de deleção de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
