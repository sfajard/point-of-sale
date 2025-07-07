// components/category-dropdown.tsx
"use client"; // Ini adalah Client Component karena ada interaktivitas (dropdown)

import * as React from "react";
import { ChevronDown } from "lucide-react"; // Ikon untuk menunjukkan dropdown

// Import komponen shadcn/ui
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tipe data untuk setiap item kategori
interface CategoryItem {
  id: string;
  name: string;
  value: string; // Nilai yang akan digunakan saat kategori dipilih
}

// Props untuk komponen CategoryDropdown
interface CategoryDropdownProps {
  categories: CategoryItem[]; // Array kategori yang tersedia
  onSelectCategory: (categoryValue: string) => void; // Callback saat kategori dipilih
  selectedCategoryValue?: string; // Kategori yang sedang dipilih (opsional, untuk menampilkan di tombol)
  label?: string; // Label opsional untuk dropdown, misal "Filter by Category"
}

export function CategoryDropdown({
  categories,
  onSelectCategory,
  selectedCategoryValue,
  label = "Pilih Kategori", // Default label tombol
}: CategoryDropdownProps) {
  // Temukan nama kategori yang dipilih untuk ditampilkan di tombol
  const currentCategoryName = categories.find(
    (cat) => cat.value === selectedCategoryValue
  )?.name || label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Tombol pemicu dropdown */}
        <Button variant="outline" className="flex items-center gap-2">
          {currentCategoryName}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {label && ( // Tampilkan label jika ada
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onSelect={() => onSelectCategory(category.value)}
            className={
              selectedCategoryValue === category.value ? "font-semibold bg-accent text-accent-foreground" : ""
            }
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}