# Three.js Full Stack Portfolio

Production-ready Next.js portfolio with a Three.js coding-themed frontend, MySQL data model, admin dashboard, media uploads, and Bootstrap modals for repeatable content.

## Setup

1. Copy `.env.example` to `.env.local` and update the MySQL and admin password values.
2. Run `npm install`.
3. Run `npm run db:seed` to create tables and insert starter portfolio data.
4. Run `npm run dev` for local development or `npm run build && npm start` for production.

## Admin

Open `/admin`.

- Intro, About, and Contact are single settings forms.
- Projects, Certificates, Courses, and Education use list view plus create/update/delete confirmation modals.
- Uploads are stored in `public/uploads`.
