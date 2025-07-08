import { addProductSchema } from "./schema"
import * as z from "zod"

export const addProduct = async (values: z.infer<typeof addProductSchema>) => {
    console.log(values)
}