"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Users,
  BarChart3,
  Settings,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const navItems = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/recipes", label: "Recipes", icon: ChefHat },
  { href: "/portal/add-recipe", label: "Add Recipe", icon: PlusCircle },
  { href: "/portal/categories", label: "Categories", icon: FolderOpen },
  { href: "/portal/users", label: "Users", icon: Users },
  { href: "/portal/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/portal/settings", label: "Settings", icon: Settings },
]

export function PortalSidebar({ userName, userRole }: { userName: string; userRole: "Admin" | "Chef" }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavItems = navItems.filter((item) => {
    if (userRole === "Chef") {
      return !["Users", "Analytics"].includes(item.label)
    }
    return true
  })
  async function handleLogout() {
    await fetch("/api/auth/signout", {
      method: "POST",
    })
    router.push("/login")
    router.refresh()
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "sticky top-0 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Link href="/portal" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
              <ChefHat className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-serif text-lg text-sidebar-foreground whitespace-nowrap">
                  {userRole === "Admin" ? "Admin Portal" : "Chef Portal"}
                </span>
                <p className="truncate text-xs text-sidebar-foreground/60">{userName}</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3" aria-label="Portal navigation">
          <ul className="flex flex-col gap-1">
            {filteredNavItems.map((item) => {
              const isActive = item.href === "/portal" ? pathname === "/portal" : pathname.startsWith(item.href)
              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className="h-4.5 w-4.5 shrink-0" />
                        {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" />
                {!collapsed && <span>Sign Out</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}
          </Tooltip>

          {!collapsed && (
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="h-4.5 w-4.5 shrink-0" />
              <span>Back to Site</span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-1 flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
