import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (): Promise<NextResponse> => {
    try {
        const response = await prisma.product.findMany({
            include: {category: true}
        })
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "error fetching data" }, { status: 500 })
    }
}

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const { name, sku, price, stock, categoryId, discount } = body

        console.log(body)
        if (!name || !sku || price == null || stock == null || !categoryId) {
            return NextResponse.json({ error: "all fields required" }, { status: 400 })
        }

        


        const response = await prisma.product.create({
            data: {
                name, sku, price, stock: stock, discount,
                category: {
                    connect: { id: categoryId}
                }
            }
        })
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "innternal server error" }, { status: 500 })
    }
}