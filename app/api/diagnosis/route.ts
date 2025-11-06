import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { patientId, description, notes, images } = await request.json()

    if (!patientId || !description) {
      return NextResponse.json({ error: "Patient ID and description are required" }, { status: 400 })
    }

    const diagnosis = await prisma.diagnosis.create({
      data: {
        patientId,
        description,
        notes: notes || "",
        images: images || [],
      },
    })

    return NextResponse.json(diagnosis)
  } catch (error) {
    console.error("Error creating diagnosis:", error)
    return NextResponse.json({ error: "Error creating diagnosis" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return NextResponse.json({ error: "Patient ID is required" }, { status: 400 })
    }

    const diagnoses = await prisma.diagnosis.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: {
            name: true,
            age: true,
          },
        },
      },
    })

    return NextResponse.json(diagnoses)
  } catch (error) {
    console.error("Error fetching diagnoses:", error)
    return NextResponse.json({ error: "Error fetching diagnoses" }, { status: 500 })
  }
}
