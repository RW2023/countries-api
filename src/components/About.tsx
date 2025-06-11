export default function About() {
    return (
        <section className="max-w-3xl mx-auto text-center py-16 px-4">
            <h1 className="text-4xl font-bold mb-4 text-[hsl(var(--foreground))]">
                About This Project
            </h1>
            <p className="text-lg text-[hsl(var(--muted-foreground))] mb-4">
                This app is a simple front-end for visualizing the Countries API. I built it mostly for fun to explore the data, experiment with clean UI design, and practice some backend integration work.
            </p>
            <p className="text-lg text-[hsl(var(--muted-foreground))]">
                It uses Next.js, Tailwind CSS, DaisyUI, and TypeScript. Just for fun for a hands-on way to level up my full-stack dev skills while making something interactive.
            </p>
        </section>
    );
}
  