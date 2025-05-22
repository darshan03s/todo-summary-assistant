import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export default function SentToSlackModal({ open, onOpenChange, summary }: { open: boolean; onOpenChange: (open: boolean) => void; summary: string }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-amber-100 border-none">
                <DialogHeader>
                    <DialogTitle>Sent summary to Slack</DialogTitle>
                    <DialogDescription className="text-amber-600">
                        {summary}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" className="bg-amber-600 hover:bg-amber-700 cursor-pointer" onClick={() => onOpenChange(false)}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
