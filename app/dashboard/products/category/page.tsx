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
import { createCategory } from "@/lib/actions/category"
import { deleteOrphanImages } from "@/lib/actions/image"
import { uploadImage } from "@/supabase/storage/client"
import Image from "next/image"

import React from 'react'

interface InitialCategoryValue {
    name: string;
    imageUrls?: string[];
    isFeatured?: boolean;
}

const CategoryFormPage = () => {
    const [loading, setLoading] = useState(false)
    const [imageUrls, setImageUrls] = useState<string[]>([])
      const [imageIds, setImageIds] = useState<string[]>([])

    const defaultFormValues: InitialCategoryValue = {
        name: '',
        imageUrls: [],
        isFeatured: false,
    }

    const form = useForm<z.infer<typeof addCategorySchema>>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: defaultFormValues,
    })

    const currentImageUrls = form.watch("imageUrls");

    const handleSubmit = async (values: z.infer<typeof addCategorySchema>) => {
        setLoading(true);
        try {
            await createCategory(values, imageIds);
            form.reset();
        } catch (error) {
            console.error("Gagal menambahkan kategori:", error);
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

                            <FormField
                                disabled={loading}
                                control={form.control}
                                name="imageUrls"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormLabel>Gambar Kategori</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={async (e) => {
                                                    const files = Array.from(e.target.files || [])
                                                    if (files.length === 0) return

                                                    setLoading(true)
                                                    const uploadedUrls: string[] = []

                                                    for (const file of files) {
                                                        const { imageUrl, error, imageId } = await uploadImage({
                                                            file,
                                                            bucket: "dank-pics",
                                                        })

                                                        if (error) {
                                                            console.error("Upload error:", error)
                                                            continue
                                                        }

                                                        if (imageUrl) {
                                                            uploadedUrls.push(imageUrl)
                                                        }

                                                        if (imageId) {
                                                            setImageIds([...imageIds, imageId.id])
                                                        }

                                                    }

                                                    setLoading(false)

                                                    const newUrls = [...(field.value || []), ...uploadedUrls]
                                                    field.onChange(newUrls)
                                                    setImageUrls(newUrls)
                                                    e.target.value = ""
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {currentImageUrls && currentImageUrls.map((url, index) => (
                                    <div key={url} className="relative">
                                        <Image
                                            src={url}
                                            alt={`Pratinjau Gambar ${index + 1}`}
                                            width={150}
                                            height={150}
                                            className="object-cover rounded-lg shadow-md"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                                            onClick={() => {
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