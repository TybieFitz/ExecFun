import type { ReactNode } from "react";

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  align?: "center" | "start";
  /** Merged onto the root container (e.g. transient screen tones). */
  rootClassName?: string;
};

export function ScreenLayout({
  title,
  children,
  footer,
  align = "center",
  rootClassName = "",
}: ScreenLayoutProps) {
  return (
    <div
      className={`screen-enter flex h-[100dvh] flex-col overflow-hidden px-6 pt-8 sm:px-8 ${rootClassName}`}
    >
      <header className="mb-6 shrink-0">
        <h1 className="text-2xl font-medium leading-snug tracking-tight text-text sm:text-3xl">
          {title}
        </h1>
      </header>

      <main
        className={`min-h-0 flex-1 overflow-y-auto pb-4 ${
          align === "start"
            ? "flex flex-col justify-start"
            : "flex flex-col justify-end"
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