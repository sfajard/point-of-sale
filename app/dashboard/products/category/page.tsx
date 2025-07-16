"use client"

import { addCategorySchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { addCategory } from "@/lib/action"
import { uploadImage } from "@/supabase/storage/client"
import Image from "next/image"

import React from 'react'

interface InitialCategoryValue {
    name: string;
    imageUrls?: string[]; // Diubah menjadi array of strings
    isFeatured?: boolean;
}

const CategoryFormPage = () => {
    const [loading, setLoading] = useState(false)

    const defaultFormValues: InitialCategoryValue = {
        name: '',
        imageUrls: [], // Nilai awal adalah array kosong
        isFeatured: false,
    }

    const form = useForm<z.infer<typeof addCategorySchema>>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: defaultFormValues,
    })

    // Memantau nilai 'imageUrls' dari form untuk tujuan preview
    const currentImageUrls = form.watch("imageUrls");

    const handleSubmit = async (values: z.infer<typeof addCategorySchema>) => {
        setLoading(true);
        try {
            // 'values' sekarang akan berisi 'name', 'imageUrls' (array URL), dan 'isFeatured'
            // Pastikan addCategory (server action Anda) siap menerima 'imageUrls' sebagai array of string
            await addCategory(values);
            form.reset(); // Reset form setelah sukses
        } catch (error) {
            console.error("Gagal menambahkan kategori:", error);
            // Tambahkan notifikasi toast di sini
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                        <div>
                            {/* Input untuk Nama Kategori */}
                            <FormField
                                disabled={loading}
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Nama Kategori</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama kategori.." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Input untuk Gambar Kategori (Multiple) */}
                            <FormField
                                disabled={loading}
                                control={form.control}
                                name="imageUrls" // Nama field ini sesuai dengan skema Zod
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Gambar Kategori</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple // <-- Tambahkan atribut multiple di sini
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files || []); // Dapatkan semua file yang dipilih
                                                    if (files.length > 0) {
                                                        setLoading(true);
                                                        const uploadedUrls: string[] = [];

                                                        // Iterasi dan unggah setiap file
                                                        for (const file of files) {
                                                            const { imageUrl, error } = await uploadImage({
                                                                file,
                                                                bucket: "dank-pics",
                                                            });

                                                            if (error) {
                                                                console.error("Error mengunggah gambar:", error);
                                                                // Lanjutkan atau hentikan sesuai kebutuhan Anda
                                                                continue; // Lanjutkan ke file berikutnya jika ada error pada satu file
                                                            }
                                                            if (imageUrl) {
                                                                uploadedUrls.push(imageUrl);
                                                            }
                                                        }

                                                        setLoading(false);

                                                        // Perbarui state form React Hook Form dengan URL gambar baru
                                                        // Gunakan callback untuk memastikan Anda bekerja dengan state terbaru
                                                        field.onChange([...(field.value || []), ...uploadedUrls]);
                                                        // Penting: Kosongkan input file agar bisa memilih file yang sama lagi
                                                        e.target.value = '';
                                                    }
                                                }}
                                            // value={undefined} // Tidak diperlukan lagi karena kita mengelola nilai input file secara manual
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Checkbox untuk Featured Category */}
                            <FormField
                                disabled={loading}
                                control={form.control}
                                name="isFeatured"
                                render={({ field }) => (
                                    <FormItem className="mb-4 flex items-center space-x-2">
                                        <FormControl>
                                            <input
                                                type="checkbox"
                                                id="isFeatured"
                                                checked={field.value}
                                                onChange={e => field.onChange(e.target.checked)}
                                                className="accent-primary w-5 h-5"
                                                disabled={loading}
                                            />
                                        </FormControl>
                                        <FormLabel htmlFor="isFeatured">Featured</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Area untuk pratinjau gambar yang diunggah */}
                            <div className="flex flex-wrap items-center gap-2 mb-4"> {/* Menggunakan flex-wrap dan gap */}
                                {currentImageUrls && currentImageUrls.map((url, index) => (
                                    <div key={url} className="relative"> {/* Tambahkan key untuk setiap item */}
                                        <Image
                                            src={url}
                                            alt={`Pratinjau Gambar ${index + 1}`}
                                            width={150} // Ukuran lebih kecil untuk banyak gambar
                                            height={150}
                                            className="object-cover rounded-lg shadow-md"
                                        />
                                        {/* Anda bisa menambahkan tombol hapus di sini */}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                                            onClick={() => {
                                                // Hapus gambar dari array saat tombol hapus diklik
                                                form.setValue("imageUrls", currentImageUrls.filter(item => item !== url));
                                            }}
                                            disabled={loading}
                                        >
                                            X
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Tombol Submit */}
                    <Button disabled={loading} type="submit" className="m-3">
                        {loading ? "Menambahkan..." : "Tambah Kategori"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CategoryFormPage