"use client"

import { addProductSchema } from "@/lib/schema"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect, useState } from "react"
import { Category, Product } from "@prisma/client" // Assuming Product and Category types from Prisma
import axios from "axios"
import { capitalizeEachWord } from "@/lib/capitalized-word" // Utility function
import { AddCategoryDialog } from "./add-category"
import { addProduct, inputImage, updateProduct } from "@/lib/action"
import { uploadImage } from "@/supabase/storage/client"
import { convertBlobUrlToFile } from "@/lib/utils"

interface ProductFormProps {
    initialProductValue?: InitialProductValues; // Optional, useful for 'add'
    action: 'add' | 'update';
    productId?: string; // Required for 'update' action
    onSuccess?: () => void; // Callback after successful submission
}

interface InitialProductValues {
    name: string
    price: number
    sku: string
    stock: number
    categoryId: string
    discount?: number | null
}

export const ProductForm = ({ initialProductValue, action, productId, onSuccess }: ProductFormProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const defaultFormValues: InitialProductValues = {
        name: initialProductValue?.name || '',
        price: initialProductValue?.price || 0,
        sku: initialProductValue?.sku || '',
        stock: initialProductValue?.stock || 0,
        categoryId: initialProductValue?.categoryId || '',
        discount: initialProductValue?.discount || null,
    };

    const form = useForm<z.infer<typeof addProductSchema>>({
        resolver: zodResolver(addProductSchema),
        defaultValues: defaultFormValues,
    })

    useEffect(() => {
        if (initialProductValue) {
            form.reset(initialProductValue)
        }
    }, [initialProductValue, form])

    const handleSubmit = async (values: z.infer<typeof addProductSchema>) => {
        if (action === 'update') {
            setLoading(true)
            if (!productId) {
                return console.error('Product ID is required for update operation.')
            }
            await updateProduct(values, productId);
            setLoading(false)
            form.reset()
        } else { // action === 'add'
            setLoading(true)
            let urls = [];
            const imageFile = form.getValues('image');
            if (imageFile) {
                const { imageUrl, error } = await uploadImage({
                    file: imageFile,
                    bucket: "dank-pics",
                });
                if (error) {
                    console.error(error);
                    setLoading(false);
                    return;
                }
                urls.push(imageUrl);
                console.log('Image uploaded:', imageUrl);
            }
            console.log(urls);
            setLoading(false)
            form.reset()
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get<Category[]>('http://localhost:3000/api/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10"> {/* Using grid for better responsiveness */}
                    <div>
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product name.." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Product price.."
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Product stock.."
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product SKU.." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="mb-4 flex align-middle items-center">
                                    <div>
                                        <FormLabel className="my-3">Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {capitalizeEachWord(category.name)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <AddCategoryDialog onSuccess={fetchCategories} />
                        {/*<FormField
                            disabled={loading}
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="m-3">
                    {action === 'update' ? 'Update Product' : 'Add Product'}
                </Button>
            </form>
        </Form>
    );
};