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
import { Category, Product } from "@prisma/client"
import axios from "axios"
import { capitalizeEachWord } from "@/lib/capitalized-word"
import { redirect } from "next/navigation"

export const ProductForm = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof addProductSchema>>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: '',
            price: 0,
            sku: '',
            stock: 0,
            categoryId: ''
        }
    })

    const addProduct = async (values: z.infer<typeof addProductSchema>) => {
        setLoading(true)

        const {name, price, sku, stock, categoryId} = values
        
        try {
            await axios.post<Product>('http://localhost:3000/api/product', {
                name, price, sku, stock, categoryId
            })

            setLoading(false)
            redirect('/dashboard/products')
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const fetchCategories = async () => {
        const response = await axios.get<Category[]>('http://localhost:3000/api/category')
        setCategories(response.data)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(addProduct)} className="space-y-8">
                <div className="flex gap-x-10">
                    <div className="w-full m-3">
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="product name.." {...field} />
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
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="product price.."
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
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="product stock.."
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="w-full m-3">
                        <FormField
                            disabled={loading}
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="product sku.." {...field} />
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
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih kategori" />
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
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button disabled={loading} type="submit" className="m-3">Submit</Button>
            </form>
        </Form>
    )
}