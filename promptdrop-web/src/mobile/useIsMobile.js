import { useEffect, useState } from "react";

// True on phone-sized screens. Reactive to rotation / resize.
export function useIsMobile(bp = 860) {
  const q = `(max-width:${bp}px)`;
  const [m, setM] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const h = (e) => setM(e.matches);
    mq.addEventListener ? mq.addEventListener("change", h) : mq.addListener(h);
    setM(mq.matches);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", h) : mq.removeListener(h); };
  }, [q]);
  return m;
}
