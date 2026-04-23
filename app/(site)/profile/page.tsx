import { redirect } from "next/navigation"
import { ProfilePageClient } from "@/components/profile/profile-page-client"
import { getCurrentUser } from "@/lib/auth"
import { listRecipes } from "@/lib/recipe-store"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?next=/profile")
  }

  const [savedRecipes, uploadedRecipes] = await Promise.all([
    listRecipes({ bookmarked: true }),
    listRecipes({ author: user.name }),
  ])

  return <ProfilePageClient savedRecipes={savedRecipes} uploadedRecipes={uploadedRecipes} user={user} />
}
