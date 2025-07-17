import { Product } from '@prisma/client'
import React from 'react'

interface CustemerCartProps {
    product: Product
}

const CustomerCart = ({product}: CustemerCartProps) => {
  return (
    <div>
        {product.name}
    </div>
  )
}

export default CustomerCart