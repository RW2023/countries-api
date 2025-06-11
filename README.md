# Countries Explorer

A responsive web app to browse and learn about countries around the globe.
Data comes from the REST Countries API, presented with a fast and mobile
friendly interface.

## Features

- **Progressive Web App** via `next-pwa` with offline support.
- **Dark mode** using `next-themes` (light, dark and system).
- **Search and Pagination** to filter and step through results.
- **Smooth animations** powered by Framer Motion and DaisyUI.
- **Accessible and responsive** layout for keyboard and touch users.

## Tech Stack

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 19 with TypeScript
- [Tailwind CSS](https://tailwindcss.com/) and [DaisyUI](https://daisyui.com/)
- [next-pwa](https://github.com/shadowwalker/next-pwa) for PWA features
- [Framer Motion](https://www.framer.com/motion/)

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Create an optimized build:

```bash
npm run build
npm start
```

## Preview

![App screenshot](./public/Screenshot%202025-06-11%20115136.png)

## Deployment

This project is ready for deployment on platforms like
[Vercel](https://vercel.com/). Set `NEXT_PUBLIC_SITE_URL` to the live URL when
fetching data server side.
