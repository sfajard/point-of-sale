import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { Category } from "@prisma/client"
import { capitalizeEachWord } from "@/lib/capitalized-word"

interface CategorySelectProps {
  categoryId?: string
  onValueChange?: (value: string) => void
}

export const CategorySelect = ({
  categoryId,
  onValueChange,
}: CategorySelectProps) => {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    categoryId
  );

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:3000/api/category")
    setCategories(response.data)
  };

  React.useEffect(() => {
    fetchCategories()
  }, []);

  React.useEffect(() => {
    setSelectedValue(categoryId)
  }, [categoryId])

  const handleValueChange = (value: string) => {
    setSelectedValue(value)
    if (onValueChange) {
      onValueChange(value)
    }
  }

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Category</SelectLabel>
          {categories.map((cat) => (
            <SelectItem value={cat.id} key={cat.id}>
              {capitalizeEachWord(cat.name)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}