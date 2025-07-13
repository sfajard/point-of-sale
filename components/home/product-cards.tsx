interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    sold: number;
}

interface ProductCardsProps {
  products: Product[];
}

const ProductCards = ({ products }: ProductCardsProps) => {
    return (
        <div>
            {products.map((product) => (
                <div>{product.name}</div>
            ))}
        </div>
    )
}

export default ProductCards