import { NextResponse } from "next/server"
import { addSiteCategory } from "@/lib/recipe-store"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const name = (body.name || "").trim()
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 })

    const created = await addSiteCategory(name)
    if (!created) return NextResponse.json({ error: "Could not create category" }, { status: 500 })

    return NextResponse.json({ ok: true, category: created })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
