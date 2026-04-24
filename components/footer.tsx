import Link from "next/link"
import { ChefHat } from "lucide-react"
import type { AppUser } from "@/lib/auth"

export function Footer({ user }: { user: AppUser | null }) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl text-foreground">Recipe Nest</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              A warm community for food lovers to discover, create, and share beautiful recipes.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Explore</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Recipes</Link></li>
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Popular</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Community</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="/add-recipe" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Share a Recipe</Link></li>
              <li><Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Profile</Link></li>
              {user?.role === "Admin" && (
                <li><Link href="/portal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin Portal</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          2026 Recipe Nest. Crafted with care for food lovers everywhere.
        </div>
      </div>
    </footer>
  )
}
