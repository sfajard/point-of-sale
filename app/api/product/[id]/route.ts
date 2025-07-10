import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
    params: { id: string }
}

export const GET = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
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
        const { id } = await params
        const { name, sku, price, stock, categoryId, discount } = body
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }

        if (!name || !sku || typeof price !== 'number' || typeof stock !== 'number' || !categoryId) {
            return NextResponse.json({ error: "Name, SKU, price, stock, and category are required" }, { status: 400 });
        }

        const response = await prisma.product.update({
            where: { id },
            data: {
                name, sku, price, stock, discount,
                categoryId
            }
        })
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}

export const DELETE = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = await params;

        console.log(id)
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