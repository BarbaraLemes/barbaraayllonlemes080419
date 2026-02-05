import Modal from "./Modal";
import Button from "./Button";
import Text from "./Text";

interface ConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  visible,
  onHide,
  onConfirm,
  title = "Confirmação",
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  severity = "danger",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  const getIcon = () => {
    switch (severity) {
      case "danger":
        return "pi-exclamation-triangle text-red-500";
      case "warning":
        return "pi-exclamation-circle text-yellow-500";
      case "info":
        return "pi-info-circle text-blue-500";
      default:
        return "pi-question-circle text-slate-500";
    }
  };

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      title={title}
      width="500px"
    >
      <div className="p-4 sm:p-6 max-h-[60vh] sm:max-h-none overflow-y-auto">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <i className={`pi ${getIcon()} text-3xl`} />
          </div>
          <div className="flex-1">
            <Text variant="body-base" className="text-slate-700">
              {message}
            </Text>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onHide}
            className="px-6 text-xs sm:text-sm md:text-base"
            icon="pi pi-times"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={severity === "danger" ? "danger" : "warning"}
            onClick={handleConfirm}
            className="px-6 text-xs sm:text-sm md:text-base"
            icon="pi pi-trash"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
