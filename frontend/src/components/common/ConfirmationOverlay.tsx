interface ConfirmationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationOverlay({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmationOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        className="w-full max-w-md border-rule border-ink bg-paper"
      >
        <h3 id="confirmation-title" className="display band bg-alarm px-5 py-4 text-4xl">
          {title}
        </h3>
        <p className="px-5 py-5 leading-6">{message}</p>
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button onClick={onClose} className="btn" autoFocus>
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="btn btn-alarm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
