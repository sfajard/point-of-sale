"use client"

import * as React from "react";
import { CategoryDropdown } from "@/components/category-dropdown"

const productCategories = [
  { id: "1", name: "Elektronik", value: "electronics" },
  { id: "2", name: "Pakaian", value: "apparel" },
  { id: "3", name: "Buku", value: "books" },
  { id: "4", name: "Rumah & Dapur", value: "home-kitchen" },
];

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(undefined);

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
  };

  return (
    <div className="flex justify-between align-middle">
      <h1 className="text-xl font-bold mb-4">Product List</h1>

      <div className="mb-6">
        <CategoryDropdown
          categories={productCategories}
          onSelectCategory={handleCategoryChange}
          selectedCategoryValue={selectedCategory}
          label="Category"
        />
      </div>
    </div>
  );
}

export default ProductsPage