import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { updateRecipeBookmark } from "@/lib/recipe-store"

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = (await request.json().catch(() => ({}))) as { bookmarked?: boolean }
  const recipe = await updateRecipeBookmark(id, body.bookmarked)

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  revalidatePath("/")
  revalidatePath("/explore")
  revalidatePath("/profile")
  revalidatePath(`/recipe/${id}`)

  return NextResponse.json({ recipe })
}
