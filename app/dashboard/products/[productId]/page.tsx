'use client'

import { ProductForm } from '@/components/create-form'
import { Button } from '@/components/ui/button'
import { Product } from '@prisma/client'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface InitialProductValues {
    name: string
    price: number
    stock: number
    sku: string
    categoryId: string
}

const page = () => {
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const params = useParams()
    const productId = params.productId as string
    console.log(productId)

    const fetchProduct = async () => {
        try {
            setLoading(true)
            const response = await axios.get<Product>(`http://localhost:3000/api/product/${productId}`)
            console.log(productId)
            setProduct(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProduct()
        console.log(product)
    }, [])

    if (loading) {
        return <div className="p-4">Loading product details...</div>
    }

    if (!product) {
        return <div className="p-4">Product not found.</div>
    }

    const initialProductValue: InitialProductValues = {
        name: product.name,
        price: product.price,
        stock: product.stock,
        sku: product.sku,
        categoryId: product.categoryId
    }

    return (
        <div>
            <div className='flex justify-between'>
                <h1 className="text-xl font-bold mb-4">Add Product</h1>
                <Button variant={'secondary'} className='cursor-pointer'>
                    <Link className='flex align-middle items-center' href={'/dashboard/products'}><ArrowLeft /> Product List</Link>
                </Button>
            </div>
            <ProductForm initialProductValue={initialProductValue} action='update' productId={productId}  />
        </div>
    )
}

export default page