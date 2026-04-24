import { NextResponse } from "next/server"
import { getCurrentUser, updateCurrentUserProfile } from "@/lib/auth"

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const body = (await request.json()) as {
      bio?: string
      location?: string
      name?: string
    }

    const user = await updateCurrentUserProfile({
      bio: body.bio || "",
      location: body.location || "",
      name: body.name || "",
      userId: currentUser.id,
    })

    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
