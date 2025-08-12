import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewCards } from "@/components/dashboard/overfiew-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProductsTable } from "@/components/dashboard/top-products-table";
import { RecentTransactions } from "@/components/dashboard/recent-transaction";
import { DateRangePickerWithPresets } from "@/components/dashboard/data-picker";
import { getAllTransaction } from "@/lib/transaction";
import { Transaction, User } from "@prisma/client";
import { getAllProduct } from "@/lib/actions/product";

interface TransactionWithUser extends Transaction {
  user: User | null
}

async function getDashboardData() {
  const transactions: TransactionWithUser[] = await getAllTransaction()
  const products = await getAllProduct()

  if (!products) return console.error('no products found')
  if (!transactions) return console.error('no transaction found')
  const totalRevenue = transactions.reduce((akumulator: number, transaction: Transaction) => {
    return akumulator + (transaction.totalAmount || 0)
  }, 0)

  const totalTransactions = transactions.length
  const averageOrderValue = totalRevenue / totalTransactions

  const topProducts = products.sort((a, b) => b.sold - a.sold).slice(0, 5)
  const topProductsWithRevenue = topProducts.map((product) => {
    const totalRevenue = product.price * product.sold
    return {...product, totalRevenue: totalRevenue}
  })

   const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })

  const recentTransactions = sortedTransactions.slice(0, 5)

  return {
    totalRevenue: totalRevenue,
    totalTransactions: totalTransactions,
    averageOrderValue: averageOrderValue,
    salesData: [
      { name: "Jan", total: 4000000 },
      { name: "Feb", total: 3000000 },
      { name: "Mar", total: 5000000 },
      { name: "Apr", total: 4700000 },
      { name: "May", total: 6000000 },
      { name: "Jun", total: 5500000 },
      { name: "Jul", total: 7000000 },
      { name: "Aug", total: 6500000 },
      { name: "Sep", total: 8000000 },
      { name: "Oct", total: 7500000 },
      { name: "Nov", total: 8500000 },
      { name: "Dec", total: 9000000 },
    ],
    topProducts: topProductsWithRevenue,
    recentTransactions: recentTransactions,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  if (!data) return console.error('no db data')
  return (
    <>
      <div className="md:hidden">
        <p className="p-4 text-center text-lg">
          Dashboard ini dirancang untuk tampilan desktop. Silakan gunakan perangkat yang lebih besar.
        </p>
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Analitik</h2>
            <div className="ml-auto flex items-center space-x-4">
              <DateRangePickerWithPresets />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Produk</TabsTrigger>
              {/* <TabsTrigger value="users">Pengguna</TabsTrigger> */}
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <OverviewCards data={data} /> {/* Component untuk kartu ringkasan */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Penjualan (Revenue)</CardTitle>
                    <CardDescription>Grafik penjualan bulanan.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <SalesChart data={data.salesData} /> {/* Grafik penjualan */}
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Transaksi Terbaru</CardTitle>
                    <CardDescription>
                      {`Ada ${data.recentTransactions.length} transaksi terbaru.`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions transactions={data.recentTransactions} /> {/* Daftar transaksi */}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="products" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Produk Terlaris</CardTitle>
                    <CardDescription>
                      Daftar produk dengan penjualan tertinggi berdasarkan kuantitas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopProductsTable products={data.topProducts} /> {/* Tabel produk terlaris */}
                  </CardContent>
                </Card>
                {/* Anda bisa menambahkan lebih banyak grafik atau tabel produk di sini */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}