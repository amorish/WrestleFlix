# WrestleFlix

WrestleFlix is a React based web application that serves as a curated catalog for the greatest professional wrestling matches of all time. It provides users with a premium, modern interface to browse historical classics, highly rated encounters, and unforgettable experiences across major wrestling promotions like NJPW, WWE, AEW, and WCW.

![WrestleFlix Preview](./src/assets/hero.png)

## Features

* Curated Match Catalog: Browse a comprehensive database of legendary wrestling matches.
* Dynamic Video Integration: Directly watch full matches via integrated YouTube and Dailymotion video players within a custom modal.
* Multi Part Match Support: Seamlessly watch matches that are split across multiple videos. Dailymotion embeds feature intelligent auto advance capabilities that instantly start the next part when one finishes.
* VK Platform Support: Specialized UI fallbacks for matches hosted on VK.com.
* Advanced Filtering & Sorting: Quickly find specific matches using a live search bar, promotion filters, sort by rating options, and a Decade filter (80s, 90s, 00s, 10s, 20s).
* Responsive & Premium Design: A highly polished user interface featuring fluid micro animations, horizontal scroll carousels, custom star ratings, dynamic hero banners, and modern typography optimized for both desktop and mobile.
* SEO Optimized: Fully configured with rich meta tags, Open Graph cards, Twitter cards, and sitemaps for maximum search engine visibility.

## Tech Stack

* Framework: React with TypeScript
* Build Tool: Vite
* Styling: Vanilla CSS with custom layouts and variables
* Icons: Lucide React

## Project Structure

The codebase is strictly organized to ensure maintainability:

* src/components/
  * VideoModal.tsx: A robust modal handling embedded playback, multi part state logic, and external viewing links.
  * FilterSortBar.tsx: Provides comprehensive UI controls for searching, decade filtering, and sorting.
  * HeroBanner.tsx: Dynamic feature banner highlighting the top match.
  * MatchRow.tsx: Horizontal scrolling carousels for promotion specific matches.
  * DetailedMatchCard.tsx: Grid based match cards with context and custom star ratings.
* src/data/: Contains matches.json, the static database powering the app.
* scripts/scraper/: The foundational Python scripts used to initially scrape Wikipedia, YouTube, and Dailymotion to build the database and download thumbnails.

## Local Development

To run this project locally, ensure you have Node.js installed.

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployment

WrestleFlix is fully optimized and configured for seamless deployment on Vercel.

```bash
npx vercel --prod
```
