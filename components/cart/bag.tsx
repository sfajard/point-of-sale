import { formatIDR } from '@/lib/utils';
import { CartItem, Image as img } from '@prisma/client';
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

interface CartItemsWithProducts extends CartItem {
    product: {
        name: string;
        price: number;
        imageUrls: img[];
    };
}

interface BagProps {
    cartItems: CartItemsWithProducts[];
    onQuantityChange: (itemId: string, newQuantity: number) => void; // Function to handle quantity changes
    onRemoveItem: (itemId: string) => void
    onCheckout: () => void
}

export const Bag = ({ cartItems, onQuantityChange, onRemoveItem, onCheckout }: BagProps) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Your Cart</CardTitle>
                <CardDescription>Review your items before checkout.</CardDescription>
            </CardHeader>
            <CardContent>
                {cartItems.length === 0 ? (
                    <div className='text-center py-10 text-muted-foreground'>Your cart is empty. Start shopping now!</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Product</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">Price</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cartItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.product.imageUrls && item.product.imageUrls.length > 0 && (
                                            <Image
                                                src={item.product.imageUrls[0].url}
                                                alt={item.product.name}
                                                width={80}
                                                height={80}
                                                className="rounded-md object-cover h-25 w-25"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{item.product.name}</TableCell>
                                    <TableCell className="text-center">{formatIDR(item.product.price)}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </Button>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                                                className="w-16 text-center"
                                            />
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{formatIDR(item.quantity * item.product.price)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm" onClick={() => onRemoveItem(item.id)}>
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            {cartItems.length > 0 && (
                <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="text-lg font-semibold">Subtotal:</div>
                    <div className="text-xl font-bold flex align-middle items-center"><span className='mx-3'>
                        {formatIDR(subtotal)}</span>
                        <Button onClick={() => onCheckout()}>Chckout</Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};