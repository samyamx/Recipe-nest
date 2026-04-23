import { NextResponse } from "next/server"
import { createSession, signInUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
    }

    if (!body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const user = await signInUser({
      email: body.email,
      password: body.password,
    })

    await createSession(user.id)
    return NextResponse.json({ user })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in."
    const status =
      message === "Database is unavailable."
        ? 503
        : message === "Invalid email or password."
        ? 401
        : 400

    return NextResponse.json({ error: message }, { status })
  }
}
