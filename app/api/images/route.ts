// src/app/api/image/create/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const POST = async (): Promise<NextResponse> => {
  try {
    const image = await prisma.image.create({
      data: {
        url: "", // kosong dulu
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    console.error("Create image error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

