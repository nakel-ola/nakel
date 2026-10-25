import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Lagos",
  hour: "2-digit",
  minute: "2-digit",
});

/** Live wall-clock time in Lagos. Renders a placeholder until mounted to avoid hydration drift. */
export const LagosClock = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(format.format(new Date()));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"}</span>;
};
