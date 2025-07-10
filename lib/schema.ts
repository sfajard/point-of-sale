import * as z from "zod"

export const addProductSchema = z.object({
    name: z.string().min(2, { message: 'Product name must be at least 2 characters' })
        .max(20, { message: 'Product name must be less than 20 characters' }),
    price: z.number().min(1),
    stock: z.number().min(1),
    sku: z.string().min(1),
    categoryId: z.string().min(1)
})

export const addCategorySchema = z.object({
    name: z.string().min(2).max(20)
})