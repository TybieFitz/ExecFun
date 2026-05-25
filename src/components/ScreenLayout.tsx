import type { ReactNode } from "react";

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  align?: "center" | "start";
};

export function ScreenLayout({
  title,
  children,
  footer,
  align = "center",
}: ScreenLayoutProps) {
  return (
    <div className="screen-enter flex min-h-full flex-col px-6 py-10 sm:px-8">
      <header className="mb-10">
        <h1 className="text-2xl font-medium leading-snug tracking-tight text-text sm:text-3xl">
          {title}
        </h1>
      </header>

      <main
        className={`flex flex-1 flex-col ${align === "start" ? "justify-start" : "justify-center"}`}
      >
        {children}
      </main>

      {footer && <footer className="mt-12 pt-4">{footer}</footer>}
    </div>
  );
}
