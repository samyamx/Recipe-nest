import { NextResponse } from "next/server"
import { createSession, signUpUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      name?: string
      password?: string
    }

    if (!body.name?.trim() || !body.email?.trim() || !body.password?.trim()) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 })
    }

    if (body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 })
    }

    const user = await signUpUser({
      email: body.email,
      name: body.name,
      password: body.password,
    })

    await createSession(user.id)
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account."
    const status =
      message === "Database is unavailable."
        ? 503
        : message === "An account with this email already exists."
        ? 409
        : 400

    return NextResponse.json({ error: message }, { status })
  }
}
