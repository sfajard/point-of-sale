'use client'

import React from 'react'
import ProductCards from './product-cards'
import { getAllProduct } from '@/lib/action'
import { Product } from '@prisma/client';

const FeaturedProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  React.useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getAllProduct();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);
  return (
    <div className='p-8 flex flex-col items-center'>
        <h1 className='font-bold text-3xl'>Featured Products</h1>
        <ProductCards products={products}/>
    </div>
  )
}

export default FeaturedProducts