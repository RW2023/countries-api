// components/PaginationFloating.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Props = {
    page: number;
    totalPages: number;
    onChange: (newPage: number) => void;
};

export default function PaginationFloating({ page, totalPages, onChange }: Props) {
    const [footerVisible, setFooterVisible] = useState(false);

    // ————————————————————————————————————————————
    //  Fade out when the <footer> enters the viewport
    // ————————————————————————————————————————————
    useEffect(() => {
        const footer = document.querySelector("footer");
        if (!footer) return;

        const io = new IntersectionObserver(
            ([entry]) => setFooterVisible(!!entry && entry.isIntersecting),
            { threshold: 0 } // trigger when *any* part of the footer is visible
        );

        io.observe(footer);
        return () => io.disconnect();
    }, []);

    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <nav
            aria-label="Pagination"
            className={clsx(
                "fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4",
                "rounded-full bg-[var(--surface)]/80 px-4 py-2 shadow-lg backdrop-blur",
                "supports-[backdrop-filter]:backdrop-blur-md",
                "transition-opacity duration-300",
                footerVisible && "opacity-0 pointer-events-none"
            )}
        >
            {/* Prev button */}
            <button
                onClick={() => canPrev && onChange(page - 1)}
                disabled={!canPrev}
                aria-label="Previous page"
                className="grid h-10 w-10 place-items-center rounded-full transition
                   hover:ring-2 hover:ring-[var(--accent)]/40
                   disabled:opacity-40 disabled:hover:ring-0"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page indicator */}
            <span className="hidden min-w-[5.5rem] select-none text-sm sm:inline">
                Page <strong>{page}</strong> / {totalPages}
            </span>

            {/* Next button */}
            <button
                onClick={() => canNext && onChange(page + 1)}
                disabled={!canNext}
                aria-label="Next page"
                className="grid h-10 w-10 place-items-center rounded-full transition
                   hover:ring-2 hover:ring-[var(--accent)]/40
                   disabled:opacity-40 disabled:hover:ring-0"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </nav>
    );
}
