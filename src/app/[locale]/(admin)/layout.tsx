import type { ReactNode } from "react";
import "../../admin.css";

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <div className="admin-app">{children}</div>;
}
