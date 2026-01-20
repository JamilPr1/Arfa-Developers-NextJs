# Deployment Guide - Arfa Developers Website

## Quick Start

This Next.js website is ready for Vercel deployment. Follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 3. Build for Production

```bash
npm run build
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

#### Option B: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will automatically detect Next.js and configure the build settings
6. Click "Deploy"

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page with all sections
│   ├── globals.css         # Global styles
│   ├── loading.tsx         # Loading component
│   └── not-found.tsx       # 404 page
├── components/
│   ├── Header.tsx         # Navigation bar
│   ├── Hero.tsx           # Hero section
│   ├── Services.tsx       # Services section
│   ├── Portfolio.tsx     # Portfolio with carousel
│   ├── About.tsx         # Team section
│   ├── Testimonials.tsx  # Client reviews
│   ├── Blog.tsx          # Blog posts
│   ├── CTA.tsx           # Contact form
│   ├── Footer.tsx        # Footer
│   ├── ThemeProvider.tsx # MUI theme
│   └── AOSInit.tsx       # Animation setup
├── styles/
│   └── slick-custom.css  # Custom carousel styles
├── public/               # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── next.config.js        # Next.js config
└── vercel.json          # Vercel deployment config
```

## Features

✅ **Modern UI** - Material-UI components with custom theme
✅ **Animations** - Framer Motion and AOS for smooth animations
✅ **Responsive** - Mobile-first design, fully responsive
✅ **Performance** - Optimized with Next.js 14
✅ **SEO Ready** - Proper meta tags and semantic HTML
✅ **TypeScript** - Full type safety
✅ **Carousels** - React Slick for portfolio and testimonials
✅ **Forms** - Contact form with validation

## Customization

### Update Content

- **Team Members**: Edit `components/About.tsx`
- **Services**: Edit `components/Services.tsx`
- **Portfolio**: Edit `components/Portfolio.tsx`
- **Testimonials**: Edit `components/Testimonials.tsx`
- **Blog Posts**: Edit `components/Blog.tsx`

### Change Colors/Theme

Edit `components/ThemeProvider.tsx` to customize the Material-UI theme.

### Add Images

Place images in the `public/` directory and reference them as `/image-name.jpg`.

## Environment Variables

Currently, no environment variables are required. If you need to add:
- API endpoints
- Third-party service keys
- Analytics IDs

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Clear `.next` folder: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`

### Carousel Not Working

The carousel uses dynamic imports to avoid SSR issues. If problems persist, ensure `react-slick` and `slick-carousel` are installed.

### Animation Issues

AOS animations initialize on client-side only. If animations don't appear, check browser console for errors.

## Support

For issues or questions, check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Vercel Documentation](https://vercel.com/docs)
