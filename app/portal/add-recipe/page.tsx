"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type RecipePayload = {
  title: string
  description: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard" | ""
  cookTime: string
  servings: number
  ingredients: string[]
  steps: string[]
  image?: string
  featured?: boolean
}

export default function PortalAddRecipePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState<RecipePayload["difficulty"]>("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [featured, setFeatured] = useState(false)
  const [ingredients, setIngredients] = useState("")
  const [steps, setSteps] = useState("")
  const [image, setImage] = useState("")

  async function handleSubmit() {
    if (!title.trim() || !description.trim() || !category || !difficulty || !cookTime.trim() || !servings) {
      toast.error("Please fill in all required fields")
      return
    }

    const payload: RecipePayload = {
      title: title.trim(),
      description: description.trim(),
      category,
      difficulty,
      cookTime: cookTime.trim(),
      servings: Number(servings),
      ingredients: ingredients
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      steps: steps
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      image: image.trim() || undefined,
      featured,
    }

    if (!Number.isFinite(payload.servings) || payload.servings <= 0) {
      toast.error("Servings must be a positive number")
      return
    }

    if (!payload.ingredients.length || !payload.steps.length) {
      toast.error("Please add ingredients and instructions")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => ({}))) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Failed to save recipe")
      }

      toast.success("Recipe created!")
      router.push("/portal/recipes")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/recipes">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Add New Recipe</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create a new recipe in the system</p>
          </div>
        </div>
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Recipe Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter recipe title" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the recipe" rows={3} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ingredients">Ingredients (one per line)</Label>
                <Textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g. 2 cups flour"
                  rows={6}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="steps">Instructions (one step per line)</Label>
                <Textarea
                  id="steps"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="e.g. Preheat oven to 350°F"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Pasta", "Bread", "Breakfast", "Seafood", "Pizza", "Dessert", "Salad", "Soup", "Vegan"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as RecipePayload["difficulty"])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cookTime">Cook Time</Label>
                <Input id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g. 30 min" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g. 4" />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="featured" className="cursor-pointer">Featured Recipe</Label>
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base font-medium">Media</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                <p className="text-[10px] text-muted-foreground italic">Tip: Leave empty to use a default placeholder image.</p>
              </div>
              {image.trim() && (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.trim()} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
