import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
    params: { id: string };
}

export const GET = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = params;
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }
        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
};

export const PUT = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const { id } = await params
        const { name, sku, price, stock, category, } = body
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }
        if (!name || !sku || price == null || stock == null || !category) {
            return NextResponse.json({ error: "all fields required" }, { status: 400 })
        }
        const response = await prisma.product.update({
            where: { id },
            data: {
                name, sku, price, stock, category
            }
        })
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}

export const DELETE = async ({ params }: Params): Promise<NextResponse> => {
    try {
        const { id } = params;
        const product = await prisma.product.delete({
            where: { id },
        });
        if (!product) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}