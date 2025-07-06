import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (): Promise<NextResponse> => {
    try {
        const response = await prisma.product.findMany()
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "error fetching data" }, { status: 500 })
    }
}

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const { name, sku, price, stock, category, discount } = body
        if (!name || !sku || price == null || stock == null || !category || !discount) {
            return NextResponse.json({ error: "all fields required" }, { status: 400 })
        }
        
        const connectCategories = category.map((id: string) => ({id}))

        const response = await prisma.product.create({
            data: {
                name, sku, price, stock: stock, discount,
                category: {
                    connect: connectCategories
                }
            }
        })
        return NextResponse.json(response, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: "innternal server error" }, { status: 500 })
    }
}