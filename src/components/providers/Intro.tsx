import { createContext, ReactNode, useContext, useState } from "react";

type IntroState = { done: boolean; finish: () => void };

const IntroContext = createContext<IntroState>({ done: true, finish: () => {} });

/** Tracks whether the first-load preloader has finished, so sections can start their entrances. */
export const IntroProvider = ({ children }: { children: ReactNode }) => {
  const [done, setDone] = useState(false);
  return (
    <IntroContext.Provider value={{ done, finish: () => setDone(true) }}>
      {children}
    </IntroContext.Provider>
  );
};

export const useIntro = () => useContext(IntroContext);
