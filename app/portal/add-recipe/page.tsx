"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { Save, Eye, Loader2, ArrowLeft } from "lucide-react"
=======
import { useState } from "react"
import { Save, Eye } from "lucide-react"
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
<<<<<<< HEAD
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
=======

export default function PortalAddRecipePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [cookTime, setCookTime] = useState("")
  const [servings, setServings] = useState("")
  const [featured, setFeatured] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-foreground lg:text-3xl">Add / Edit Recipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create or modify a recipe in the system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => toast.success("Recipe saved!")}
          >
            <Save className="h-4 w-4" />
            Save Recipe
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
=======
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
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
<<<<<<< HEAD
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
=======
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the recipe" rows={4} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Ingredients</Label>
                <Textarea placeholder="Enter each ingredient on a new line" rows={6} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Instructions</Label>
                <Textarea placeholder="Enter step-by-step instructions" rows={6} />
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
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
<<<<<<< HEAD
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
=======
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
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
<<<<<<< HEAD
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
=======
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
<<<<<<< HEAD
                <Label htmlFor="cookTime">Cook Time</Label>
                <Input id="cookTime" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g. 30 min" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="servings">Servings</Label>
                <Input id="servings" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g. 4" />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="featured" className="cursor-pointer">Featured Recipe</Label>
=======
                <Label htmlFor="cookTimePortal">Cook Time</Label>
                <Input id="cookTimePortal" value={cookTime} onChange={(e) => setCookTime(e.target.value)} placeholder="e.g., 30 min" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="servingsPortal">Servings</Label>
                <Input id="servingsPortal" type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="e.g., 4" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured Recipe</Label>
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
<<<<<<< HEAD
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
=======
              <CardTitle className="text-base font-medium">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/40">
                <p className="text-sm text-muted-foreground">Click to upload</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
>>>>>>> 8c952ef0f8387dbc279f946f4559881fc5e45ea7
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
