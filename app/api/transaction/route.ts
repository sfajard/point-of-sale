import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Snap } from 'midtrans-client';

const prisma = new PrismaClient();

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
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    const body = await request.json()

    const { userName, email, id: userId } = body

    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId: userId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ error: 'Cart not found or is empty' }, { status: 400 });
        }

        let grossAmount = 0;
        const itemDetails = cart.items.map(item => {
            const itemPrice = item.product.price;
            const itemQuantity = item.quantity;
            const subtotal = itemPrice * itemQuantity;
            grossAmount += subtotal;

            return {
                id: item.productId,
                price: itemPrice,
                quantity: itemQuantity,
                name: item.product.name
            };
        });

        const orderId = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const newTransaction = await prisma.transaction.create({
            data: {
                userId: userId,
                totalAmount: grossAmount,
                orderId: orderId,
                status: 'PENDING',
                transactionItems: {
                    create: cart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    }))
                }
            }
        });

        const snap = new Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY as string
        });

        const parameter = {
            transaction_details: {
                order_id: newTransaction.orderId,
                gross_amount: grossAmount
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: userName,
                email: email,
                customer_id: userId
            },
            item_details: itemDetails
        };

        const midtransTransaction = await snap.createTransaction(parameter)

        for (const item of cart.items) {
            await prisma.product.update({
                where: {
                    id: item.productId
                },
                data: {
                    sold: {
                        increment: item.quantity
                    },
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });
        await prisma.cart.delete({
            where: {
                id: cart.id
            }
        })

        return NextResponse.json({
            token: midtransTransaction.token,
            redirectUrl: midtransTransaction.redirect_url
        }, { status: 200 });

    } catch (error) {
        console.error('Error processing transaction:', error);
        return NextResponse.json({ error: 'Failed to process transaction' }, { status: 500 });
    }
};
