import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

export type Side = "nunu" | "you";

type MatchState = {
  score: Record<Side, number>;
  /** Set when a game is won; cleared when the next one starts. */
  winner: Side | null;
  point: (side: Side) => void;
  reset: () => void;
};

export const GAME_TO = 5;

const MatchContext = createContext<MatchState>({
  score: { nunu: 0, you: 0 },
  winner: null,
  point: () => {},
  reset: () => {},
});

/** Score of the hero mini-game, shared with the pinned scoreboard. */
export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState<Record<Side, number>>({ nunu: 0, you: 0 });
  const [winner, setWinner] = useState<Side | null>(null);

  const point = useCallback((side: Side) => {
    setScore((s) => {
      const next = { ...s, [side]: s[side] + 1 };
      if (next[side] >= GAME_TO) setWinner(side);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setScore({ nunu: 0, you: 0 });
    setWinner(null);
  }, []);

  const value = useMemo(() => ({ score, winner, point, reset }), [score, winner, point, reset]);
  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};

export const useMatch = () => useContext(MatchContext);
