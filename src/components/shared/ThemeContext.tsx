"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "madhubala-theme";

function getInitialTheme(): Theme {
    if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
        return "dark";
    }
    return "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme);

    const setTheme = useCallback((nextTheme: Theme) => {
        setThemeState(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        document.cookie = `${STORAGE_KEY}=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
        localStorage.setItem(STORAGE_KEY, nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [setTheme, theme]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return context;
}
