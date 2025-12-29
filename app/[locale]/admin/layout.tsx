import { Suspense } from "react";
import { AdminShell } from "./admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="p-8">Loading admin...</div>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
