import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecipeCard } from "@/components/recipe-card"
import type { Recipe } from "@/lib/data"

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
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/explore">
            <Button variant="outline" className="gap-2">
              View all recipes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
