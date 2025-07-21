'use server'

import { prisma } from '@/lib/prisma'
import { deleteImage } from '@/supabase/storage/client'

export const createImage = async (imageUrl: string): Promise<{ id: string } | null> => {
    try {
        const response = await prisma.image.create({
            data: {
                url: imageUrl
            }
        })

        return { id: response.id }
    } catch (error) {
        console.error("Failed to create image:", error)
        return null
    }
}

export const deleteOrphanImages = async () => {
    try {

        const orphanImages = await prisma.image.findMany({
            where: {
                productId: null,
                categoryId: null,
            }
        });

        for (const image of orphanImages) {
            const { error } = await deleteImage(image.url);
            if (error) {
                console.warn(`Gagal menghapus image di storage: ${image.url}`);
            }
        }

        await prisma.image.deleteMany({
            where: {
                id: {
                    in: orphanImages.map((img) => img.id),
                },
            },
        });

        return console.log({
            success: true,
            deletedCount: orphanImages.length,
            deletedImageIds: orphanImages.map((img) => img.id)
        }, { status: 200 })

    } catch (error) {
        console.error("Gagal membersihkan orphan images:", error);
    }
}