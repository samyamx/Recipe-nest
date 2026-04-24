"use client"

import { useState, useEffect } from "react"
import { Save, Eye, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

type RecipeData = {
  id?: string
  title: string
  description: string
  category: string
  difficulty: string
  cookTime: string
  servings: number | string
  ingredients: string[] | string
  steps: string[] | string
  image?: string
  featured?: boolean
}

export default function PortalRecipeForm({ initialData }: { initialData?: RecipeData }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [category, setCategory] = useState(initialData?.category || "")
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "")
  const [cookTime, setCookTime] = useState(initialData?.cookTime || "")
  const [servings, setServings] = useState(initialData?.servings || "")
  const [featured, setFeatured] = useState(initialData?.featured || false)
  const [ingredients, setIngredients] = useState(
    Array.isArray(initialData?.ingredients) 
      ? initialData.ingredients.join("\n") 
      : (initialData?.ingredients || "")
  )
  const [instructions, setInstructions] = useState(
    Array.isArray(initialData?.steps) 
      ? initialData.steps.join("\n") 
      : (initialData?.steps || "")
  )
  const [image, setImage] = useState(initialData?.image || "")

  const isEditing = !!initialData?.id

  async function handleSubmit() {
    if (!title || !description || !category || !difficulty || !cookTime || !servings) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    const payload = {
      title,
      description,
      category,
      difficulty,
      cookTime,
      servings: Number(servings),
      ingredients: ingredients.split("\n").filter(i => i.trim()),
      steps: instructions.split("\n").filter(s => s.trim()),
      image,
      featured
    }

    try {
      const url = isEditing ? `/api/recipes/${initialData.id}` : "/api/recipes"
      const method = isEditing ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save recipe")
      }

      toast.success(isEditing ? "Recipe updated!" : "Recipe created!")
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
            <h1 className="font-serif text-2xl text-foreground lg:text-3xl">
              {isEditing ? "Edit Recipe" : "Add New Recipe"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing ? `Modifying "${initialData.title}"` : "Create a new recipe in the system"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing && (
            <Button variant="outline" className="gap-2" asChild>
              <Link href={`/recipe/${initialData.id}`} target="_blank">
                <Eye className="h-4 w-4" />
                View on Site
              </Link>
            </Button>
          )}
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
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
                <Label htmlFor="ingredients">Ingredients (One per line)</Label>
                <Textarea 
                  id="ingredients"
                  value={ingredients} 
                  onChange={(e) => setIngredients(e.target.value)} 
                  placeholder="e.g. 2 cups flour" 
                  rows={6} 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="instructions">Instructions (One step per line)</Label>
                <Textarea 
                  id="instructions"
                  value={instructions} 
                  onChange={(e) => setInstructions(e.target.value)} 
                  placeholder="e.g. Preheat oven to 350F" 
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
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {["Pasta", "Bread", "Breakfast", "Seafood", "Pizza", "Dessert", "Salad", "Soup", "Vegan"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
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
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
                <p className="text-[10px] text-muted-foreground italic">Tip: Leave empty to use a default placeholder image.</p>
              </div>
              {image && (
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
