import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { formatIDR } from "@/lib/utils";

interface ProductWithImages {
  id: string;
  name: string;
  price: number;
  imageUrls: { url: string }[];
  rating?: number;
  sold?: number;
  isFeatured: boolean
}

interface ProductCardsProps {
    products: ProductWithImages[];
    selectedField: string
}

const ProductCards = ({ products, selectedField }: ProductCardsProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
                <Card key={product.id} className="flex flex-col items-center justify-center">
                    <Image
                        src={product.imageUrls[0]?.url || "/placeholder.png"} // fallback
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-cover rounded-lg w-full h-full"
                        style={{ width: 200, height: 200 }}
                    />
                    <CardContent className="flex flex-col text-center">
                        <Link href={`${product.id}`}>
                            <h2 className="text-lg font-bold">{product.name}</h2>
                        </Link>
                        <p className="text-sm text-gray-500">Price: ${formatIDR(product.price)}</p>
                        <p className="text-sm text-gray-500">Rating: {product.rating} ⭐</p>
                        <p className="text-sm text-gray-500">Sold: {product.sold} items</p>
                        <Button variant={'outline'} className="mt-2 cursor-pointer">
                            Add to Cart
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default ProductCards