import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const HERO_IMAGE_URL = "/hero.png"

const HeroSection = () => {
    return (
        <Card className="relative w-full aspect-[19/8] overflow-hidden rounded-xl shadow-lg mb-8 p-0 border-0">
            <Image
                src={HERO_IMAGE_URL}
                alt="Diskon Fashion Pria"
                fill
                priority
                sizes="100vw"
                className="absolute inset-0 w-[1920px] h-[1080px] object-cover dark:opacity-60"
            />
            <CardContent className="relative z-10 flex flex-col items-start justify-center h-full text-left px-6">
                <div className="flex flex-col space-y-4 w-130 m-10">
                    <span className="text-xl font-medium">Opening Sale</span>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                        Men's Fashion Sale - 25% OFF!
                    </h1>
                    <p className="text-lg md:text-xl mb-6 font-medium drop-shadow">
                        Dapatkan penampilan terbaik dengan harga spesial. Promo terbatas hanya di bulan ini!
                    </p>
                    <Button size="lg" className="bg-yellow-400 w-37 text-black font-bold hover:bg-yellow-500 shadow-lg">
                        Shop Now
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HeroSection;
