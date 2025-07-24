import * as z from "zod"

export const addProductSchema = z.object({
    name: z.string().min(2, { message: 'Product name must be at least 2 characters' })
        .max(50, { message: 'Product name must be less than 20 characters' }),
    price: z.number().min(1),
    stock: z.number().min(1),
    categoryId: z.string().min(1),
    image: z.instanceof(File).refine(file => file.size > 0, {
        message: 'Image is required',
    })
        .refine(file => file.type.startsWith('image/'), {}).refine(file => file.size <= 5 * 1024 * 1024, {
            message: 'Image size must be less than 5MB',
        })
        .refine(file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type), {
            message: 'Image must be a JPEG, PNG, or GIF',
        }).optional(),

    imageUrls: z.array(z.string().url("URL gambar tidak valid.")).optional(),
    isFeatured: z.boolean()
})

export const addCategorySchema = z.object({
    name: z.string().min(2).max(20)
        .refine(name => /^[a-zA-Z0-9\s]+$/.test(name), {
            message: 'Category name can only contain letters, numbers, and spaces',
        }),
    image: z.instanceof(File).refine(file => file.size > 0, {
        message: 'Image is required',
    })
        .refine(file => file.type.startsWith('image/'), {}).refine(file => file.size <= 5 * 1024 * 1024, {
            message: 'Image size must be less than 5MB',
        })
        .refine(file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type), {
            message: 'Image must be a JPEG, PNG, or GIF',
        }).optional(),

    imageUrls: z.array(z.string().url("URL gambar tidak valid.")).optional(),
    isFeatured: z.boolean()
})