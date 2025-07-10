import { Category, Product } from "@prisma/client";
import { addCategorySchema, addProductSchema } from "./schema"
import * as z from "zod"
import axios from "axios";

// Product action
export const addProduct = async (values: z.infer<typeof addProductSchema>) => {
    try {
        await axios.post<Product>('http://localhost:3000/api/product', values)
    } catch (error) {
        console.error('Error adding product:', error)
    }
}

export const updateProduct = async (values: z.infer<typeof addProductSchema>, productId: string) => {
    try {
        await axios.put<Product>(`http://localhost:3000/api/product/${productId}`, values)
    } catch (error) {
        console.error('Error updating product:', error)
    }
}

export const deleteProduct = async (productId: string) => {
    if (!productId) return console.log(error)
    try {
        await axios.delete<Product>(`http://localhost:3000/api/product/${productId}`)
    } catch (error) {
        console.error('Error deleting product:', error)
    }
}

// Category action
export const addCategory = async (values: z.infer<typeof addCategorySchema>) => {
    try {
        await axios.post<Category>('http://localhost:3000/api/category', values)
    } catch (error) {
        console.error('Error adding category:', error)
    }
}