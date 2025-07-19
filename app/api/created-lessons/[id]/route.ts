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
      .from("created_lessons")
      .select(`
        *,
        lesson_blocks(*),
        lesson_statistics(*),
        lesson_versions(id, version_number, version_notes, created_at)
      `)
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .single()

    if (error || !lesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Ordenar blocos por order_index
    if (lesson.lesson_blocks) {
      lesson.lesson_blocks.sort((a: any, b: any) => a.order_index - b.order_index)
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
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const {
      title,
      description,
      level,
      category,
      duration,
      scheduledDate,
      scheduledTime,
      tags,
      students,
      learningObjectives,
      evaluationCriteria,
      complementaryMaterial,
      blocks,
      status,
      versionNotes,
    } = await request.json()

    const supabase = createServerClient()

    // Verificar se a aula pertence ao usuário
    const { data: existingLesson } = await supabase
      .from("created_lessons")
      .select("id, version")
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .single()

    if (!existingLesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Atualizar aula
    const { data: lesson, error: lessonError } = await supabase
      .from("created_lessons")
      .update({
        title,
        description,
        level,
        category,
        duration,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        tags,
        students,
        learning_objectives: learningObjectives,
        evaluation_criteria: evaluationCriteria,
        complementary_material: complementaryMaterial,
        status,
        published_at: status === "published" && !existingLesson.published_at ? new Date().toISOString() : undefined,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (lessonError) {
      console.error("Erro ao atualizar aula:", lessonError)
      return NextResponse.json({ error: "Erro ao atualizar aula" }, { status: 500 })
    }

    // Atualizar blocos se fornecidos
    if (blocks) {
      // Remover blocos existentes
      await supabase.from("lesson_blocks").delete().eq("lesson_id", params.id)

      // Inserir novos blocos
      if (blocks.length > 0) {
        const blocksToInsert = blocks.map((block: any, index: number) => ({
          lesson_id: params.id,
          block_type: block.type,
          order_index: index,
          content: block.content,
          title: block.title,
          description: block.description,
        }))

        const { error: blocksError } = await supabase.from("lesson_blocks").insert(blocksToInsert)

        if (blocksError) {
          console.error("Erro ao atualizar blocos:", blocksError)
        }
      }
    }

    // Criar nova versão se solicitado
    if (versionNotes) {
      const { error: versionError } = await supabase.rpc("create_lesson_version", {
        p_lesson_id: params.id,
        p_version_notes: versionNotes,
        p_created_by: user.userId,
      })

      if (versionError) {
        console.error("Erro ao criar versão:", versionError)
      }
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    console.error("Erro na atualização de aula:", error)
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

    // Verificar se a aula pertence ao usuário
    const { data: existingLesson } = await supabase
      .from("created_lessons")
      .select("id")
      .eq("id", params.id)
      .eq("created_by", user.userId)
      .single()

    if (!existingLesson) {
      return NextResponse.json({ error: "Aula não encontrada" }, { status: 404 })
    }

    // Soft delete - marcar como arquivada
    const { error } = await supabase.from("created_lessons").update({ status: "archived" }).eq("id", params.id)

    if (error) {
      console.error("Erro ao arquivar aula:", error)
      return NextResponse.json({ error: "Erro ao arquivar aula" }, { status: 500 })
    }

    return NextResponse.json({ message: "Aula arquivada com sucesso" })
  } catch (error) {
    console.error("Erro na exclusão de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
