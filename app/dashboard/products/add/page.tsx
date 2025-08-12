import { ProductForm } from '@/components/create-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  const initialProductValue = {
    name: '',
    price: 0,
    sku: '',
    stock: 0,
    categoryId: '',
    image: undefined,
    isFeatured: false
  }
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className="text-xl font-bold mb-4">Add Product</h1>
        <Button variant={'secondary'} className='cursor-pointer'>
          <Link className='flex align-middle items-center' href={'/dashboard/products'}><ArrowLeft /> Product List</Link>
        </Button>
      </div>
      <ProductForm initialProductValue={initialProductValue} action='add' />
    </div>
  )
}

export default page