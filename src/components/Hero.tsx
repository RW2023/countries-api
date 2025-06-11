'use client';

import Link from 'next/link';
import { Globe2 } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center transition-colors duration-300 bg-[var(--background)] text-[var(--foreground)]">
            {/* icon */}
            <div className="flex justify-center mb-4">
                <Globe2 className="w-12 h-12 text-[var(--accent)]" />
            </div>

            {/* headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                Explore the Countries of the World
            </h1>

            {/* sub-copy */}
            <p className="text-lg md:text-xl opacity-80 max-w-xl mb-8">
                Discover facts, flags, and more for every country on Earth. Search by name, region, or population.
            </p>

            {/* call-to-action */}
            <Link href="/countries">
                <button className="btn btn-primary text-base">Browse Countries</button>
            </Link>
        </section>
    );
}
