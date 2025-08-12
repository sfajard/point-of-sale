import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transaction, User } from "@prisma/client";

interface TransactionWithUser extends Transaction {
  user: User | null
}

interface RecentTransactionsProps {
  transactions: TransactionWithUser[];
}

/**
 * Render a list of recent transactions with user avatar, order info, date, and formatted amount.
 *
 * Renders each transaction as a row containing:
 * - an avatar (falls back to the first two uppercase characters of the user's name or "-" when user is missing),
 * - the order ID and a muted line with the user name (or "Unknown User") and the transaction date,
 * - the total amount formatted for the Indonesian locale prefixed with "Rp".
 *
 * @param transactions - Array of transactions augmented with an optional `user` object; `user` may be null and is safely handled.
 * @returns A JSX element containing the rendered list of transactions.
 */
export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {transaction.user ? transaction.user.name?.substring(0, 2).toUpperCase() : '-'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.orderId}</p>
            <p className="text-sm text-muted-foreground">
              {/* Add a check for transaction.user before accessing its properties */}
              {transaction.user ? transaction.user.name : 'Unknown User'} -{" "}
              {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto font-medium">Rp{transaction.totalAmount.toLocaleString('id-ID')}</div>
        </div>
      ))}
    </div>
  );
}