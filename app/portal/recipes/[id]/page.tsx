import { getRecipeById } from "@/lib/recipe-store"
import { notFound } from "next/navigation"
import PortalRecipeForm from "../../add-recipe/page"

export const dynamic = "force-dynamic"

export default async function EditRecipePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const recipe = await getRecipeById(params.id)

  if (!recipe) {
    notFound()
  }

  // Format recipe for the form
  const formattedRecipe = {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    image: recipe.image,
    featured: (recipe as any).featured || false
  }

  return <PortalRecipeForm initialData={formattedRecipe} />
}
