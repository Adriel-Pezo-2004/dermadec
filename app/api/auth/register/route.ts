import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Register error:", error)

    if (error.code === "P2002") {
      return NextResponse.json({ error: "Este correo ya está registrado" }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 })
  }
}
