import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/supabase/storage/client";

export const DELETE = async (): Promise<Response> => {
  try {
    // 1. Ambil semua image orphan yang lebih tua dari 10 menit
    const orphanImages = await prisma.image.findMany({
      where: {
        productId: null,
        categoryId: null,
      }
    })

    // 2. Hapus dari Supabase Storage
    for (const image of orphanImages) {
      const { error } = await deleteImage(image.url);
      if (error) {
        console.warn(`Gagal menghapus image di storage: ${image.url}`);
      }
    }

    // 3. Hapus dari database
    await prisma.image.deleteMany({
      where: {
        id: {
          in: orphanImages.map((img) => img.id),
        },
      },
    });

    return new Response(JSON.stringify({ success: true, deleted: orphanImages.length }), {
      status: 200,
    });
  } catch (error) {
    console.error("Gagal membersihkan orphan images:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
