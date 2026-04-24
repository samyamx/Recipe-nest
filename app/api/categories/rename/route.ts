import { NextResponse } from "next/server"
import { renameSiteCategory } from "@/lib/recipe-store"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { oldName, newName } = body || {}
    if (!oldName || !newName) return NextResponse.json({ error: "oldName and newName are required" }, { status: 400 })

    const res = await renameSiteCategory(oldName, newName)
    if (!res) return NextResponse.json({ error: "Could not rename category" }, { status: 500 })

    return NextResponse.json({ ok: true, result: res })
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
