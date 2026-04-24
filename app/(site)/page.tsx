import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedRecipes } from "@/components/landing/featured-recipes"
import { CategoriesSection } from "@/components/landing/categories-section"
import { CtaSection } from "@/components/landing/cta-section"
import { getCategoryStats, getHomeStats, listRecipes } from "@/lib/recipe-store"
<<<<<<< HEAD
import { getCurrentUser } from "@/lib/auth"
=======
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7

export const dynamic = "force-dynamic"

export default async function LandingPage() {
<<<<<<< HEAD
  const [featuredRecipes, categoryStats, stats, user] = await Promise.all([
    listRecipes({ limit: 6 }),
    getCategoryStats(),
    getHomeStats(),
    getCurrentUser(),
=======
  const [featuredRecipes, categoryStats, stats] = await Promise.all([
    listRecipes({ limit: 6 }),
    getCategoryStats(),
    getHomeStats(),
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
  ])

  return (
    <>
      <HeroSection stats={stats} />
      <FeaturedRecipes recipes={featuredRecipes} />
      <CategoriesSection categories={categoryStats} />
<<<<<<< HEAD
      <CtaSection user={user} />
=======
      <CtaSection />
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
    </>
  )
}
