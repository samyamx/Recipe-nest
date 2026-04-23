"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type HeroSectionProps = {
  stats: {
    avgRating: number
    totalMembers: number
    totalRecipes: number
  }
}

export function HeroSection({ stats }: HeroSectionProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  function goToExplore() {
    const query = searchQuery.trim()
    router.push(query ? `/explore?search=${encodeURIComponent(query)}` : "/explore")
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/api/assets/hero"
          alt="Beautiful food spread"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl leading-tight text-background sm:text-5xl lg:text-6xl text-balance">
            Discover recipes that feel like home
          </h1>
          <p className="mt-4 text-lg text-background/80 leading-relaxed max-w-lg">
            A curated collection of recipes from passionate home cooks and professional chefs. Find your next favorite dish.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goToExplore()
                  }
                }}
                className="pl-10 h-12 bg-card/95 backdrop-blur-sm border-0 text-card-foreground placeholder:text-muted-foreground rounded-xl"
              />
            </div>
            <Link href={searchQuery.trim() ? `/explore?search=${encodeURIComponent(searchQuery.trim())}` : "/explore"}>
              <Button size="lg" className="h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-2" onClick={goToExplore}>
                Explore Recipes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-background/70">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              {stats.totalRecipes.toLocaleString()}+ Recipes
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              {stats.totalMembers.toLocaleString()}+ Members
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              {stats.avgRating.toFixed(1)} Avg Rating
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
