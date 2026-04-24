import Link from "next/link"
import { Utensils } from "lucide-react"

type CategoryStat = {
  name: string
  count: number
}

export function CategoriesSection({ categories }: { categories: CategoryStat[] }) {
  return (
    <section className="bg-muted/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-foreground lg:text-4xl">Browse by category</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground leading-relaxed">
            From quick snacks to gourmet dinners, find exactly what you're looking for.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/explore?category=${category.name}`}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-foreground">{category.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{category.count} recipes</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
