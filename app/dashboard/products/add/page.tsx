import { ProductForm } from '@/components/create-product-form'
import React from 'react'

const page = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Add Product</h1>
      <ProductForm />
    </div>
  )
}

export default page