import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { addCategorySchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { addCategory } from "@/lib/action"

interface AddCategoryDialogProps {
    onSuccess?: () => void
}2

export function AddCategoryDialog({ onSuccess }: AddCategoryDialogProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    const formDefaultValues = {
        name: ''
    }

    const form = useForm<z.infer<typeof addCategorySchema>>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: formDefaultValues
    })

    const handleSubmit = async (values: z.infer<typeof addCategorySchema>) => {
        try {
            setLoading(true)
            await addCategory(values)
            setOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error('Error adding category', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant={'secondary'}>Add Category</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="name">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="name"
                                                placeholder="Category name..."
                                                disabled={loading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage /> 
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={loading}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>Add Category</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
