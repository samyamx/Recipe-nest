import { NextResponse } from "next/server"
<<<<<<< HEAD
import { getRecipeById, updateRecipe, deleteRecipe } from "@/lib/recipe-store"
=======
import { getRecipeById } from "@/lib/recipe-store"
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const recipe = await getRecipeById(id)

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  return NextResponse.json({ recipe })
}
<<<<<<< HEAD

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const recipe = await updateRecipe(id, body)

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
    }

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update recipe." }, { status: 500 })
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const success = await deleteRecipe(id)

    if (!success) {
      return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete recipe." }, { status: 500 })
  }
}
=======
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
