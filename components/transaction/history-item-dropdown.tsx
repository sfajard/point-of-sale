import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HistoryItemDialogProps {
  items: Array<{
    productName: string;
    quantity: number;
    productId: string;
  }>;
}

const HistoryItemDialog: React.FC<HistoryItemDialogProps> = ({ items }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">View Items</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Items</DialogTitle>
          <DialogDescription>
            Detail produk dan jumlah pada transaksi ini.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {items.length === 0 ? (
            <span className="text-muted-foreground text-xs">No items</span>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {item.productName}
                </Badge>
                <span className="text-xs">&times; {item.quantity}</span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryItemDialog;
