import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ProductPurchaseConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  message?: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
};

export function ProductPurchaseConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  message = "Confirmer l'achat de ce produit ?",
  confirmLabel = "OUI",
  confirmDisabled = false,
}: ProductPurchaseConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex h-[190px] max-h-[calc(100dvh-32px)] w-[calc(100vw-50px)] max-w-[382px] flex-col gap-0 overflow-hidden rounded-[4px] border-0 bg-white p-0 text-[#555] shadow-[0_12px_40px_rgba(0,0,0,0.28)]">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 text-center">
          <AlertDialogTitle className="sr-only">Confirmation d’achat</AlertDialogTitle>
          <AlertDialogDescription className="text-[16px] font-normal leading-6 text-[#555]">
            {message}
          </AlertDialogDescription>
        </div>

        <div className="grid h-[56px] shrink-0 grid-cols-2 border-t border-[#d5d5d5] bg-[#f1f1f1]">
          <AlertDialogCancel
            className="m-0 h-full w-full rounded-none border-0 border-r border-[#d5d5d5] bg-transparent p-0 text-[14px] font-normal text-[#454545] shadow-none hover:bg-[#e9e9e9] hover:text-[#454545] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#87bde0]"
            data-testid="button-cancel-purchase"
          >
            NON
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={confirmDisabled}
            onClick={onConfirm}
            className="m-0 h-full w-full rounded-none border-0 bg-transparent p-0 text-[14px] font-normal text-[#81bce0] shadow-none hover:bg-[#e9e9e9] hover:text-[#69a9d0] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#87bde0]"
            data-testid="button-confirm-purchase"
          >
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
