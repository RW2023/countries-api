'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-20 bg-base-100 text-base-content">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">Oops! That page doesn&apos;t exist.</p>
            <div className="flex gap-4">
                <button
                    onClick={() => router.back()}
                    className="btn btn-outline"
                >
                    ⬅ Go Back
                </button>
                <Link href="/" className="btn btn-primary">
                    🏠 Go Home
                </Link>
            </div>
        </main>
    );
}
