import * as Dialog from "@radix-ui/react-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export const ConfirmDialog = ({ open, onConfirm, onCancel, message }: ConfirmDialogProps) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-[40%] left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-lg transition-all">
          <Dialog.Title className="text-lg font-semibold mb-2">Confirm Deletion</Dialog.Title>
          <div className="text-sm mb-4">{message}</div>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-3 py-1 rounded bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
