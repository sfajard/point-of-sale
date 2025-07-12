import axios from 'axios'
export const getAllTransaction = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/transaction')
        return response.data
    } catch (error) {
        console.error('Error fetching transactions:', error)
    }
}

export const createTransaction = async (transactionData: {
    totalAmount: number,
    transactionItems: { productId: string, quantity: number }[]
}) => {
    try {
        await Promise.all(
            transactionData.transactionItems.map(async (item) => {
                const productResponse = await axios.get(`http://localhost:3000/api/product/${item.productId}`);
                const currentStock = productResponse.data.stock;

                return axios.put(`http://localhost:3000/api/product/${item.productId}`, {
                    stock: currentStock - item.quantity
                });
            })
        );


        const response = await axios.post('http://localhost:3000/api/transaction', transactionData);
        return response.data;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}