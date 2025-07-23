# sfaMart Web App

A modern, responsive boutique web application built with Next.js, TypeScript, Prisma, Supabase, and shadcn/ui. This project is designed for retail businesses to manage products, categories, transactions, and more, with a beautiful and intuitive interface.

## Features

- **Product Management**: Add, edit, delete, and display products with images, prices, ratings, and sales data.
- **Category Management**: Organize products by category for easy browsing and filtering.
- **Transaction Table**: View all transactions in a shadcn-styled table, with item details in a dialog.
- **Image Upload**: Upload product images using Supabase Storage.
- **Responsive UI**: Fully responsive layout using Tailwind CSS and shadcn/ui components.
- **Hero & Guarantee Sections**: Modern homepage with hero banner and guarantee/why choose us section.
- **Prisma ORM**: PostgreSQL database integration with cascade delete and best practices.
- **Supabase Integration**: Secure image storage and retrieval.
- **Lucide Icons**: Clean, modern icons for UI elements.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL (Neon)
- **Storage**: Supabase Storage
- **Icons**: Lucide

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/point-of-sale.git
   cd point-of-sale
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Setup environment variables**
   - Copy `.env.example` to `.env.local` and fill in your Supabase and database credentials.
4. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. **Open in browser**
   - Visit `http://localhost:3000`

## Folder Structure

- `app/` - Next.js app directory (pages, API routes, dashboard, etc.)
- `components/` - Reusable UI components (forms, cards, dialogs, etc.)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and Prisma actions
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets (images, icons)

## Customization

- Update hero images and product images in the `public/` folder.
- Modify UI components in `components/` for branding and style.
- Extend database models in `prisma/schema.prisma` as needed.

## License

MIT

---

Made with ❤️ using Next.js, Prisma, Supabase, and shadcn/ui.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
