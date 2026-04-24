import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import type { AppUser } from "@/lib/auth"

export function CtaSection({ user }: { user: AppUser | null }) {
=======

export function CtaSection() {
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-2xl bg-primary p-8 text-center lg:p-16">
          <h2 className="font-serif text-3xl text-primary-foreground lg:text-4xl text-balance">
            Share your culinary creations
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80 leading-relaxed">
            Join our community of food enthusiasts. Upload your recipes, inspire others, and discover new flavors from around the world.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
<<<<<<< HEAD
            <Link href={user ? "/add-recipe" : "/login"}>
              <Button size="lg" className="rounded-xl bg-card text-card-foreground hover:bg-card/90 gap-2">
                {user ? "Share a Recipe" : "Get Started Free"}
=======
            <Link href="/login">
              <Button size="lg" className="rounded-xl bg-card text-card-foreground hover:bg-card/90 gap-2">
                Get Started Free
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                Browse Recipes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
