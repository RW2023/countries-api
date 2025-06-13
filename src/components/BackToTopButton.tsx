"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function BackToTopButton() {
    const [show, setShow] = useState(false);

    // Show when scrolled down
    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY > 300);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleClick}
                    aria-label="Back to top"
                    className="fixed bottom-20 right-4 z-40 sm:bottom-20 sm:right-4
                     md:right-6 p-2 rounded-full bg-[var(--surface)] text-[var(--accent)]
                     shadow-lg ring-1 ring-[var(--border)] backdrop-blur
                     hover:bg-[var(--accent)] hover:text-[var(--background)]
                     transition duration-200 sm:block md:block lg:hidden"
                >
                    <ChevronUp className="w-5 h-5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
