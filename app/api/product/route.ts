import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export const GET = async (): Promise<NextResponse> => {
    try {
        const response = await prisma.product.findMany({
            include: { category: true}
        })
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "error fetching data" }, { status: 500 })
    }
}

export const POST = async (request: Request): Promise<NextResponse> => {
    try {
        const body = await request.json();
        const { name, sku, price, stock, categoryId, imageUrl } = body;

        if (!name || !sku || !price || !stock || !categoryId || !imageUrl) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                sku,
                price,
                stock,
                categoryId,
                imageUrl
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}