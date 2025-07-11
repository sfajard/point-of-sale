import { Category, Product } from "@prisma/client";
import { addCategorySchema, addProductSchema } from "./schema"
import * as z from "zod"
import axios from "axios";

// Product action
const ProductUrl = 'http://localhost:3000/api/product'

export const getAllProduct = async () => {
    try {
        const response = await axios.get(ProductUrl)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const addProduct = async (values: z.infer<typeof addProductSchema>) => {
    try {
        await axios.post<Product>(ProductUrl, values)
    } catch (error) {
        console.error('Error adding product:', error)
    }
}

export const updateProduct = async (values: z.infer<typeof addProductSchema>, productId: string) => {
    try {
        await axios.put<Product>(`${ProductUrl}/${productId}`, values)
    } catch (error) {
        console.error('Error updating product:', error)
    }
}

export const deleteProduct = async (productId: string) => {
    if (!productId) return console.log('Product id required')
    try {
        await axios.delete<Product>(`http://localhost:3000/api/product/${productId}`)
    } catch (error) {
        console.error('Error deleting product:', error)
    }
}

// Category action
const categoryUrl = 'http://localhost:3000/api/category'

export const addCategory = async (values: z.infer<typeof addCategorySchema>) => {
    try {
        await axios.post<Category>(categoryUrl, values)
    } catch (error) {
        console.error('Error adding category:', error)
    }
}

// Transaction action