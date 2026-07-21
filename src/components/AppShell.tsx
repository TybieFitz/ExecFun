import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto h-full min-h-0 w-full max-w-lg overflow-hidden bg-surface shadow-2xl shadow-black/25 sm:my-4 sm:h-[calc(100%-2rem)] sm:rounded-2xl">
      {children}
    </div>
  );
}
