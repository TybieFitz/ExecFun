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
  /** Vertically center header + main together (Welcome only). */
  centerHeaderAndContent?: boolean;
  /** Optional override for title typography (Welcome only). */
  titleClassName?: string;
  /** Vertically center main content above the footer (task menu). */
  centerMainContent?: boolean;
};

export function ScreenLayout({
  title,
  children,
  footer,
  align = "center",
  rootClassName = "",
  showExit = true,
  centerHeaderAndContent = false,
  titleClassName = "",
  centerMainContent = false,
}: ScreenLayoutProps) {
  const requestExit = useRequestExit();

  const header = (
    <header className="relative mb-6 shrink-0">
      {showExit && requestExit && (
        <button
          type="button"
          aria-label="Exit"
          onClick={requestExit}
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-lg text-lg leading-none text-text-muted transition-colors hover:bg-surface-raised hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ×
        </button>
      )}
      <h1
        className={`text-center text-2xl font-medium leading-snug tracking-tight text-text sm:text-3xl ${
          showExit && requestExit ? "px-10" : ""
        } ${titleClassName}`}
      >
        {title}
      </h1>
    </header>
  );

  const main = (
    <main
      className={`flex flex-col items-stretch pb-4 ${
        centerHeaderAndContent
          ? "shrink-0"
          : centerMainContent
            ? "min-h-0 flex-1 overflow-y-auto justify-center"
            : `min-h-0 flex-1 overflow-y-auto ${
                align === "start" ? "justify-start" : "justify-end"
              }`
      }`}
    >
      {children}
    </main>
  );

  return (
    <div
      className={`screen-enter flex h-[100dvh] flex-col overflow-hidden px-6 pt-8 sm:px-8 ${rootClassName}`}
    >
      {centerHeaderAndContent ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          {header}
          {main}
        </div>
      ) : (
        <>
          {header}
          {main}
        </>
      )}

      {footer && (
        <footer className="-mx-6 shrink-0 border-t border-border bg-background/95 px-6 pt-4 pb-10 backdrop-blur sm:-mx-8 sm:px-8">
          {footer}
        </footer>
      )}
    </div>
  );
}