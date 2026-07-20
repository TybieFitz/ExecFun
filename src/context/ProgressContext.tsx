import { createContext, useContext, type ReactNode } from "react";

const ProgressContext = createContext<number | null>(null);

type ProgressProviderProps = {
  value: number | null;
  children: ReactNode;
};

export function ProgressProvider({ value, children }: ProgressProviderProps) {
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  return useContext(ProgressContext);
}
