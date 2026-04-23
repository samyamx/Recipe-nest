"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RecipeCard } from "@/components/recipe-card"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/lib/data"

type ExplorePageClientProps = {
  categories: string[]
  initialCategory: string
  initialRecipes: Recipe[]
  initialSearch: string
}

export function ExplorePageClient({
  categories,
  initialCategory,
  initialRecipes,
  initialSearch,
}: ExplorePageClientProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [search, setSearch] = useState(initialSearch)
  const [recipes, setRecipes] = useState(initialRecipes)

  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    setRecipes(initialRecipes)
  }, [initialRecipes])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams()

    if (activeCategory && activeCategory !== "All") {
      params.set("category", activeCategory)
    }

    if (search.trim()) {
      params.set("search", search.trim())
    }

    const queryString = params.toString()

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    })

    fetch(`/api/recipes${queryString ? `?${queryString}` : ""}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load recipes.")
        }

        const data = (await response.json()) as { recipes: Recipe[] }
        setRecipes(data.recipes)
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error)
        }
      })

    return () => controller.abort()
  }, [activeCategory, pathname, router, search])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-3xl text-foreground lg:text-4xl">Explore recipes</h1>
        <p className="text-muted-foreground leading-relaxed">
          Browse our collection of community-crafted recipes
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Recipe categories">
        {categories.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {recipes.length > 0 ? (
        <div className={cn("mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", isPending && "opacity-80")}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">No recipes found matching your search.</p>
          <button
            onClick={() => {
              setActiveCategory("All")
              setSearch("")
            }}
            className="mt-2 text-sm font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
