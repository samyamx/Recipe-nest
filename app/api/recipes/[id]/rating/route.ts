import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { addRecipeRating } from "@/lib/recipe-store"
<<<<<<< HEAD
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
=======

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
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
