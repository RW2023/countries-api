'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Countries', href: '/countries' },
    { name: 'About', href: '/about' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav
            className="sticky top-0 z-50 shadow-sm border-b transition-colors duration-300"
            style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderColor: 'rgba(0,0,0,0.1)',
            }}
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Site Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                    />
                    <span className="font-bold text-xl">Countries Explorer</span>
                </Link>

                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="font-medium hover:underline transition"
                            style={{ color: 'var(--foreground)' }}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <ThemeToggle />
                </div>

                <button
                    type="button"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    className="lg:hidden p-2"
                    aria-label="Toggle menu"
                    aria-controls="mobile-menu"
                    aria-expanded={mobileOpen ? 'true' : 'false'}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="lg:hidden border-t"
                        style={{
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'rgba(0,0,0,0.1)',
                        }}
                        role="menu"
                        aria-label="Mobile navigation"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block text-lg font-medium hover:underline transition"
                                    role="menuitem"
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
