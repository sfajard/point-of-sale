'use server'

import { prisma } from "@/lib/prisma"

export const addToCart = async (userId: string, productId: string) => {
    try {
        let cart = null;

        // Cari cart user
        const existingCart = await prisma.cart.findFirst({
            where: {
                userId: userId
            }
        })

        if (existingCart) {
            cart = existingCart;
        } else {
            cart = await prisma.cart.create({
                data: {
                    userId
                }
            })
        }

        // Cek apakah CartItem sudah ada
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        })

        if (existingCartItem) {
            // Jika sudah ada, tambah quantity
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: { increment: 1 } }
            })
        } else {
            // Jika belum ada, buat CartItem baru
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: 1
                }
            })
        }
    } catch (error) {
        console.error(error)
        return {
            error: "Failed to add to cart"
        }
    }
}

export const getCartByUserId = async (userId: string) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                userId
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                imageUrls: true
                            }
                        }
                    }
                }
            }
        })

        return cart
    } catch (error) {
        console.error(error)
    }
}

export const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
        console.warn(`Attempted to set quantity to ${newQuantity} for item ${itemId}. Quantity must be at least 1.`);
        return null; // Prevent setting quantity less than 1
    }
    try {
        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: newQuantity },
        });
        return updatedItem;
    } catch (error) {
        console.error(`Error updating cart item quantity for ${itemId}:`, error);
        return null;
    }
};


export const removeCartItem = async (itemId: string) => {
    try {
        await prisma.cartItem.delete({
            where: { id: itemId },
        })
        return { success: true }
    } catch (error) {
        console.error(`Error removing cart item ${itemId}:`, error);
        throw new Error("Failed to remove cart item from database.");
    }
};