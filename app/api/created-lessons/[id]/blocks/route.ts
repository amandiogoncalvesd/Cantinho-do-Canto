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

    // Verificar se a aula pertence ao usuário
    const { data: lesson } = await supabase
      .from("created_lessons")
      .select("id")
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .single()

    if (!lesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    const { data: blocks, error } = await supabase
      .from("lesson_blocks")
      .select("*")
      .eq("lesson_id", params.id)
      .order("order_index", { ascending: true })

    if (error) {
      console.error("Erro ao buscar blocos:", error)
      return NextResponse.json({ error: "Erro ao buscar blocos" }, { status: 500 })
    }

    return NextResponse.json({ blocks })
  } catch (error) {
    console.error("Erro na API de blocos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { blockType, content, title, description, orderIndex } = await request.json()

    if (!blockType || !content) {
      return NextResponse.json({ error: "Tipo e conteúdo do bloco são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verificar se a aula pertence ao usuário
    const { data: lesson } = await supabase
      .from("created_lessons")
      .select("id")
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .single()

    if (!lesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Se orderIndex não foi fornecido, usar o próximo disponível
    let finalOrderIndex = orderIndex
    if (finalOrderIndex === undefined) {
      const { data: lastBlock } = await supabase
        .from("lesson_blocks")
        .select("order_index")
        .eq("lesson_id", params.id)
        .order("order_index", { ascending: false })
        .limit(1)
        .single()

      finalOrderIndex = lastBlock ? lastBlock.order_index + 1 : 0
    }

    const { data: block, error } = await supabase
      .from("lesson_blocks")
      .insert({
        lesson_id: params.id,
        block_type: blockType,
        content,
        title,
        description,
        order_index: finalOrderIndex,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar bloco:", error)
      return NextResponse.json({ error: "Erro ao criar bloco" }, { status: 500 })
    }

    return NextResponse.json({ block }, { status: 201 })
  } catch (error) {
    console.error("Erro na criação de bloco:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
