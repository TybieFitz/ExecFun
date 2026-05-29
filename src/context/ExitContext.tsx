import { createContext, useContext, type ReactNode } from "react";

type ExitContextValue = {
  requestExit: () => void;
};

const ExitContext = createContext<ExitContextValue | null>(null);

type ExitProviderProps = {
  children: ReactNode;
  onRequestExit: () => void;
};

export function ExitProvider({ children, onRequestExit }: ExitProviderProps) {
  return (
    <ExitContext.Provider value={{ requestExit: onRequestExit }}>
      {children}
    </ExitContext.Provider>
  );
}

export function useRequestExit() {
  return useContext(ExitContext)?.requestExit;
}
