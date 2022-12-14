#### Database Setup

`npx prisma migrate dev --name <name of migration>`
to generate and apply migrations in development. [Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production)

To reset the database:
`npx prisma migrate reset`


Build Instructions

```
npm install @prisma/client
prisma generate
```

### Route Making

Restricted route making:
[https://next-auth.js.org/getting-started/example#backend---api-route](https://next-auth.js.org/getting-started/example#backend---api-route)

### Troubleshooting

If postgres crashes locally:

```
cd Library/Application\ Support/Postgres
ls
## copy var-* number

## e.g. var-15
rm var-15/postmaster.pid
```

-----

#### Assets

* https://thenounproject.com/icon/cardio-workout-2224734/

* [Animations](https://www.fiverr.com/fitness_videos/create-an-animated-character-doing-exercises?utm_source=google&utm_medium=cpc&utm_campaign=g_ge-us_ln-en_dv-desktop_cat-video-animation_cst-dsa_static-gig-page-feed&utm_term=us_dsa_static-feed_character_animation_desktop&utm_content=AdID%5e517667159261%5eKeyword%5e%5ePlacement%5e%5eDevice%5ec&caid=12874323001&agid=119381937577&ad_id=517667159261&kw=&lpcat=br_general&&cq_src=google_ads&cq_cmp=12874323001&cq_term=&cq_plac=&cq_net=g&cq_plt=gp&gclid=CjwKCAjwtp2bBhAGEiwAOZZTuNeRntbqfAIShH3QHD0f5RL8GXhJeTxXFXAZhTyuoYXwZO1wW_1x3xoCGMsQAvD_BwE&gclsrc=aw.ds)
-----


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
