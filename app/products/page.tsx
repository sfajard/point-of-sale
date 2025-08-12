'use client'

import ProductCards from '@/components/home/product-cards'
import { getSearchedProducts } from '@/lib/actions/product'
import { Product } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ProductWithImages extends Product {
    imageUrls: { url: string }[]
}

const Page = () => {
    const [products, setProducts] = useState<ProductWithImages[]>([])
    const searchParams = useSearchParams()
    const search = searchParams.get('search')

    console.log(search)

    const fetchProducts = async () => {
        try {
            if (search) {
                const response = await getSearchedProducts(search)
                if (response) {
                    setProducts(response)
                } else {
                    setProducts([])
                }
            }
        } catch (error) {
            throw new Error('Failed to fetch products: ' + error)
        }
    }

    console.log(products)

    useEffect(() => {
        fetchProducts()
    }, [])
    return (
        <ProductCards products={products} selectedField=''/>
    )
}

export default Page