import { UsersPageClient } from "@/components/portal/users-page-client"
import { listUsersWithRecipeCounts } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const users = await listUsersWithRecipeCounts()
  return <UsersPageClient initialUsers={users} />
}
