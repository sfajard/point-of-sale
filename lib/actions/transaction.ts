import {prisma} from "@/lib/prisma"

export const checkout = async () => {
    try {
        const product = await prisma.product.findUnique({
            where: 
        })
    } catch (error) {
        console.log(error)
    }
}