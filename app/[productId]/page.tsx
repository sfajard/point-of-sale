'use client'

import { ProductCarousel } from '@/components/product/product-carousel'
import { Button } from '@/components/ui/button'
import { getProductById } from '@/lib/actions/product'
import { formatIDR } from '@/lib/utils'
import { redirect, useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { addToCart } from '@/lib/actions/cart'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface ProductWithImages {
    id: string;
    name: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrls: { url: string }[]
}


const Page = () => {
    const params = useParams()
    const productId = params.productId as string

    const [product, setProduct] = useState<ProductWithImages | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { data: session } = useSession()
    const userId = session?.user?.id

    const fetchProduct = async () => {
        setLoading(true)
        try {
            const response = await getProductById(productId)
            if (response) {
                setProduct(response)
            } else {
                setProduct(null)
            }
        } catch (error) {
            console.error("Failed to fetch product:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (productId) {
            fetchProduct()
        }
    }, [productId])

    if (loading) {
        return <p className="p-4">Loading product...</p>
    }

    if (!product) {
        return <p className="p-4 text-red-500">Product not found.</p>
    }

    return (
        <div className='m-10 flex'>
            <ProductCarousel imageUrls={product.imageUrls} />
            <div className='mx-5 flex flex-col ml-20 max-w-100'>
                <span className='text-2xl font-bold my-1'>{product.name}</span>
                <span className='text-xl my-1'>Rp. {formatIDR(product.price)}</span>
                <p className='text-xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, maiores doloribus. In recusandae, culpa rerum nobis voluptates dolore perspiciatis id maxime at iusto doloribus, laborum, minima nihil unde esse sunt similique eius quaerat ipsam. Nulla accusamus iste consectetur quas autem?</p>
                <Button
                    onClick={() => {
                        if (userId) {
                            addToCart(userId, product.id)
                            toast.success('Product added to cart')
                        } else {
                            redirect('/signin')
                        }
                    }}
                    className='my-auto max-w-35'
                >
                    Add to cart
                </Button>
            </div>
        </div>
    )
}

export default Page
