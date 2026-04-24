import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecipeCard } from "@/components/recipe-card"
import type { Recipe } from "@/lib/data"

<<<<<<< HEAD
type FeaturedRecipesProps = {
  recipes: Recipe[]
}

export function FeaturedRecipes({ recipes }: FeaturedRecipesProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl text-foreground lg:text-4xl text-balance">
              Featured recipes from our community
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Explore the most popular dishes and hidden gems hand-picked by our editors.
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
=======
export function FeaturedRecipes({ recipes }: { recipes: Recipe[] }) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl text-foreground lg:text-4xl text-balance">
              Featured recipes
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Handpicked favorites from our community
            </p>
          </div>
          <Link href="/explore" className="hidden sm:block">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary/90 hover:bg-primary/5">
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
<<<<<<< HEAD

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
=======
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
<<<<<<< HEAD
=======
        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore">
            <Button variant="outline" className="gap-2">
              View all recipes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
      </div>
    </section>
  )
}
