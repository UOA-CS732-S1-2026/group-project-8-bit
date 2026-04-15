type SaveLoadConfirmAlertProps = {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
};

const actionButtonClass =
  "rounded-md border border-amber-200/30 bg-black/35 px-5 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition duration-150 hover:border-amber-100/65 hover:bg-amber-200/15 active:translate-y-[1px] active:scale-[0.98]";

export function SaveLoadConfirmAlert({
  message,
  onConfirm,
  onClose,
}: SaveLoadConfirmAlertProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="relative w-full max-w-sm bg-[url('/panels/menu-panel.png')] bg-[length:100%_100%] bg-center bg-no-repeat px-6 py-7 text-center text-amber-100 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm save load action"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border border-amber-100/30 bg-black/35 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:border-amber-100/65 hover:bg-amber-100/15 active:scale-95"
        >
          Close
        </button>

        <h3 className="text-xl font-semibold text-stone-100">Confirm</h3>
        <p className="mt-4 text-sm leading-6 text-amber-100/85">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className={actionButtonClass} onClick={handleConfirm}>
            Yes
          </button>
          <button type="button" className={actionButtonClass} onClick={onClose}>
            No
          </button>
        </div>
      </section>
    </div>
  );
}
