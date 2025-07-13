import React from 'react'
import ProductCards from './product-cards'

const products = [
  {
    id: '1',
    name: 'Classic Watch',
    price: 250000,
    image: '/watch.png',
    rating: 4.7,
    sold: 120,
  },
  {
    id: '2',
    name: 'Handbag',
    price: 320000,
    image: '/handbag.png',
    rating: 4.5,
    sold: 98,
  },
  {
    id: '3',
    name: 'Backpack',
    price: 180000,
    image: '/backpack.png',
    rating: 4.6,
    sold: 110,
  },
  {
    id: '4',
    name: "Women's Fashion", 
    price: 400000,
    image: '/womenstyle.png',
    rating: 4.8,
    sold: 150,
  }
]

const FeaturedProducts = () => {
  return (
    <div className='p-8 flex flex-col items-center'>
        <h1 className='font-bold text-3xl'>Featured Products</h1>
        <ProductCards products={products}/>
    </div>
  )
}

export default FeaturedProducts