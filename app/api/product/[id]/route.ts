import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
    params: { id: string }
}

const generateSku = (productName: string, categoryId: string): string => {
    const namePart = productName.substring(0, 3).toUpperCase()
    const categoryPart = categoryId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()


    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()

    return `${namePart}-${categoryPart}-${randomPart}`
}

export const GET = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true, imageUrls: true }
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }
        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}

export const PUT = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const body = await req.json()
        console.log('Updating product with body:', body)
        const { id } = await params
        const { name, price, stock, categoryId, imageUrls, isFeatured } = body
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }

        if (!isFeatured || !name || !price || !stock || !categoryId || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const sku = generateSku(name, categoryId)

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name, sku, price, stock,
                categoryId, isFeatured
            }
        })

        await prisma.image.createMany({
            data: imageUrls.map((url: string) => ({
                url,
                productId: updatedProduct.id
            }))
        })
        return NextResponse.json(updatedProduct, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}

export const DELETE = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = await params;

        await prisma.image.deleteMany({
            where: {
                productId: id
            }
        })

        const product = await prisma.product.delete({
            where: { id },
        })
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }

        console.log(product)
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}