import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

interface Params {
    params: { id: string }
}

export const DELETE = async (req: Request, { params }: Params): Promise<NextResponse> => {
    try {
        const { id } = params;

        const transaction = await prisma.transaction.delete({
            where: { id },
        })
        if (!transaction) {
            return NextResponse.json({ error: "product not found" }, { status: 404 })
        }

        return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}