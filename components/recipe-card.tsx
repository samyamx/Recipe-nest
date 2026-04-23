"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, Bookmark, Star, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/lib/data"
import { toast } from "sonner"

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isBookmarked, setIsBookmarked] = useState(recipe.bookmarked)

  async function toggleBookmark(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    e.stopPropagation()

    const response = await fetch(`/api/recipes/${recipe.id}/bookmark`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookmarked: !isBookmarked }),
    })

    if (!response.ok) {
      toast.error("Unable to update bookmark right now.")
      return
    }

    const data = (await response.json()) as { recipe: Recipe }
    setIsBookmarked(data.recipe.bookmarked)
  }

  return (
    <Link
      href={`/recipe/${recipe.id}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
        <button
          onClick={toggleBookmark}
          className="absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <Bookmark
            className={`h-4 w-4 transition-colors ${
              isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
        <Badge className="absolute bottom-3 left-3 bg-card/80 backdrop-blur-sm text-card-foreground border-0">
          {recipe.category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-medium text-card-foreground group-hover:text-primary transition-colors text-balance">
          {recipe.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.cookTime}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings}
            </span>
          </div>
          <span className="flex items-center gap-1 text-primary">
            <Star className="h-3.5 w-3.5 fill-primary" />
            {recipe.rating}
          </span>
        </div>
      </div>
    </Link>
  )
}
