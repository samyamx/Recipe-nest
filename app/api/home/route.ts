import { NextResponse } from "next/server"
import { getCategoryStats, getHomeStats, listRecipes } from "@/lib/recipe-store"

export async function GET() {
  const [featuredRecipes, categoryStats, stats] = await Promise.all([
    listRecipes({ limit: 6 }),
    getCategoryStats(),
    getHomeStats(),
  ])

  return NextResponse.json({
    categoryStats,
    featuredRecipes,
    stats,
  })
}
