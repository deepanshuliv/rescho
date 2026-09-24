import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import BackLink from "./BackLink";

interface PageShellProps {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  /** Hide the back button (e.g. on loading states). */
  hideBack?: boolean;
  width?: "md" | "lg";
}

// Shared layout for the form-style pages: header islands + centered column.
export default function PageShell({
  children,
  backHref = "/",
  backLabel = "Back",
  hideBack,
  width = "md",
}: PageShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader right={hideBack ? undefined : <BackLink href={backHref} label={backLabel} />} />
      <main className="flex flex-1 flex-col items-center justify-center px-5 pb-16 pt-10">
        <div className={`w-full ${width === "md" ? "max-w-md" : "max-w-lg"}`}>{children}</div>
      </main>
    </div>
  );
}
