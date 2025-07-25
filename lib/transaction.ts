import axios from 'axios'
import { prisma } from './prisma';
export const getAllTransaction = async () => {
    try {
        const response = await prisma.transaction.findMany({
            include: {
                transactionItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });
        return response
    } catch (error) {
        console.error('Error fetching transactions:', error)
        return []
    }
}

export const createTransaction = async (transactionData: {
    totalAmount: number,
    transactionItems: { productId: string, quantity: number }[]
}) => {
    try {
        await Promise.all(
            transactionData.transactionItems.map(async (item) => {
                const productResponse = await axios.get(`/api/product/${item.productId}`);
                const currentStock = productResponse.data.stock;

                return axios.put(`/api/product/${item.productId}`, {
                    stock: currentStock - item.quantity
                });
            })
        );


        const response = await axios.post('/api/transaction', transactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}