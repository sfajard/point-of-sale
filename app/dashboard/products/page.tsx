"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CategorySelect } from "@/components/category-select"
import ProductTable from "@/components/product-table"

const ProductsPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<
    string | undefined
  >(undefined);

  const handleCategoryChange = (newCategoryId: string) => {
    setSelectedCategoryId(newCategoryId)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Product List</h1>

        <div className="flex gap-3">
          <CategorySelect
            categoryId={selectedCategoryId}
            onValueChange={handleCategoryChange}
          />
          <Button variant={"secondary"} asChild>
            <Link href={"/dashboard/products/add"}>Add Product</Link>
          </Button>
        </div>
      </div>
      <ProductTable selectedCategoryId={selectedCategoryId} />
    </div>
  );
};

export default ProductsPage;