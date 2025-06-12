# 🌍 Countries Explorer

**Countries Explorer** is a modern, mobile-first web app to discover countries from around the world. Built with [Next.js 15](https://nextjs.org/) and styled using [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/), it offers a smooth, responsive experience that works offline and adapts to user preferences like dark mode.

> ✨ This project is for fun and learning — it visualizes data from the REST Countries API and showcases full-stack skills including PWA features, animation, and clean component architecture.

---

## 🔍 Features

* **⚡ Progressive Web App (PWA)**
  Offline-first support with automatic caching, powered by `next-pwa`.

* **🌃 Dark Mode Support**
  Toggle between light, dark, and system themes via `next-themes`.

* **🔎 Search, Filter & Pagination**
  Intuitive country search with real-time filtering and paginated results.

* **🎮 Motion & UI Polish**
  Framer Motion and DaisyUI power smooth transitions and accessible UI.

* **📱 Fully Responsive & Accessible**
  Optimized for mobile, desktop, keyboard, and screen reader users.

---

## 🛠️ Tech Stack

* [Next.js](https://nextjs.org/) 15
* [React](https://react.dev/) 19 with TypeScript
* [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) for rapid, themeable UI
* [Framer Motion](https://www.framer.com/motion/) for animation
* [next-pwa](https://github.com/shadowwalker/next-pwa) for PWA enhancements

---

## 🗂️ Project Structure

```bash
.
├── app/                    # App directory for routing (App Router)
│   ├── about/             # About page route
│   ├── country/           # Dynamic country detail pages
│   └── page.tsx          # Homepage listing countries
├── components/            # Reusable UI components
│   ├── CountryCard.tsx    # Card for displaying country info
│   ├── ThemeToggle.tsx    # Light/dark mode toggle
│   └── SearchBar.tsx      # Input for searching countries
├── lib/                   # Utilities and API functions
│   └── fetchCountries.ts  # REST Countries API integration
├── public/                # Static assets (favicons, screenshots)
├── styles/                # Global styles and variables
│   └── globals.css        # Tailwind + custom CSS
├── next.config.js         # Next.js configuration (with PWA + image domains)
├── tailwind.config.ts     # Tailwind + DaisyUI config
└── tsconfig.json          # TypeScript config
```

---

## 📂 Getting Started

Clone the repo and install dependencies:

```bash
npm install
npm run dev
```

Build and start production server:

```bash
npm run build
npm start
```

---

## 📅 Preview

![App screenshot]("https://www.ryan-w.dev/projects/countries.png")

## ✨ Inspiration & Purpose

This project was built to sharpen skills in:

* API integration & client/server rendering with Next.js
* Theming with custom CSS variables and DaisyUI
* Mobile-first UX with accessibility in mind

🎓 All to aid in learning how to build beautiful, responsive web apps with real data!
