'use client'

import { Product } from "@prisma/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"
import React from "react"

interface ProductCardsProps {
  products: Product[]
  addToCart: (productId: string) => void,
}

export const ProductCards = ({ products, addToCart }: ProductCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-6 p-6 overflow-y-auto">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Product Image - Asumsi 'imageUrl' ada di tipe Product Anda */}
          {/* Anda mungkin perlu menambahkan imageUrl?: string; ke interface Product jika belum ada */}
          {/* {product.imageUrl && (
            <div className="relative w-full h-48 sm:h-40 md:h-48 lg:h-52 overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
          )} */}

          <CardHeader className="flex-grow pb-2">
            <CardTitle className="text-lg font-semibold line-clamp-2" title={product.name}>
              {product.name}
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <p className="text-sm text-muted-foreground">Stok: {product.stock}</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button onClick={() => addToCart(product.id )} className="w-full cursor-pointer"><ShoppingCart /> Add</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} className="flex flex-col overflow-hidden">
          <Skeleton className="relative w-full h-48 sm:h-40 md:h-48 lg:h-52" />
          <CardHeader className="flex-grow pb-2">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="pt-0 pb-4">
            <Skeleton className="h-4 w-1/4" />
          </CardContent>
          <CardFooter className="pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};