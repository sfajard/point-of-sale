'use client'

import CashierCart from '@/components/transaction/cashier-cart'
import { ProductCards, ProductCardSkeleton } from '@/components/transaction/product-cards'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAllProduct } from '@/lib/action'
import { Product } from '@prisma/client'
import { MinusCircle, Plus, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface CartItems {
    productId: string
    quantity: number
}

const page = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [cartItems, setCartItems] = React.useState<CartItems[]>([])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await getAllProduct()
            setProducts(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const addToCart = (productId: string) => {
        setCartItems(prevCartItems => {
            const existingItem = prevCartItems.find(item => item.productId === productId)

            if (existingItem) {
                return prevCartItems.map(item =>
                    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
                )
            } else {
                return [...prevCartItems, { productId, quantity: 1 }]
            }
        })
    }

    const decreaseQuantity = (productId: string) => {
    const cartItem = cartItems.find(item => item.productId === productId);
    if (!cartItem) return;

    setCartItems(prevCartItems => {
        return prevCartItems
            .map(item => {
                if (item.productId === productId && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                } 
                else if (item.productId === productId && item.quantity === 1) {
                    return null; 
                }
                return item;
            })
            .filter(item => item !== null); 
    });
};

    const increaseQuantity = (productId: string) => {
        setCartItems(prevCartItems => {
            return prevCartItems.map(item =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        })
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <div className='flex'>
            <div className='w-full rounded-lg bg-secondary shadow-md lg:m-0'>
                <div className='w-full'>
                    <div className='flex items-center justify-between p-4 border-b border-border'>
                        <Link href={'/dashboard/products/add'}><Button variant='link'><Plus />Add new product</Button></Link>
                        <div className='flex gap-2 items-center max-w-sm mr-6'>
                            <Input placeholder='search product...' />
                            <Button type='submit' variant='default' className='flex items-center gap-1'><SearchIcon /></Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        {loading ? (
                            <ProductCardSkeleton />
                        ) : products.length > 0 ? (
                            <ProductCards products={products} addToCart={addToCart} />
                        ) : (
                            <div className='text-center p-8 text-gray-500'>
                                No products found. Add a new product to get started!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CashierCart decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity} cartItems={cartItems} products={products} />
        </div>
    )
}

export default page