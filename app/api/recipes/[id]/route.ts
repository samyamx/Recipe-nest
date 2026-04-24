import { NextResponse } from "next/server"
import { getRecipeById, updateRecipe, deleteRecipe } from "@/lib/recipe-store"

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const recipe = await getRecipeById(id)

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found." }, { status: 404 })
  }

  return NextResponse.json({ recipe })
}

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
