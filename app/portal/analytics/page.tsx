"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { monthlyData, categoryStats, dashboardStats } from "@/lib/data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

const PIE_COLORS = [
  "oklch(0.55 0.15 45)",
  "oklch(0.70 0.14 55)",
  "oklch(0.60 0.10 80)",
  "oklch(0.75 0.12 65)",
  "oklch(0.45 0.08 40)",
  "oklch(0.65 0.10 50)",
  "oklch(0.80 0.08 70)",
  "oklch(0.50 0.12 60)",
]

const engagementData = [
  { month: "Sep", bookmarks: 420, reviews: 180, shares: 95 },
  { month: "Oct", bookmarks: 510, reviews: 220, shares: 130 },
  { month: "Nov", bookmarks: 480, reviews: 195, shares: 110 },
  { month: "Dec", bookmarks: 640, reviews: 310, shares: 190 },
  { month: "Jan", bookmarks: 590, reviews: 280, shares: 170 },
  { month: "Feb", bookmarks: 720, reviews: 350, shares: 220 },
]

export default function AnalyticsPage() {
  const [topCategories, setTopCategories] = useState(categoryStats.slice(0, 6))

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/categories")
        if (!res.ok) return
        const data = (await res.json()) as { stats?: { name: string; count: number }[] }
        if (!mounted) return
        setTopCategories((data.stats || categoryStats).slice(0, 6))
      } catch {
        // Ignore network errors; keep seed stats.
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Insights into platform performance and user engagement</p>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Page Views", value: "45.2k", change: "+15%" },
          { label: "Unique Visitors", value: "12.8k", change: "+10%" },
          { label: "Avg Session", value: "4m 32s", change: "+8%" },
          { label: "Bounce Rate", value: "24%", change: "-3%" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-accent">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Growth */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="oklch(0.55 0.15 45)" fill="oklch(0.55 0.15 45 / 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base font-medium">Recipe Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topCategories} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="count" nameKey="name">
                    {topCategories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-medium">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: 12 }}>{value}</span>} />
                  <Bar dataKey="bookmarks" fill="oklch(0.55 0.15 45)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reviews" fill="oklch(0.70 0.14 55)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="oklch(0.60 0.10 80)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
