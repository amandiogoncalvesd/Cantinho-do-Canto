import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const recipientId = searchParams.get("recipientId")

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const supabase = createServerClient()

    let query = supabase
      .from("chat_messages")
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey(name, email, role),
        recipient:users!chat_messages_recipient_id_fkey(name, email, role),
        courses(title)
      `)
      .order("created_at", { ascending: true })

    // Filtrar mensagens baseado no contexto
    if (courseId) {
      query = query.eq("course_id", courseId)
    }

    if (recipientId) {
      query = query.or(`sender_id.eq.${user.userId},recipient_id.eq.${user.userId}`)
      query = query.or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
    } else {
      // Buscar todas as mensagens onde o usuário é remetente ou destinatário
      query = query.or(`sender_id.eq.${user.userId},recipient_id.eq.${user.userId}`)
    }

    const { data: messages, error } = await query

    if (error) {
      console.error("Erro ao buscar mensagens:", error)
      return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Erro na API de chat:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { message, recipient_id, course_id } = await request.json()

    if (!message || (!recipient_id && !course_id)) {
      return NextResponse.json({ error: "Mensagem e destinatário/curso são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verificar se o usuário tem permissão para enviar mensagem no contexto especificado
    if (course_id) {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.userId)
        .eq("course_id", course_id)
        .eq("status", "active")
        .single()

      const { data: course } = await supabase.from("courses").select("teacher_id").eq("id", course_id).single()

      if (!enrollment && course?.teacher_id !== user.userId && user.role !== "admin") {
        return NextResponse.json({ error: "Você não tem permissão para enviar mensagens neste curso" }, { status: 403 })
      }
    }

    const { data: chatMessage, error } = await supabase
      .from("chat_messages")
      .insert({
        sender_id: user.userId,
        recipient_id,
        course_id,
        message,
        created_at: new Date().toISOString(),
      })
      .select(`
        *,
        sender:users!chat_messages_sender_id_fkey(name, email, role),
        recipient:users!chat_messages_recipient_id_fkey(name, email, role),
        courses(title)
      `)
      .single()

    if (error) {
      console.error("Erro ao enviar mensagem:", error)
      return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
    }

    return NextResponse.json({ message: chatMessage }, { status: 201 })
  } catch (error) {
    console.error("Erro no envio de mensagem:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
