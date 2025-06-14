export default function Footer(){
    return (
        <footer
            className="bg-[var(--background)] text-[var(--foreground)] py-6 mt-10 border-t border-[var(--foreground)]/10">
            <div className="max-w-5xl mx-auto px-4 text-center">
                <p className="text-sm opacity-70">
                    &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
                </p>
                <p className="text-xs mt-2">
                    Built with ❤️ using Next.js and Tailwind CSS.
                </p>
            </div>
        </footer>
    )
}