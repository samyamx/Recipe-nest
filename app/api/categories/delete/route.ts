import { NextResponse } from "next/server"
import { deleteSiteCategory } from "@/lib/recipe-store"

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const { name, replacement } = body || {}
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 })

    const res = await deleteSiteCategory(name, replacement || 'All')
    if (!res) return NextResponse.json({ error: "Could not delete category" }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
