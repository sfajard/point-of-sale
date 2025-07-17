import { Category, Product } from "@prisma/client";
import { addCategorySchema, addProductSchema } from "./schema"
import * as z from "zod"
import axios from "axios";
import { convertBlobUrlToFile } from "./utils";
import { uploadImage } from "@/supabase/storage/client";

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

export const getProductById = async (productId: string) => {
    try {
        const response = await axios.get(`${ProductUrl}/${productId}`)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const addProduct = async (values: z.infer<typeof addProductSchema>) => {
    try {
        await axios.post<Product>(ProductUrl, values)
        console.log('test')
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

export const inputImage = async (imageUrls: string[]) => {
    let urls: string[] = []
    try {
        imageUrls.forEach(async (url: string) => {
            const imageFile = await convertBlobUrlToFile(url)
            const { imageUrl, error } = await uploadImage({
                file: imageFile,
                bucket: 'pos'
            })

            urls.push(imageUrl)
        })

        return urls
    } catch (error) {
        console.error('Error uploading images:', error)
        return []
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

export const checkout = async (productId: string) => {
    if (!productId) return console.log('Product id required')
    try {
        const product = await prisma?.product.findUnique({
            where: {id: productId}
        })
    } catch (error) {
        console.log(error)
    }
}

// Category action
const categoryUrl = 'http://localhost:3000/api/category'

export const getAllCategoties = async () => {
    try {
        const response = await axios.get(categoryUrl)
        return response.data
    } catch (error) {
        console.error('Error fetching category:', error)
    }
}

export const addCategory = async (values: z.infer<typeof addCategorySchema>) => {
    try {
        await axios.post<Category>(categoryUrl, values)
    } catch (error) {
        console.error('Error adding category:', error)
    }
}