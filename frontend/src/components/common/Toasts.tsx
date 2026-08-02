import { Check, AlertCircle } from "lucide-react";
import type { Toast } from "../../hooks/useToasts";

interface ToastsProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function Toasts({ toasts, onDismiss }: ToastsProps) {
  return (
    <div className="toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onDismiss(t.id)}>
          {t.type === "error" ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}