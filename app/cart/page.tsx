'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { getCartByUserId, updateCartItemQuantity, removeCartItem } from '@/lib/actions/cart';
import { CartItem, Image } from '@prisma/client';
import { Bag } from '@/components/cart/bag';
import { toast } from 'sonner'
import axios from 'axios';
import Script from 'next/script';

declare global {
  interface Window {
    snap: {
      pay: (token: string) => void
    }
  }
}

interface CartItemWithProduct extends CartItem {
  product: {
    name: string;
    price: number;
    imageUrls: Image[];
  };
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const user = session?.user
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (userId) {
      setLoading(true);
      try {
        const cart = await getCartByUserId(userId);
        setCartItems(cart?.items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        toast('Error', {
          description: 'Failed to load cart items. Please try again.'
        })
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (userId) {
      try {
        // Optimistic update
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );

        const updatedItem = await updateCartItemQuantity(itemId, newQuantity);
        if (!updatedItem) {
          throw new Error('Failed to update quantity on server.');
        }
        toast('Success', {
          description: `Quantity for item updated to ${newQuantity}.`,
        });
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast('Error', {
          description: 'Failed to update item quantity. Please try again.',
        });
        fetchCart();
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (userId) {
      try {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));

        await removeCartItem(itemId);
        toast('Success', {
          description: 'Item removed from your cart.',
        });
      } catch (error) {
        console.error('Error removing cart item:', error);
        toast('Error', {
          description: 'Failed to remove item. Please try again.',
        });
        fetchCart();
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast('Error', {
        description: 'Please log in to proceed with checkout.'
      });
      return
    }
    try {
      const transaction = await axios.post('/api/transaction', {
        userName: user.name,
        id: user.id,
        email: user.email
      })

      const token = transaction.data.token
      if (token) {
        window.snap.pay(token)
      }
    } catch (error) {
      console.log(error);
      toast('Error', {
        description: 'Failed to proceed with checkout. Please try again.'
      });
    }
  };

  if (loading) {
    return (
      <div className='w-full h-full m-10 flex justify-center items-center'>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div className='w-full h-full p-4 md:p-10'>
      <Bag
        cartItems={cartItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <Script
      src="https://app.sandbox.midtrans.com/snap/snap.js" 
      strategy='lazyOnload'
      data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} />
    </div>
  )
}

export default CartPage;