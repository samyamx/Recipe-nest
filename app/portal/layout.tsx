import { redirect } from "next/navigation"
import { PortalSidebar } from "@/components/portal/portal-sidebar"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
  title: "Admin Portal - Management Dashboard",
  description: "Manage recipes, users, and analytics for Recipe Nest",
}

export const dynamic = "force-dynamic"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?next=/portal")
  }

  if (user.role !== "Admin" && user.role !== "Chef") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar userName={user.name} userRole={user.role} />
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
