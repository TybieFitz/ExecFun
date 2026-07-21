import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto min-h-full w-full max-w-lg bg-surface shadow-2xl shadow-black/25 sm:my-4 sm:min-h-[calc(100%-2rem)] sm:overflow-hidden sm:rounded-2xl">
      {children}
    </div>
  );
}
