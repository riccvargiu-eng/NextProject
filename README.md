# 🎬 FilmPicker — User Story & How It Works

## 📒 User Story

As a user who is unsure which movie to watch, I want to select my favorite movies from a random list and receive a random recommendation from them, so that I can easily decide what to watch without scrolling for hours on streaming sites!

---

## 🛠️ How It Works

- The website displays a card with a single movie, including key information such as the title, description, and trailer.  
  You can choose to **save it to your list** or **skip to the next movie**.

- Once you have created your own list, the website will **randomly select a movie** from your saved favorites.

---

## 🖋️ How to Use

1. **Choose the total number of movies** you want to save to your list. This determines how many movies the filter will propose.
2. **Select the genre and/or rating** of the movies you want to see.
3. **Start browsing the movie cards**. Use the “Save” button to add a movie to your list, or skip to the next one.
4. Once you reach the **number of movies you previously selected**, your list will be complete, and no more movie proposals will appear. You will be redirected to the page showing your **selected movies list**.
5. You can **remove movies** from the list if you change your mind.
6. When you are ready, click the **randomize button**, and the application will **choose a movie for you**!

---

## 📊 Main Features

- Single-scroll movie cards with poster, description, and trailer.
- Save favorite movies to a personal list.
- Random selection from saved movies to help decision-making.
- Filters for genre and rating.
- Ability to remove movies from the list before making the final choice.

---

## 👌 Credits

Thanks to **TMDB** for providing the API necessary for the functionality of this site!

---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
