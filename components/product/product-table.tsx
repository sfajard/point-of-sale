import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { capitalizeEachWord } from '@/lib/capitalized-word';
import Link from 'next/link';
import { DeleteAlert } from '../delete-alert';
import Image from 'next/image';
import { formatIDR } from '@/lib/utils';
import { getAllProduct } from '@/lib/actions/product';

// Assuming Category type from Prisma Client is available
// and includes 'name' and 'id'
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  imageUrls?: { url: string }[]
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
      const response = await getAllProduct()
      if (response) {
        setProducts(response)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchProducts()
  }, [selectedCategoryId])

  const displayedProducts = useMemo(() => {
    if (!selectedCategoryId) {
      return products;
    }

    return products.filter((product) => product.categoryId === selectedCategoryId)
  }, [products, selectedCategoryId]);

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="grid grid-cols-6 gap-4 py-3 px-4 items-center bg-secondary rounded-lg my-2"
      >
        <Skeleton className="h-5 w-[80%]" />
        <Skeleton className="h-5 w-[60%]" />
        <Skeleton className="h-5 w-[40%]" />
        <Skeleton className="h-5 w-[70%]" />
        <Skeleton className="h-5 w-[50%]" />
        <div className="col-span-1 flex justify-end space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    ));
  };

  return (
    <div className="border-t border-secondary mt-4">
      <div className="grid grid-cols-6 gap-4 py-2 px-4 font-semibold border-b border-gray-200">
        <h2 className="col-span-1">Nama</h2>
        <h2 className="col-span-1">Harga</h2>
        <h2 className="col-span-1">Stok</h2>
        <h2 className="col-span-1">Kategori</h2>
        <h2 className="col-span-1">Gambar</h2>
        <h2 className="col-span-1 text-right">Aksi</h2>
      </div>

      <div className='h-100 overflow-y-auto'>
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
              className="grid grid-cols-6 gap-4 py-3 px-4 items-center bg-secondary rounded-lg my-2"
            >
              <p className="col-span-1">{capitalizeEachWord(product.name)}</p>
              <p className="col-span-1">Rp {formatIDR(product.price)}</p>
              <p className="col-span-1">{product.stock}</p>
              <p className="col-span-1">
                {product.category ? capitalizeEachWord(product.category.name) : "Tidak ada kategori"}
              </p>
              <div className="col-span-1">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <Image
                    src={product.imageUrls[0].url}
                    alt={product.name}
                    height={50}
                    width={50}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image</span>
                )}
              </div>
              <div className="col-span-1 flex justify-end space-x-2">
                <Link href={`/dashboard/products/${product.id}`}>
                  <Button variant={'ghost'} size={'icon'} className='cursor-pointer'><Edit2 className="h-4 w-4 text-blue-500 hover:text-blue-700" /></Button>
                </Link>
                <DeleteAlert onSuccess={fetchProducts} productId={product.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductTable;