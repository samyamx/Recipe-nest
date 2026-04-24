import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedRecipes } from "@/components/landing/featured-recipes"
import { CategoriesSection } from "@/components/landing/categories-section"
import { CtaSection } from "@/components/landing/cta-section"
import { getCategoryStats, getHomeStats, listRecipes } from "@/lib/recipe-store"
import { getCurrentUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  const [featuredRecipes, categoryStats, stats, user] = await Promise.all([
    listRecipes({ limit: 6 }),
    getCategoryStats(),
    getHomeStats(),
    getCurrentUser(),
  ])

  return (
    <>
      <HeroSection stats={stats} />
      <FeaturedRecipes recipes={featuredRecipes} />
      <CategoriesSection categories={categoryStats} />
      <CtaSection user={user} />
    </>
  )
}
