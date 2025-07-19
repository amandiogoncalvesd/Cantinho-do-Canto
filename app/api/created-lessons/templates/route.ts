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
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const publicOnly = searchParams.get("public") === "true"

    const supabase = createServerClient()

    let query = supabase.from("lesson_templates").select("*").order("usage_count", { ascending: false })

    if (publicOnly) {
      query = query.eq("is_public", true)
    } else {
      query = query.or(`is_public.eq.true,created_by.eq.${user.userId}`)
    }

    if (category) {
      query = query.eq("category", category)
    }
    if (level) {
      query = query.eq("level", level)
    }

    const { data: templates, error } = await query

    if (error) {
      console.error("Erro ao buscar templates:", error)
      return NextResponse.json({ error: "Erro ao buscar templates" }, { status: 500 })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Erro na API de templates:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    const { name, description, category, level, templateData, blocksTemplate, isPublic } = await request.json()

    if (!name || !templateData || !blocksTemplate) {
      return NextResponse.json({ error: "Nome, dados do template e blocos são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: template, error } = await supabase
      .from("lesson_templates")
      .insert({
        name,
        description,
        category,
        level,
        template_data: templateData,
        blocks_template: blocksTemplate,
        is_public: isPublic || false,
        created_by: user.userId,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar template:", error)
      return NextResponse.json({ error: "Erro ao criar template" }, { status: 500 })
    }

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error("Erro na criação de template:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
