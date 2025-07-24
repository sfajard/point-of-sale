'use server'

import { prisma } from "@/lib/prisma"
import * as z from 'zod'
import { addCategorySchema } from "../schema"
import { deleteOrphanImages } from "./image"

export const getAllCategoties = async () => {
    try {
        const response = await prisma.category.findMany()
        return response
    } catch (error) {
        console.error('Error fetching category:', error)
    }
}

export const createCategory = async (values: z.infer<typeof addCategorySchema>, imageIds: string[]) => {
    try {
        const { name, isFeatured } = values

        const newCategory = await prisma.category.create(
            {
                data: {
                    name, isFeatured
                }
            }
        )

        await prisma.image.updateMany({
            where: {
                id: {
                    in: imageIds
                }
            },
            data: {
                productId: newCategory.id
            }
        })

        deleteOrphanImages()
    } catch (error) {
        console.error('Error adding category:', error)
    }
}