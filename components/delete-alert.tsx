import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "@/lib/actions/product"
import { Trash2 } from "lucide-react"

interface DeleteAlertProps {
    productId: string
    onSuccess: () => void
}

export const DeleteAlert = ({ productId, onSuccess }: DeleteAlertProps) => {

    const handleSubmit = async () => {
        try {
            await deleteProduct(productId)
            onSuccess()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size={'icon'}><Trash2 className="cursor-pointer h-4 w-4 text-red-500 hover:text-red-700" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        product and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
