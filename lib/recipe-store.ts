import "server-only"

import { categories as seedCategories, recipes as seedRecipes, type Recipe } from "@/lib/data"
import { getDatabaseSafely } from "@/lib/mongodb"
import { getTotalUsers, getNewUsersThisMonth } from "@/lib/auth"

const recipesCollectionName = "recipes"

const categoriesCollectionName = "categories"
let fallbackRecipes = seedRecipes.map((recipe) => normalizeRecipe(recipe))

type RecipeFilters = {
  author?: string
  bookmarked?: boolean
  category?: string
  limit?: number
  search?: string
}

type CreateRecipeInput = {
  author?: string
  category: string
  cookTime: string
  description: string
  difficulty: Recipe["difficulty"]
  image?: string
  ingredients: string[]
  servings: number
  steps: string[]
  title: string
}

type RecipeDocument = Recipe & {
  _id?: string
}

function getLocalRecipeImage(id: string) {
  if (/^\d+$/.test(id)) {
    return `/images/recipes/${id}.jpg`
  }

  return null
}

function getFallbackImage(id: string) {
  return getLocalRecipeImage(id) ?? `/api/assets/recipe/${id}`
}

function normalizeRecipe(recipe: Recipe): Recipe {
  const image = recipe.image?.trim()
  const localImage = getLocalRecipeImage(recipe.id)

  if (localImage && (!image || image === `/api/assets/recipe/${recipe.id}`)) {
    return {
      ...recipe,
      image: localImage,
      rating: Number(recipe.rating.toFixed(1)),
    }
  }

  return {
    ...recipe,
    image:
      image && (image.startsWith("data:") || image.startsWith("/api/") || image.startsWith("http"))
        ? image
        : getFallbackImage(recipe.id),
    rating: Number(recipe.rating.toFixed(1)),
  }
}

async function getRecipesCollection() {
  const db = await getDatabaseSafely()
  return db?.collection<RecipeDocument>(recipesCollectionName) ?? null
}

async function getCategoriesCollection() {
  const db = await getDatabaseSafely()
  return db?.collection<{ name: string }>(categoriesCollectionName) ?? null
}


async function ensureSeedData() {
  const collection = await getRecipesCollection()

  if (!collection) {
    return null
  }

  const existingCount = await collection.estimatedDocumentCount()

  if (existingCount > 0) {
    return collection
  }

  await collection.insertMany(seedRecipes.map(normalizeRecipe))
  return collection
}

