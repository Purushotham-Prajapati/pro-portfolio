"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <motion.button
            type="button"
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            aria-pressed={isDark}
            onClick={toggleTheme}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.94 }}
            className="theme-toggle"
        >
            <motion.span
                className="theme-toggle__thumb"
                layout
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, rotate: isDark ? -45 : 45, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                >
                    {isDark ? <Moon size={15} /> : <Sun size={15} />}
                </motion.span>
            </motion.span>
            <span className="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
        </motion.button>
    );
}
