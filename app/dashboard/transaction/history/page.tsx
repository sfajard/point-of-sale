'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

import { Skeleton } from '@/components/ui/skeleton';
import { getAllTransaction } from '@/lib/transaction';
import { getAllProduct } from '@/lib/action';
import HistoryItemDialog from '@/components/transaction/history-item-dropdown';

interface TransactionItem {
  id: string;
  name: string;
  totalAmount: number;
  createdAt: string;
  transactionItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await getAllTransaction()
        setTransactions(response)
        const productResponse = await getAllProduct();
        setProducts(productResponse.map((
          product: { id: string; name: string }) => ({ id: product.id, name: product.name })
        ));
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-muted flex flex-col items-center">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full rounded-lg" />
          ) : (
            <Table className="rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="bg-secondary">
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-accent transition">
                      <TableCell className="text-primary font-bold">Rp. {tx.totalAmount?.toLocaleString?.() ?? tx.totalAmount}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(tx.transactionItems) && tx.transactionItems.length > 0 ? (
                            <HistoryItemDialog
                              items={tx.transactionItems.map((item) => {
                                const product = products.find((p) => p.id === item.productId);
                                return {
                                  productId: item.productId,
                                  quantity: item.quantity,
                                  productName: product ? product.name : 'Unknown',
                                };
                              })}
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">No items</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistoryPage;