function sortRecipes(recipes: Recipe[]) {
  return recipes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function readRecipes() {
  const collection = await ensureSeedData()

  if (!collection) {
    return sortRecipes([...fallbackRecipes])
  }

  const recipes = await collection.find({}, { projection: { _id: 0 } }).toArray()
  return sortRecipes(recipes.map((recipe) => normalizeRecipe(recipe as Recipe)))
}

export async function listRecipes(filters: RecipeFilters = {}) {
  const recipes = await readRecipes()
  const query = filters.search?.trim().toLowerCase()

  let filtered = recipes.filter((recipe) => {
    const matchesCategory =
      !filters.category || filters.category === "All" || recipe.category === filters.category
    const matchesSearch =
      !query ||
      recipe.title.toLowerCase().includes(query) ||
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(query))
    const matchesBookmarked = filters.bookmarked === undefined || recipe.bookmarked === filters.bookmarked
    const matchesAuthor = !filters.author || recipe.author === filters.author

    return matchesCategory && matchesSearch && matchesBookmarked && matchesAuthor
  })

  filtered = sortRecipes(filtered)

  if (filters.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

export async function getRecipeById(id: string) {
  const recipes = await readRecipes()
  return recipes.find((recipe) => recipe.id === id) ?? null
}

export async function createRecipe(input: CreateRecipeInput) {
  const collection = await ensureSeedData()

  const nextRecipe: Recipe = normalizeRecipe({
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    image: input.image?.trim() || "",
    category: input.category,
    cookTime: input.cookTime.trim(),
    servings: input.servings,
    difficulty: input.difficulty,
    rating: 0,
    reviews: 0,
    author: input.author?.trim() || "Community Chef",
    authorAvatar: "",
    bookmarked: false,
    ingredients: input.ingredients.map((item) => item.trim()).filter(Boolean),
    steps: input.steps.map((item) => item.trim()).filter(Boolean),
    createdAt: new Date().toISOString().slice(0, 10),
  })

  if (!collection) {
    fallbackRecipes = sortRecipes([nextRecipe, ...fallbackRecipes])
    return nextRecipe
  }

  await collection.insertOne(nextRecipe)
  return nextRecipe
}


export async function updateRecipe(id: string, input: Partial<CreateRecipeInput>) {
  const collection = await ensureSeedData()

  if (!collection) {
    const index = fallbackRecipes.findIndex((r) => r.id === id)
    if (index === -1) return null

    const current = fallbackRecipes[index]
    const updated = normalizeRecipe({
      ...current,
      title: input.title?.trim() ?? current.title,
      description: input.description?.trim() ?? current.description,
      image: input.image?.trim() ?? current.image,
      category: input.category ?? current.category,
      cookTime: input.cookTime?.trim() ?? current.cookTime,
      servings: input.servings ?? current.servings,
      difficulty: input.difficulty ?? current.difficulty,
      ingredients: input.ingredients?.map((i) => i.trim()).filter(Boolean) ?? current.ingredients,
      steps: input.steps?.map((s) => s.trim()).filter(Boolean) ?? current.steps,
    })

    fallbackRecipes[index] = updated
    return updated
  }

  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        title: input.title?.trim(),
        description: input.description?.trim(),
        image: input.image?.trim(),
        category: input.category,
        cookTime: input.cookTime?.trim(),
        servings: input.servings,
        difficulty: input.difficulty,
        ingredients: input.ingredients?.map((i) => i.trim()).filter(Boolean),
        steps: input.steps?.map((s) => s.trim()).filter(Boolean),
      },
    },
    { returnDocument: "after", projection: { _id: 0 } }
  )

  return result ? normalizeRecipe(result as Recipe) : null
}

export async function deleteRecipe(id: string) {
  const collection = await ensureSeedData()

  if (!collection) {
    const initialLength = fallbackRecipes.length
    fallbackRecipes = fallbackRecipes.filter((r) => r.id !== id)
    return fallbackRecipes.length < initialLength
  }

  const result = await collection.deleteOne({ id })
  return result.deletedCount > 0
}


export async function updateRecipeBookmark(id: string, bookmarked?: boolean) {
  const collection = await ensureSeedData()

  if (!collection) {
    const current = fallbackRecipes.find((recipe) => recipe.id === id)

    if (!current) {
      return null
    }

    const nextBookmarked = bookmarked ?? !current.bookmarked
    const updated = normalizeRecipe({ ...current, bookmarked: nextBookmarked })
    fallbackRecipes = fallbackRecipes.map((recipe) => (recipe.id === id ? updated : recipe))
    return updated
  }

  const current = await collection.findOne({ id }, { projection: { _id: 0 } })

  if (!current) {
    return null
  }

  const nextBookmarked = bookmarked ?? !current.bookmarked
  await collection.updateOne({ id }, { $set: { bookmarked: nextBookmarked } })

  return normalizeRecipe({ ...(current as Recipe), bookmarked: nextBookmarked })
}

export async function addRecipeRating(id: string, userRating: number) {
  const collection = await ensureSeedData()

  if (!collection) {
    const current = fallbackRecipes.find((recipe) => recipe.id === id)

    if (!current) {
      return null
    }

    const nextReviews = current.reviews + 1
    const nextRating = (current.rating * current.reviews + userRating) / nextReviews
    const updated = normalizeRecipe({
      ...current,
      rating: nextRating,
      reviews: nextReviews,
    })

    fallbackRecipes = fallbackRecipes.map((recipe) => (recipe.id === id ? updated : recipe))
    return updated
  }

  const current = await collection.findOne({ id }, { projection: { _id: 0 } })

  if (!current) {
    return null
  }

  const nextReviews = current.reviews + 1
  const nextRating = (current.rating * current.reviews + userRating) / nextReviews
  const updated = normalizeRecipe({
    ...(current as Recipe),
    rating: nextRating,
    reviews: nextReviews,
  })

  await collection.updateOne(
    { id },
    {
      $set: {
        rating: updated.rating,
        reviews: updated.reviews,
      },
    }
  )

  return updated
}

