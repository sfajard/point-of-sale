import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const POST = async (req: Request): Promise<NextResponse> => {
    try {
        const body = await req.json()
        const {productId} = body

        const response = await prisma.cart.create({
            data: {
                products: {
                    connect: productId
                }
            }
        })

        return NextResponse.json(response, {status: 201})
    } catch (error) {
        return NextResponse.json(error, {status: 500})
    }
}