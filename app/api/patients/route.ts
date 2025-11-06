import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const doctorId = searchParams.get("doctorId")

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    const patients = await prisma.patient.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error("Error fetching patients:", error)
    return NextResponse.json({ error: "Error fetching patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const patient = await prisma.patient.create({
      data: {
        name: data.name,
        age: data.age,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        address: data.address,
        medicalHistory: data.medicalHistory,
        doctorId: data.doctorId,
      },
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Error creating patient" }, { status: 500 })
  }
}
