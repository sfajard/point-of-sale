'use server'

import { prisma } from "@/lib/prisma"
import * as z from 'zod'
import { addCategorySchema } from "../schema"

export const getAllCategoties = async () => {
    try {
        const response = await prisma.category.findMany()
        return response
    } catch (error) {
        console.error('Error fetching category:', error)
    }
}

export const createCategory = async (values: z.infer<typeof addCategorySchema>) => {
    try {
        const { name, isFeatured, imageUrls } = values

        const newCategory = await prisma.category.create(
            {
                data: {
                    name, isFeatured
                }
            }
        )

        await prisma.image.createMany({
            data: imageUrls.map((url: string) => ({
                url,
                categoryId: newCategory.id
            }))
        })
    } catch (error) {
        console.error('Error adding category:', error)
    }
}