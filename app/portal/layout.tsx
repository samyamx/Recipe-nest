import { redirect } from "next/navigation"
import { PortalSidebar } from "@/components/portal/portal-sidebar"
import { getCurrentUser } from "@/lib/auth"

export const metadata = {
<<<<<<< HEAD
  title: "Admin Portal - Management Dashboard",
=======
  title: "ChefPortal - Admin Dashboard",
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
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

<<<<<<< HEAD
  if (user.role !== "Admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <PortalSidebar userName={user.name} userRole={user.role} />
=======
  return (
    <div className="flex min-h-screen">
      <PortalSidebar userName={user.name} />
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
      <main className="flex-1 overflow-auto bg-background">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
