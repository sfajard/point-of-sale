'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Import Button component for links
import { ExternalLink } from 'lucide-react'; // Import icon for external link

// Asumsi fungsi ini akan mengambil semua data transaksi termasuk field invoice yang baru
import { getAllTransaction } from '@/lib/transaction';
import { getAllProduct } from '@/lib/actions/product';
import HistoryItemDialog from '@/components/transaction/history-item-dropdown';

// Perbarui interface TransactionItem untuk mencakup field invoice yang baru
interface TransactionItem {
  id: string;
  name?: string; // name mungkin tidak relevan di sini jika ini adalah transaksi keseluruhan
  totalAmount: number;
  createdAt: string;
  status: string; // Tambahkan status transaksi
  orderId: string; // Order ID internal
  invoiceId?: string | null; // ID invoice dari Midtrans
  invoiceNumber?: string | null; // Nomor invoice dari Midtrans
  paymentLinkUrl?: string | null; // URL payment link dari Midtrans
  pdfUrl?: string | null; // URL PDF invoice dari Midtrans
  transactionItems: Array<{
    productId: string;
    quantity: number;
    // Jika Anda juga ingin menampilkan harga per item atau nama produk di sini,
    // pastikan itu disertakan dalam query Prisma di `getAllTransaction`
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
        // Asumsi getAllTransaction sekarang mengembalikan data dengan field invoice
        const response: TransactionItem[] = await getAllTransaction();
        setTransactions(response);

        // Ambil data produk untuk menampilkan nama item di dialog
        const productResponse = await getAllProduct();
        if (productResponse) {
          setProducts(productResponse.map((
            product: { id: string; name: string }) => ({ id: product.id, name: product.name })
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
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground"> {/* Sesuaikan colSpan */}
                    Tidak ada transaksi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-accent transition">
                    <TableCell className="font-medium text-sm">{tx.orderId}</TableCell> {/* Tampilkan Order ID */}
                    <TableCell className="text-primary font-bold">Rp. {tx.totalAmount?.toLocaleString('id-ID') ?? tx.totalAmount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-secondary text-white'
                        }`}>
                        PAID
                      </span>
                    </TableCell> {/* Tampilkan Status */}
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
