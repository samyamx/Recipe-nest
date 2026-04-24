"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Printer, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Recipe } from "@/lib/data"

type RecipeDetailClientProps = {
  mode: "header" | "rating" | "summary"
  recipe: Recipe
}

export function RecipeDetailClient({ mode, recipe }: RecipeDetailClientProps) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(recipe.bookmarked)
  const [userRating, setUserRating] = useState(0)
  const [ratingSummary, setRatingSummary] = useState({
    rating: recipe.rating,
    reviews: recipe.reviews,
  })

  async function toggleBookmark() {
    const response = await fetch(`/api/recipes/${recipe.id}/bookmark`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookmarked: !isBookmarked }),
    })

    if (response.status === 401) {
      toast.info("Please sign in to save recipes", {
        description: "Redirecting you to the login page...",
      })
      router.push("/login?next=" + encodeURIComponent(`/recipe/${recipe.id}`))
      return
    }

    if (!response.ok) {
      toast.error("Unable to update bookmark right now.")
      return
    }

    const data = (await response.json()) as { recipe: Recipe }
    setIsBookmarked(data.recipe.bookmarked)
    toast.success(data.recipe.bookmarked ? "Recipe saved." : "Bookmark removed.")
  }

  async function submitRating(value: number) {
    const response = await fetch(`/api/recipes/${recipe.id}/rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating: value }),
    })

    if (response.status === 401) {
      toast.info("Please sign in to rate recipes", {
        description: "Redirecting you to the login page...",
      })
      router.push("/login?next=" + encodeURIComponent(`/recipe/${recipe.id}`))
      return
    }

    if (!response.ok) {
      toast.error("Unable to submit rating right now.")
      return
    }

    const data = (await response.json()) as { recipe: Recipe }
    setUserRating(value)
    setRatingSummary({
      rating: data.recipe.rating,
      reviews: data.recipe.reviews,
    })
    toast.success("Thanks for rating this recipe.")
  }

  if (mode === "header") {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleBookmark}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`}
          />
        </Button>
        <Button variant="outline" size="icon" aria-label="Print recipe" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (mode === "summary") {
    return (
      <span className="flex items-center gap-1.5 text-primary">
        <Star className="h-4 w-4 fill-primary" />
        {ratingSummary.rating} ({ratingSummary.reviews} reviews)
      </span>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground">Rate this recipe</h2>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => submitRating(star)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= userRating
                  ? "fill-primary text-primary"
                  : "text-border hover:text-primary/50"
              }`}
            />
          </button>
        ))}
        {userRating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            You rated this {userRating}/5
          </span>
        )}
      </div>
    </div>
  )
}
