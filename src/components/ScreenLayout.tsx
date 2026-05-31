import type { ReactNode } from "react";
import { useRequestExit } from "../context/ExitContext";

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  align?: "center" | "start";
  /** Merged onto the root container (e.g. transient screen tones). */
  rootClassName?: string;
  /** Show upper-right exit control. Default true; false on Welcome. */
  showExit?: boolean;
};

export function ScreenLayout({
  title,
  children,
  footer,
  align = "center",
  rootClassName = "",
  showExit = true,
}: ScreenLayoutProps) {
  const requestExit = useRequestExit();

  return (
    <div
      className={`screen-enter flex h-[100dvh] flex-col overflow-hidden px-6 pt-8 sm:px-8 ${rootClassName}`}
    >
      <header className="mb-6 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-2xl font-medium leading-snug tracking-tight text-text sm:text-3xl">
            {title}
          </h1>
          {showExit && requestExit && (
            <button
              type="button"
              aria-label="Exit"
              onClick={requestExit}
              className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg leading-none text-text-muted transition-colors hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ×
            </button>
          )}
        </div>
      </header>

      <main
        className={`min-h-0 flex-1 overflow-y-auto pb-4 flex flex-col items-stretch ${
          align === "start" ? "justify-start" : "justify-end"
        }`}
      >
        {children}
      </main>

      {footer && (
        <footer className="-mx-6 shrink-0 border-t border-border bg-background/95 px-6 pt-4 pb-10 backdrop-blur sm:-mx-8 sm:px-8">
          {footer}
        </footer>
      )}
    </div>
  );
}