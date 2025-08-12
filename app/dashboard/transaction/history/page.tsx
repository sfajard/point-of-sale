'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { getAllTransaction } from '@/lib/transaction';
import { getAllProduct } from '@/lib/actions/product';
import HistoryItemDialog from '@/components/transaction/history-item-dropdown';

// Perbarui interface TransactionItem untuk mencakup field invoice yang baru
interface TransactionItem {
  id: string;
  name?: string;
  totalAmount: number;
  createdAt: string;
  status: string;
  orderId: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  paymentLinkUrl?: string | null;
  pdfUrl?: string | null;
  transactionItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

// Define a type for the raw response from getAllTransaction to fix the 'any' error.
// We assume the raw response has the same shape as TransactionItem but with Date objects
// for createdAt.
interface RawTransactionResponse {
  id: string;
  totalAmount: number;
  createdAt: Date;
  status: string;
  orderId: string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  paymentLinkUrl?: string | null;
  pdfUrl?: string | null;
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
        const response: RawTransactionResponse[] = await getAllTransaction();
        const mappedResponse: TransactionItem[] = response.map((tx) => ({
          ...tx,
          createdAt: tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
        }));
        setTransactions(mappedResponse);

        const productResponse = await getAllProduct();
        if (productResponse) {
          setProducts(productResponse.map(
            (product: { id: string; name: string }) => ({ id: product.id, name: product.name })
          ));
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-6xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
          ) : (
          <Table className="rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="bg-secondary">
                <TableHead>Order ID</TableHead>
                <TableHead>Total Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada transaksi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-accent transition">
                    <TableCell className="font-medium text-sm">{tx.orderId}</TableCell>
                    <TableCell className="text-primary font-bold">Rp. {tx.totalAmount?.toLocaleString('id-ID') ?? tx.totalAmount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-secondary text-white'
                        }`}>
                        PAID
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{tx.createdAt ? new Date(tx.createdAt).toLocaleString('id-ID') : '-'}</TableCell>
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
                          <span className="text-muted-foreground text-xs">Tidak ada item</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-2 items-center justify-center">
                        {tx.paymentLinkUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full justify-center"
                          >
                            <a href={tx.paymentLinkUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" /> Bayar Invoice
                            </a>
                          </Button>
                        )}
                        {tx.pdfUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="w-full justify-center"
                          >
                            <a href={tx.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" /> Lihat PDF
                            </a>
                          </Button>
                        )}
                        {!tx.paymentLinkUrl && !tx.pdfUrl && (
                          <span className="text-muted-foreground text-xs">N/A</span>
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
