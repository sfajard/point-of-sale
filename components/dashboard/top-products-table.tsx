// src/components/dashboard/TopProductsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@prisma/client";

interface ProductWithRevenue extends Product {
  totalRevenue: number
}

interface TopProductsTableProps {
  products: ProductWithRevenue[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Produk</TableHead>
            <TableHead>Terjual (Kuantitas)</TableHead>
            <TableHead className="text-right">Pendapatan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.sold}</TableCell>
              <TableCell className="text-right">Rp{product.totalRevenue.toLocaleString('id-ID')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}