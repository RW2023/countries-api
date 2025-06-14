export default function Footer(){
    return (
        <footer
            className="bg-[var(--background)] text-[var(--foreground)] py-6 mt-10 border-t border-[var(--foreground)]/10">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <p className="text-sm opacity-70">
                    &copy; {new Date().getFullYear()} <a href="https://www.ryan-w.dev/about" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--accent)]">Ryan Wilson</a>. All rights reserved.
                </p>
                <p className="text-xs mt-2">
                    Built for fun with ❤️ using Next.js, Tailwind CSS, and the REST Countries API.
                </p>
            </div>
        </footer>
    )
}