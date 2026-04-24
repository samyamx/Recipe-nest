import { RecipesPageClient } from "@/components/portal/recipes-page-client"
import { listRecipes, getSiteCategories } from "@/lib/recipe-store"

export const dynamic = "force-dynamic"

export default async function PortalRecipesPage() {
  const recipes = await listRecipes()
  const categories = await getSiteCategories()
  
  // Format recipes for the client component
  const formattedRecipes = recipes.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    difficulty: r.difficulty,
    cookTime: r.cookTime,
    author: r.author,
    createdAt: r.createdAt
  }))

  return <RecipesPageClient initialRecipes={formattedRecipes} categories={categories} />
}
