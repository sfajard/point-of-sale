import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

interface ProductCarouselProps {
  imageUrls: string[]
}

export const ProductCarousel = ({ imageUrls }: ProductCarouselProps) => {
  return (
    <Carousel className="w-full max-w-md ml-5">
      <CarouselContent>
        {imageUrls.map((url, index) => (
          <CarouselItem key={index}>
            <div className="p-2">
              <Card className="shadow-md border border-muted bg-white">
                <CardContent className="flex items-center justify-center p-2 aspect-square overflow-hidden">
                  <Image
                    src={url}
                    alt={`Product Image ${index + 1}`}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full rounded-md transition-transform duration-300 hover:scale-105"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-white/80 hover:bg-white shadow-md" />
      <CarouselNext className="bg-white/80 hover:bg-white shadow-md" />
    </Carousel>
  )
}
