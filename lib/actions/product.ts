'use server'

import { prisma } from "@/lib/prisma"
import * as z from 'zod'
import { addProductSchema } from "../schema"
import { deleteOrphanImages } from "./image"

const generateSku = (productName: string, categoryId: string): string => {
    const namePart = productName.substring(0, 3).toUpperCase()
    const categoryPart = categoryId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()


    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()

    return `${namePart}-${categoryPart}-${randomPart}`
}

export const getAllProduct = async () => {
    try {
        const response = await prisma.product.findMany({
            include: { category: true, imageUrls: true }
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (productId: string) => {
    try {
        const response = await prisma.product.findUnique(
            {
                where: {
                    id: productId
                },
                include: {
                    imageUrls: true,
                    category: true
                }
            }
        )
        return response ?? null
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (values: z.infer<typeof addProductSchema>, imageIds: string[]) => {
    try {
        const { name, price, stock, isFeatured, categoryId } = values

        const sku = generateSku(name, categoryId);
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                stock,
                categoryId,
                sku,
                isFeatured
            }
        })

        await prisma.image.updateMany({
            where: {
                id: {
                    in: imageIds
                }
            },
            data: {
                productId: newProduct.id
            }
        })
    } catch (error) {
        console.error('Error adding product:', error)
    }
}

export const deleteProduct = async (productId: string) => {
    try {
        if (!productId) return console.log('Product id required')
        await prisma.image.deleteMany({
            where: {
                productId
            }
        })

        await prisma.product.delete({
            where: {
                id: productId
            }
        })

        await prisma.image.deleteMany({
            where: {
                productId: productId
            }
        })

        await deleteOrphanImages()

    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (values: z.infer<typeof addProductSchema>, productId: string, imageIds: string[]) => {
    try {
        const { name, price, stock, categoryId, imageUrls, isFeatured } = values
        const product = await getProductById(productId)

        if (!product) return console.error('Product not found')

        if (!isFeatured || !name || !price || !stock || !categoryId || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return console.error('Input not valid')
        }

        const sku = generateSku(name, categoryId)

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name, sku, price, stock, categoryId, isFeatured
            }
        })

        await prisma.image.updateMany({
            where: {
                id: {
                    in: imageIds
                }
            },
            data: {
                productId: updatedProduct.id
            }
        })

        await deleteOrphanImages()

    } catch (error) {
        console.error(error)
    }
}

export const getSearchedProducts = async (params: string) => {
    const products = await getAllProduct()

    const productList = products || []

    const filteredProducts = productList.filter(product => {
        return product.name.toLowerCase().startsWith(params.toLowerCase())
    });

    return filteredProducts
}