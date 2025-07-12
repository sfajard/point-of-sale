const prisma = new PrismaClient()
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const GET = async () => {
    try {
        const response = await prisma.transaction.findMany({
            include: {
                transactionItems: {
                    include: {
                        product: true
                    }
                }
            }
        })
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json()
        const { totalAmount, transactionItems } = body

        if (!totalAmount || !transactionItems || transactionItems.length === 0) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
        }

        console.log('Creating transaction with data:', body)

        const newTransaction = await prisma.transaction.create({
            data: {
                totalAmount,
                transactionItems: {
                    create: transactionItems.map((item: { productId: string; quantity: number }) => ({
                        quantity: item.quantity,
                        product: { connect: { id: item.productId } }
                    }))
                }
            }
        })

        return NextResponse.json(newTransaction, { status: 201 })
    } catch (error) {
        console.error('Error creating transaction:', error)
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }
}
