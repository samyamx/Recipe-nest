import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Clock, Users, ChefHat } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RecipeDetailClient } from "@/components/recipe/recipe-detail-client"
import { getRecipeById } from "@/lib/recipe-store"

export const dynamic = "force-dynamic"

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await getRecipeById(id)

  if (!recipe) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center lg:px-8">
        <h1 className="font-serif text-2xl text-foreground">Recipe not found</h1>
        <Link href="/explore" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to explore
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recipes
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/9]">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{recipe.category}</Badge>
              <Badge variant="outline">{recipe.difficulty}</Badge>
            </div>
            <h1 className="mt-3 font-serif text-3xl text-foreground lg:text-4xl text-balance">
              {recipe.title}
            </h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">{recipe.description}</p>
          </div>
          <RecipeDetailClient recipe={recipe} mode="header" />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </span>
          <RecipeDetailClient recipe={recipe} mode="summary" />
          <span className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4" />
            {recipe.author}
          </span>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="font-serif text-xl text-foreground">Ingredients</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {recipe.ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-card-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl text-foreground">Instructions</h2>
          <ol className="mt-4 flex flex-col gap-5">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <p className="text-sm text-card-foreground leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Separator className="my-8" />
      <RecipeDetailClient recipe={recipe} mode="rating" />
    </div>
  )
}
