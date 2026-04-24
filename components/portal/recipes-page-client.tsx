"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MoreHorizontal, Trash2, Pencil, ExternalLink, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Recipe = {
  id: string
  title: string
  category: string
  difficulty: string
  cookTime: string
  author: string
  createdAt: string
}

export function RecipesPageClient({ initialRecipes, categories }: { initialRecipes: Recipe[], categories: string[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [recipes, setRecipes] = useState(initialRecipes)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.author.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "All" || r.category === category
    return matchesSearch && matchesCategory
  })

  async function handleDelete() {
    if (!selectedRecipe) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/recipes/${selectedRecipe.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete recipe")

      setRecipes(recipes.filter((r) => r.id !== selectedRecipe.id))
      toast.success(`Recipe "${selectedRecipe.title}" deleted`)
      router.refresh()
    } catch (error) {
      toast.error("Could not delete recipe")
    } finally {
      setIsDeleting(false)
      setDeleteDialog(false)
      setSelectedRecipe(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Recipe Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all recipes in the system</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by title or author..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button asChild className="gap-2">
          <Link href="/portal/add-recipe">
            <PlusCircle className="h-4 w-4" />
            Add Recipe
          </Link>
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base font-medium">All Recipes ({filteredRecipes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Recipe</th>
                  <th className="pb-3 font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 font-medium text-muted-foreground">Difficulty</th>
                  <th className="pb-3 font-medium text-muted-foreground">Cook Time</th>
                  <th className="pb-3 font-medium text-muted-foreground">Author</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-3 font-medium text-foreground">{recipe.title}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{recipe.category}</Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={cn(
                        recipe.difficulty === "Easy" ? "text-green-600 border-green-200" :
                        recipe.difficulty === "Medium" ? "text-yellow-600 border-yellow-200" :
                        "text-red-600 border-red-200"
                      )}>
                        {recipe.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{recipe.cookTime}</td>
                    <td className="py-3 text-muted-foreground">{recipe.author}</td>
                    <td className="py-3 text-muted-foreground">{recipe.createdAt}</td>
                    <td className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/recipe/${recipe.id}`} target="_blank" className="gap-2 cursor-pointer">
                              <ExternalLink className="h-3.5 w-3.5" />
                              View on Site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/portal/recipes/${recipe.id}`} className="gap-2 cursor-pointer">
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => {
                              setSelectedRecipe(recipe)
                              setDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredRecipes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No recipes found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedRecipe?.title}"? This action cannot be undone and will remove the recipe from the site.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Recipe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
