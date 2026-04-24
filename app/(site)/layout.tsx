import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
<<<<<<< HEAD
      <Footer user={user} />
=======
      <Footer />
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
    </div>
  )
}
