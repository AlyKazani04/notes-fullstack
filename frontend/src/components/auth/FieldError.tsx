import type { ReactNode } from "react";

interface FieldErrorProps {
  children?: ReactNode;
}

export function FieldError({ children }: FieldErrorProps) {
  if (!children) return null;
  return <div className="field-error">{children}</div>;
}