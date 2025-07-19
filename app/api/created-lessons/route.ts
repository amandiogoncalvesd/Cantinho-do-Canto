import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    const supabase = createServerClient()

    let query = supabase
      .from("created_lessons")
      .select(`
        *,
        lesson_statistics(*),
        lesson_blocks(count)
      `)
      .eq("created_by", user.userId)
      .order("updated_at", { ascending: false })

    // Filtros
    if (status) {
      query = query.eq("status", status)
    }
    if (category) {
      query = query.eq("category", category)
    }
    if (level) {
      query = query.eq("level", level)
    }
    if (search) {
      query = query.textSearch("search_vector", search)
    }

    // Paginação
    query = query.range(offset, offset + limit - 1)

    const { data: lessons, error, count } = await query

    if (error) {
      console.error("Erro ao buscar aulas:", error)
      return NextResponse.json({ error: "Erro ao buscar aulas" }, { status: 500 })
    }

    return NextResponse.json({
      lessons,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Erro na API de aulas criadas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
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
      status = "draft",
    } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Criar aula
    const { data: lesson, error: lessonError } = await supabase
      .from("created_lessons")
      .insert({
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
        created_by: user.userId,
        published_at: status === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (lessonError) {
      console.error("Erro ao criar aula:", lessonError)
      return NextResponse.json({ error: "Erro ao criar aula" }, { status: 500 })
    }

    // Criar blocos se fornecidos
    if (blocks && blocks.length > 0) {
      const blocksToInsert = blocks.map((block: any, index: number) => ({
        lesson_id: lesson.id,
        block_type: block.type,
        order_index: index,
        content: block.content,
        title: block.title,
        description: block.description,
      }))

      const { error: blocksError } = await supabase.from("lesson_blocks").insert(blocksToInsert)

      if (blocksError) {
        console.error("Erro ao criar blocos:", blocksError)
        // Não falha a criação da aula por causa dos blocos
      }
    }

    // Criar versão inicial
    const { error: versionError } = await supabase.rpc("create_lesson_version", {
      p_lesson_id: lesson.id,
      p_version_notes: "Versão inicial",
      p_created_by: user.userId,
    })

    if (versionError) {
      console.error("Erro ao criar versão:", versionError)
    }

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    console.error("Erro na criação de aula:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
