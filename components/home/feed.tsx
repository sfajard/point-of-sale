import Image from 'next/image'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { MoveRight } from 'lucide-react'

const Feed = () => {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-5 mt-10">
            <Card className="relative col-span-2 row-span-2">
                <Image
                    src="/womenstyle.png"
                    alt="Women Image"
                    width={800}
                    height={600}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg dark:opacity-60"
                />
                <CardContent className="relative z-10 text-right p-2 flex flex-col space-y-2 ml-20">
                    <div className="flex flex-col space-y-2 w-100 m-5 items-end">
                        <h1 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                            Women's Fashion Sale
                        </h1>
                        <p className="text-lg md:text-xl mb-3 font-medium drop-shadow">
                            UP TO 70% OFF
                        </p>
                        <Button size="default" className="w-26 bg-yellow-400 text-black font-bold hover:bg-yellow-500 shadow-lg">
                            Shop Now
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className="relative col-start-3">
                <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                    <Image
                        src={"/watch.png"}
                        alt="Watch Image"
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg dark:opacity-60"
                    />
                </div>
                <CardContent className="relative z-10 p-2 flex flex-col space-y-2 h-full">
                    <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                        <h1 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                            Watch
                        </h1>
                        <p className="text-lg md:text-xl mb-3 font-medium drop-shadow">
                            Up to 70% Off
                        </p>
                        <Button size="default" variant={'link'} className="w-26 font-bold shadow-lg">
                            Shop Now <MoveRight />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className='relative col-start-4'>
                <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                    <Image
                        src={"/handbag.png"}
                        alt="Shoes Image"
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg dark:opacity-60"
                    />
                </div>
                <CardContent className="relative z-10 p-2 flex flex-col space-y-2 h-full">
                    <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                        <h1 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                            Handbag
                        </h1>
                        <p className="text-lg md:text-xl mb-3 font-medium drop-shadow">
                            Up to 25% Off
                        </p>
                        <Button size="default" variant={'link'} className="w-26 font-bold shadow-lg">
                            Shop Now <MoveRight />
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card className='relative col-span-2 col-start-3 row-start-2'>
                <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                    <Image
                        src={"/backpack.png"}
                        alt="Shoes Image"
                        width={800}
                        height={600}
                        className="absolute inset-0 w-full h-full object-cover rounded-lg dark:opacity-60"
                    />
                    <CardContent className="relative z-10 p-2 flex flex-col space-y-2 h-full">
                    <div className="flex flex-col space-y-2 m-5 mt-6 items-center">
                        <h1 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                            Handbag
                        </h1>
                        <p className="text-lg md:text-xl mb-3 font-medium drop-shadow">
                            Min. 20% - 70% Off
                        </p>
                        <Button size="default" variant={'link'} className="w-26 font-bold shadow-lg">
                            Shop Now <MoveRight />
                        </Button>
                    </div>
                </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default Feed