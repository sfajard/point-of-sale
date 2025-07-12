import React from 'react'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { Product } from '@prisma/client'
import { formatIDR } from '@/lib/utils'

interface CashierCartProps {
  cartItems: CartItems[]
  products: Product[]
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  checkout: () => void
}

interface CartItems {
  productId: string
  quantity: number
  price?: number
}

const CashierCart = ({ cartItems, products, increaseQuantity, decreaseQuantity, checkout}: CashierCartProps) => {

  if (cartItems.length === 0) {
    return (
      <div className='bg-secondary w-100 m-2 rounded-xl p-4 text-center'>
        <h1 className='text-xl font-bold mb-4'>Your cart is empty</h1>
        <p className='text-sm text-muted-foreground'>Add products to your cart to proceed with checkout.</p>
      </div>
    )
  }

  const totalAmount = (cartItems: CartItems[]) => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        return total + (product.price * item.quantity)
      }
      return total
    }, 0)
  }
    return (
      <div className='bg-secondary w-100 m-2 rounded-xl'>
        <div className='p-4'>
          <h1 className='text-xl font-bold mb-4 text-center'>Checkout</h1>
          <div className='border-b pb-2 mb-2'>
            <div className='grid grid-cols-3 gap-2 font-semibold text-sm'>
              <p>Name</p>
              <p className='text-center'>Qty</p>
              <p className='text-right'>Price</p>
            </div>
          </div>
          {cartItems.map((item) => {
            const product = products.find((p) => p.id === item.productId)
            if (!product) { return null; }
            return (
              <div key={item.productId} className='grid grid-cols-3 gap-2 items-center py-2 border-b last:border-b-0'>
                <p className='truncate'>{product.name}</p>
                <div className='flex items-center justify-center gap-2'>
                  <Button onClick={() => increaseQuantity(product.id)} className='cursor-pointer' variant='ghost' size='icon'>
                    <PlusCircle className='h-4 w-4' />
                  </Button>
                  <p className='w-4 text-center'>{item.quantity}</p>
                  <Button onClick={() => decreaseQuantity(product.id)} className='cursor-pointer' variant='ghost' size='icon'>
                    <MinusCircle className='h-4 w-4' />
                  </Button>
                </div>
                <p className='text-right'>{product.price}</p>
              </div>
            )
          })}
          <div className='mt-4 pt-4 border-t'>
            <div className='flex justify-between font-bold text-lg'>
              <span>Total:</span>
              <span>Rp. {formatIDR(totalAmount(cartItems))}</span>
            </div>
          </div>
          <Button onClick={checkout} className='w-full mt-4'>Proceed to Checkout</Button>
        </div>
      </div>
    )
  }

  export default CashierCart