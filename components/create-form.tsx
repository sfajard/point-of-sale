"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import Image from "next/image"
import { z } from "zod"

import { addProductSchema } from "@/lib/schema"
import { capitalizeEachWord } from "@/lib/capitalized-word"
import { uploadImage } from "@/supabase/storage/client"
import { addProduct, updateProduct } from "@/lib/action"
import { Category } from "@prisma/client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddCategoryDialog } from "./product/add-category"

interface ProductFormProps {
  initialProductValue?: InitialProductValues
  action: "add" | "update"
  productId?: string
  onSuccess?: () => void
}

interface InitialProductValues {
  name: string
  price: number
  sku: string
  stock: number
  categoryId: string
  discount?: number | null
  image?: File | undefined
  imageUrls?: string[] // optional, for update form
}

export const ProductForm = ({
  initialProductValue,
  action,
  productId,
  onSuccess,
}: ProductFormProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialProductValue?.imageUrls || []
  )

  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: initialProductValue?.name || "",
      price: initialProductValue?.price || 0,
      sku: initialProductValue?.sku || "",
      stock: initialProductValue?.stock || 0,
      categoryId: initialProductValue?.categoryId || "",
      imageUrls: initialProductValue?.imageUrls || [],
    },
  })

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        "http://localhost:3000/api/category"
      )
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (initialProductValue) {
      form.reset(initialProductValue)
    }
  }, [initialProductValue, form])

  const handleSubmit = async (values: z.infer<typeof addProductSchema>) => {
    setLoading(true)
    console.log('here')
    try {
      if (action === "update") {
        if (!productId) {
          throw new Error("Product ID is required for update operation.")
        }
        await updateProduct(values, productId)
      } else {
        await addProduct(values)
      }

      form.reset()
      setImageUrls([])
      onSuccess?.()
    } catch (error) {
      console.error("Gagal menyimpan produk:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {/* KIRI */}
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
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* KANAN */}
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
                <FormItem className="mb-4">
                  <FormLabel>Category</FormLabel>
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
                </FormItem>
              )}
            />
            <FormField
              disabled={loading}
              control={form.control}
              name="imageUrls"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Product Images</FormLabel>
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
                          const { imageUrl, error } = await uploadImage({
                            file,
                            bucket: "dank-pics",
                          })

                          if (error) {
                            console.error("Upload error:", error)
                            continue
                          }

                          if (imageUrl) uploadedUrls.push(imageUrl)
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

            {/* Preview image (hanya pertama untuk contoh) */}
            {imageUrls[0] && (
              <div className="mt-4">
                <Image
                  src={imageUrls[0]}
                  alt="Product"
                  width={200}
                  height={200}
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
        <Button onClick={() => console.log('click')} disabled={loading} type="submit" className="m-3 crusor-pointer">
          Add Product
        </Button>
      </form>
    </Form>
  )
}
