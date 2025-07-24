'use client'

import React, { useState, useEffect, useCallback } from 'react';
import ProductCards from './product-cards';
import { getAllProduct } from '@/lib/actions/product';
import { Product } from '@prisma/client';
import { Toggle } from '../ui/toggle'; // Pastikan ini adalah komponen Toggle Anda

interface ProductWithImages extends Product {
  imageUrls: { url: string }[];
}

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState<ProductWithImages[]>([])
  const [viewMode, setViewMode] = useState<'featured' | 'top selling'>('featured')
  const [displayedProducts, setDisplayedProducts] = useState<ProductWithImages[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProduct()
        if (fetchedProducts) {
          setAllProducts(fetchedProducts)
        }
      } catch (error) {
        console.error("Gagal mengambil produk:", error)
      }
    }
    fetchProducts()
  }, [])

  const filterProducts = useCallback(() => {
    if (viewMode === 'featured') {
      return allProducts.filter(product => product.isFeatured)
    } else {
      return allProducts
    }
  }, [allProducts, viewMode])

  useEffect(() => {
    setDisplayedProducts(filterProducts())
  }, [allProducts, viewMode, filterProducts])

  const handleToggleFeatured = (pressed: boolean) => {
    if (pressed) {
      setViewMode('featured')
    } else {
      if (viewMode === 'featured') {
         setViewMode('top selling');
      }
    }
  };

  const handleToggleAll = (pressed: boolean) => {
    if (pressed) {
      setViewMode('top selling');
    } else {
      if (viewMode === 'top selling') {
         setViewMode('featured');
      }
    }
  };

  return (
    <div className='p-8 flex flex-col items-center'>
      <h1 className='font-bold text-3xl mb-4'>Featured Products</h1>

      <div className="flex gap-4 mb-4">
        <Toggle
          pressed={viewMode === 'featured'}
          onPressedChange={handleToggleFeatured}
          aria-label="Tampilkan produk unggulan"
        >
          Recomended
        </Toggle>

        <Toggle
          pressed={viewMode === 'top selling'}
          onPressedChange={handleToggleAll}
          aria-label="Tampilkan semua produk"
        >
          Top Selling
        </Toggle>
      </div>

      {allProducts.length === 0 ? (
        <p className="text-gray-500">No Product found...</p>
      ) : displayedProducts.length === 0 && viewMode === 'featured' ? (
        <p className="text-gray-500">No Product found...</p>
      ) : null}

      <ProductCards products={displayedProducts} selectedField={viewMode} />
    </div>
  );
};

export default FeaturedProducts
