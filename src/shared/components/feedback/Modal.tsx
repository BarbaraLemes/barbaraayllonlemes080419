import { type ReactNode } from "react";
import { Dialog } from "primereact/dialog";
import Text from "../ui/Text";

interface ModalProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  description?: string;
  icon?: string;
  children: ReactNode;
  width?: string;
  headerClassName?: string;
}

export default function Modal({
  visible,
  onHide,
  title,
  description,
  icon,
  children,
  width = "800px",
  headerClassName = "bg-slate-900",
}: ModalProps) {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      modal
      draggable={false}
      dismissableMask
      className="w-[95vw] sm:w-[90vw]"
      style={{ maxWidth: width }}
      header={
        <div className="flex items-center gap-4">
          {icon && (
            <i className={`${icon} text-yellow-400 text-2xl`} />
          )}
          <div className="flex flex-col">
            <Text variant="heading-xl" className="text-white">{title}</Text>
            {description && (
              <Text variant="body-sm-medium" className="text-slate-500 mt-1">{description}</Text>
            )}
          </div>
        </div>
      }
      headerClassName={`${headerClassName} px-7 py-5`}
      contentClassName="p-0"
    >
      {children}
    </Dialog>
  );
}
