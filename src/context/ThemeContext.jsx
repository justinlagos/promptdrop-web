import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabaseClient.js";

const Ctx = createContext(null);
export const useTheme = () => useContext(Ctx);

const KEY = "pd.theme"; // 'light' | 'dark' | 'system'
function systemDark() { return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; }
function resolve(pref) { return pref === "system" ? (systemDark() ? "dark" : "light") : pref; }
function apply(pref) {
  const r = resolve(pref);
  try { document.documentElement.setAttribute("data-theme", r); } catch (e) {}
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => { try { return localStorage.getItem(KEY) || "system"; } catch { return "system"; } });

  // apply immediately and whenever it changes
  useEffect(() => { apply(theme); }, [theme]);

  // follow system changes while in system mode
  useEffect(() => {
    if (theme !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const fn = () => apply("system");
    mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", fn) : mq.removeListener(fn); };
  }, [theme]);

  // for signed-in users, the cloud preference is the source of truth across devices
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!supabase) return;
      const { data: u } = await supabase.auth.getUser();
      if (!alive || !u?.user) return;
      const { data } = await supabase.from("user_settings").select("theme").eq("user_id", u.user.id).maybeSingle();
      if (alive && data?.theme && data.theme !== theme) { setThemeState(data.theme); try { localStorage.setItem(KEY, data.theme); } catch {} }
    })();
    return () => { alive = false; };
  }, []);

  const setTheme = useCallback(async (pref) => {
    setThemeState(pref);
    try { localStorage.setItem(KEY, pref); } catch {}
    apply(pref);
    if (supabase) {
      const { data: u } = await supabase.auth.getUser();
      if (u?.user) { try { await supabase.from("user_settings").upsert({ user_id: u.user.id, theme: pref }, { onConflict: "user_id" }); } catch (e) {} }
    }
  }, []);

  return <Ctx.Provider value={{ theme, resolved: resolve(theme), setTheme }}>{children}</Ctx.Provider>;
}
