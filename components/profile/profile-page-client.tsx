"use client"

import { useState } from "react"
import { Camera, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RecipeCard } from "@/components/recipe-card"
import { toast } from "sonner"
import type { AppUser } from "@/lib/auth"
import type { Recipe } from "@/lib/data"

type ProfilePageClientProps = {
  savedRecipes: Recipe[]
  uploadedRecipes: Recipe[]
  user: AppUser
}

export function ProfilePageClient({ savedRecipes, uploadedRecipes, user }: ProfilePageClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [bio, setBio] = useState(user.bio || "Tell the community a little about yourself.")
  const [location, setLocation] = useState(user.location || "Add your location")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio,
          location,
          name,
        }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error || "Unable to update profile.")
      }

      setIsEditing(false)
      toast.success("Profile updated!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update profile.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-serif text-primary">
              {name.charAt(0)}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm" aria-label="Change avatar">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-serif text-2xl text-foreground">{name}</h1>
                    <p className="text-sm text-muted-foreground">{location}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{bio}</p>
                <div className="mt-4 flex gap-6 text-sm">
                  <span className="text-foreground"><strong>{uploadedRecipes.length}</strong> <span className="text-muted-foreground">recipes</span></span>
                  <span className="text-foreground"><strong>{savedRecipes.length}</strong> <span className="text-muted-foreground">saved</span></span>
                  <span className="text-foreground"><strong>4.8</strong> <span className="text-muted-foreground">avg rating</span></span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="saved">
        <TabsList className="bg-secondary">
          <TabsTrigger value="saved">Saved Recipes</TabsTrigger>
          <TabsTrigger value="uploaded">My Recipes</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="mt-6">
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-lg">No saved recipes yet</p>
              <p className="mt-1 text-sm">Bookmark recipes to see them here</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="uploaded" className="mt-6">
          {uploadedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uploadedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-lg">No recipes uploaded yet</p>
              <p className="mt-1 text-sm">Start sharing your culinary creations</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
