import { UtensilsCrossed, Users, Star, TrendingUp, Eye, UserPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPortalDashboardData } from "@/lib/recipe-store"
import { DashboardCharts } from "@/components/portal/dashboard-charts"

export const dynamic = "force-dynamic"

export default async function PortalDashboard() {
  const data = await getPortalDashboardData()
  const { stats, monthlyData, recentRecipes } = data

  const statCards = [
    { label: "Total Recipes", value: stats.totalRecipes.toLocaleString(), icon: UtensilsCrossed, change: "+12%" },
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, change: "+8%" },
    { label: "Avg Rating", value: stats.avgRating.toString(), icon: Star, change: "+0.2" },
    { label: "Monthly Visits", value: (stats.monthlyVisits / 1000).toFixed(1) + "k", icon: Eye, change: "+15%" },
    { label: "Total Reviews", value: (stats.totalReviews / 1000).toFixed(1) + "k", icon: TrendingUp, change: "+22%" },
    { label: "New Users", value: stats.newUsersThisMonth.toString(), icon: UserPlus, change: "+5%" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real-time statistics and activity for Recipe Nest.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="mt-2 text-xs text-accent">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts (Client Component) */}
      <DashboardCharts monthlyData={monthlyData} />

      {/* Recent Recipes */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium text-foreground">Recently Added Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Title</th>
                  <th className="pb-3 font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 font-medium text-muted-foreground">Author</th>
                  <th className="pb-3 font-medium text-muted-foreground">Rating</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRecipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium text-foreground">{recipe.title}</td>
                    <td className="py-3 text-muted-foreground">{recipe.category}</td>
                    <td className="py-3 text-muted-foreground">{recipe.author}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-primary">
                        <Star className="h-3.5 w-3.5 fill-primary" />
                        {recipe.rating}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{recipe.createdAt}</td>
                  </tr>
                ))}
                {recentRecipes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">No recent recipes found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
