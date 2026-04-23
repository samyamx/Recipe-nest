import { NextResponse } from "next/server"
import { getCategoryStats, getSiteCategories } from "@/lib/recipe-store"

export async function GET() {
  const [categories, stats] = await Promise.all([getSiteCategories(), getCategoryStats()])
  return NextResponse.json({ categories, stats })
}
