import type { ReactNode } from "react";

type AlertType = "error" | "success";

export default function Alert({
  type,
  children,
}: {
  type: AlertType;
  children: ReactNode;
}) {
  return (
    <p
      className={`rounded-md border px-3 py-2 text-center text-sm ${
        type === "error"
          ? "border-red-800 bg-red-900/40 text-red-200"
          : "border-emerald-800 bg-emerald-900/40 text-emerald-200"
      }`}
    >
      {children}
    </p>
  );
}
