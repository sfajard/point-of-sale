import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

const generateSku = (productName: string, categoryId: string): string => {
    const namePart = productName.substring(0, 3).toUpperCase()
    const categoryPart = categoryId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()


    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()

    return `${namePart}-${categoryPart}-${randomPart}`
}

export const GET = async (): Promise<NextResponse> => {
    try {
        const response = await prisma.product.findMany({
            include: { category: true }
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
        const { name, price, stock, categoryId, imageUrls } = body;

        if (!name || !price || !stock || !categoryId || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }
        const sku = generateSku(name, categoryId);
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                categoryId,
                imageUrls,
                sku
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}