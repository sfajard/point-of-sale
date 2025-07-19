import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (): Promise<NextResponse> => {
    try {
        const response = await prisma.category.findMany()
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "error fetching data" }, { status: 500 })
    }
}

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const { name, isFeatured, imageUrls } = body
        if (!name || !imageUrls) {
            return NextResponse.json({ error: "all fields required" }, { status: 400 })
        }

        const newCategory = await prisma.category.create({
            data: {
                name, isFeatured
            }
        })

        await prisma.image.createMany({
            data: imageUrls.map((url: string) => ({
                url,
                categoryId: newCategory.id
            }))
        })
        
        return NextResponse.json(newCategory, { status: 201 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "innternal server error" }, { status: 500 })
    }
}