export async function getCategoryStats() {
  const recipes = await readRecipes()
  const counts = recipes.reduce<Record<string, number>>((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] ?? 0) + 1
    return acc
  }, {})

  // Include seed categories and any custom categories stored in DB
  const categoriesCol = await getCategoriesCollection()
  let customCategories: string[] = []
  if (categoriesCol) {
    const docs = await categoriesCol.find({}, { projection: { _id: 0 } }).toArray()
    customCategories = docs.map((d) => d.name)
  }

  const combined = Array.from(new Set([...seedCategories.filter((c) => c !== "All"), ...customCategories]))

  return combined.map((category) => ({
    name: category,
    count: counts[category] ?? 0,
  }))
}

export async function getHomeStats() {
  const recipes = await readRecipes()
  const totalRecipes = recipes.length
  const totalReviews = recipes.reduce((sum, recipe) => sum + recipe.reviews, 0)
  const avgRating =
    totalRecipes > 0
      ? Number((recipes.reduce((sum, recipe) => sum + recipe.rating, 0) / totalRecipes).toFixed(1))
      : 0

  return {
    avgRating,
    totalMembers: 8400 + totalRecipes,
    totalRecipes,
  }
}

export async function getPortalDashboardData() {
  const recipes = await readRecipes()
  const totalUsers = await getTotalUsers()
  const newUsersThisMonth = await getNewUsersThisMonth()
  
  const totalRecipes = recipes.length
  const totalReviews = recipes.reduce((sum, r) => sum + r.reviews, 0)
  const avgRating = totalRecipes > 0 
    ? Number((recipes.reduce((sum, r) => sum + r.rating, 0) / totalRecipes).toFixed(1)) 
    : 0

  // Calculate monthly data (last 6 months)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()
  const last6Months = []
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12
    const monthName = months[monthIndex]
    const year = new Date().getFullYear() - (currentMonth - i < 0 ? 1 : 0)
    
    const monthlyRecipes = recipes.filter(r => {
      const date = new Date(r.createdAt)
      return date.getMonth() === monthIndex && date.getFullYear() === year
    }).length

    last6Months.push({
      month: monthName,
      recipes: monthlyRecipes,
      views: 12400 + (monthIndex * 800) // Deterministic placeholder
    })
  }

  return {
    stats: {
      totalRecipes,
      totalUsers,
      avgRating,
      totalReviews,
      newUsersThisMonth,
      monthlyVisits: 45200 // Placeholder
    },
    monthlyData: last6Months,
    recentRecipes: recipes.slice(0, 5)
  }
}


export async function getSiteCategories() {
  const stats = await getCategoryStats()
  return ["All", ...stats.map((category) => category.name)]
}

export async function addSiteCategory(name: string) {
  const col = await getCategoriesCollection()
  if (!col) return null
  const normalized = name.trim()
  if (!normalized) return null
  await col.updateOne({ name: normalized }, { $set: { name: normalized } }, { upsert: true })
  return { name: normalized }
}

export async function renameSiteCategory(oldName: string, newName: string) {
  const categoriesCol = await getCategoriesCollection()
  const recipesCol = await getRecipesCollection()
  if (!recipesCol) return null
  const from = oldName.trim()
  const to = newName.trim()
  if (!from || !to) return null
  if (categoriesCol) {
    await categoriesCol.updateOne({ name: from }, { $set: { name: to } })
    // remove any duplicate old entry
    await categoriesCol.deleteOne({ name: from })
    await categoriesCol.updateOne({ name: to }, { $set: { name: to } }, { upsert: true })
  }
  const res = await recipesCol.updateMany({ category: from }, { $set: { category: to } })
  return { matchedCount: res.matchedCount, modifiedCount: res.modifiedCount }
}

export async function deleteSiteCategory(name: string, replacement = 'All') {
  const categoriesCol = await getCategoriesCollection()
  const recipesCol = await getRecipesCollection()
  const target = name.trim()
  if (!target || !recipesCol) return null
  // Move recipes to replacement category
  await recipesCol.updateMany({ category: target }, { $set: { category: replacement } })
  if (categoriesCol) {
    await categoriesCol.deleteOne({ name: target })
  }
  return { deleted: true }
}

