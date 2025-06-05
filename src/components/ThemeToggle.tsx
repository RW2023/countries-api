'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';

const modes = ['light', 'dark', 'system'] as const;
type Mode = typeof modes[number];

export default function ThemeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [currentMode, setCurrentMode] = useState<Mode>('system');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && theme) {
            setCurrentMode(theme as Mode);
        }
    }, [theme, mounted]);

    if (!mounted) return null;

    const actualTheme = currentMode === 'system' ? systemTheme : currentMode;
    const Icon = currentMode === 'system' ? Laptop : actualTheme === 'dark' ? Moon : Sun;

    const handleToggle = () => {
        const nextIndex = (modes.indexOf(currentMode) + 1) % modes.length;
        const nextTheme = modes[nextIndex];
        setTheme(nextTheme);
        setCurrentMode(nextTheme);
    };

    return (
        <button
            onClick={handleToggle}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-gray-300 dark:border-gray-600 transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}
