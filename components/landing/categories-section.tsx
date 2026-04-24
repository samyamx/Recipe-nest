import Link from "next/link"
import { UtensilsCrossed, Cake, Fish, Croissant, Pizza, Salad, Soup, Leaf } from "lucide-react"

type CategoryStat = {
  name: string
  count: number
}

const iconMap = {
  Breakfast: Croissant,
  Dessert: Cake,
  Pasta: UtensilsCrossed,
  Pizza: Pizza,
  Salad: Salad,
  Seafood: Fish,
  Soup: Soup,
  Vegan: Leaf,
} as const

export function CategoriesSection({ categories }: { categories: CategoryStat[] }) {
  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-foreground lg:text-4xl text-balance">
            Browse by category
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Find exactly what you are craving
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = iconMap[category.name as keyof typeof iconMap] ?? UtensilsCrossed

            return (
            <Link
              key={category.name}
              href={`/explore?category=${category.name}`}
              className="group flex flex-col items-center gap-3 rounded-xl bg-card p-6 border border-border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-card-foreground">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.count} recipes</p>
              </div>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
