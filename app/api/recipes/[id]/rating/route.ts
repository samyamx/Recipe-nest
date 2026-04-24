import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { addRecipeRating } from "@/lib/recipe-store"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await context.params
  const body = (await request.json()) as { rating?: number }
  const rating = Number(body.rating)

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
  }

  const recipe = await addRecipeRating(id, rating)

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  revalidatePath("/")
  revalidatePath("/explore")
  revalidatePath("/profile")
  revalidatePath(`/recipe/${id}`)

  return NextResponse.json({ recipe })
}
