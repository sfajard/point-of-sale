import React, { useEffect, useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Skeleton } from './ui/skeleton';
import { capitalizeEachWord } from '@/lib/capitalized-word';
import { Category } from '@prisma/client';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: Category[]; 
}

interface ProductTableProps {
  selectedCategoryId?: string;
}

const ProductTable = ({ selectedCategoryId }: ProductTableProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = "http://localhost:3000/api/product"

      const response = await axios.get<Product[]>(url);
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategoryId])

  const displayedProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products
    }
    return products.filter((product) =>
      product.category.some((cat) => cat.id === selectedCategoryId)
    );
  }, [products, selectedCategoryId]);

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-5 gap-4 py-3 px-4 items-center bg-secondary rounded-lg my-2"
      >
        <Skeleton className="h-5 w-[80%]" />
        <Skeleton className="h-5 w-[60%]" />
        <Skeleton className="h-5 w-[40%]" />
        <Skeleton className="h-5 w-[70%]" />
        <div className="col-span-1 flex justify-end space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    ));
  };

  return (
    <div className="border-t border-secondary mt-4">
      <div className="grid grid-cols-5 gap-4 py-2 px-4 font-semibold border-b border-gray-200">
        <h2 className="col-span-1">Nama</h2>
        <h2 className="col-span-1">Harga</h2>
        <h2 className="col-span-1">Stok</h2>
        <h2 className="col-span-1">Kategori</h2>
        <h2 className="col-span-1 text-right">Aksi</h2>
      </div>

      {loading ? (
        renderSkeletonRows()
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Tidak ada produk ditemukan.</div>
      ) : (
        displayedProducts.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-5 gap-4 py-3 px-4 items-center bg-secondary rounded-lg my-2"
          >
            <p className="col-span-1">{product.name}</p>
            <p className="col-span-1">{product.price.toFixed(2)}</p>
            <p className="col-span-1">{product.stock}</p>
            <p className="col-span-1">
              {product.category && product.category.length > 0
                ? product.category
                    .map((cat) => capitalizeEachWord(cat.name))
                    .join(", ")
                : "Tidak ada kategori"}
            </p>
            <div className="col-span-1 flex justify-end space-x-2">
              <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => console.log("Edit:", product.id)}>
                <Edit2 className="h-4 w-4 text-blue-500 hover:text-blue-700" />
              </Button>
              <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => console.log("Delete:", product.id)}>
                <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductTable;