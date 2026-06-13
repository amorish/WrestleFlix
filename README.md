# WrestleFlix

WrestleFlix is a React based web application that serves as a curated catalog for professional wrestling matches. It provides users with a modern interface to browse historical classics, highly rated encounters, and unforgettable experiences across major wrestling promotions.

## Features

* Curated Match Catalog: Browse a comprehensive database of wrestling matches sorted by promotions, dates, and ratings.
* Dynamic Video Integration: Directly watch full matches via integrated YouTube and Dailymotion video players within a custom modal.
* Responsive Design: A premium user interface featuring fluid animations, custom star ratings, and modern typography optimized for both desktop and mobile viewing.
* Filtering and Sorting: Quickly find specific matches using the dedicated search bar, promotion filters, and rating based sorting options.

## Tech Stack

* Framework: React with TypeScript
* Build Tool: Vite
* Styling: Vanilla CSS with custom layouts
* Icons: Lucide React

## Project Structure

The codebase is organized into modular components to ensure maintainability and strict separation of concerns.

* src/components
  * DetailedMatchCard.tsx: Renders individual match information in a detailed list view, including the custom star rating system.
  * FilterSortBar.tsx: Provides UI controls for searching, filtering by promotion, and sorting matches.
  * HeroBanner.tsx: Displays the featured match at the top of the application with a spatial layout.
  * MatchRow.tsx: Organizes matches into horizontal scrolling categories.
  * VideoModal.tsx: A dedicated modal component handling embedded video playback and external viewing links.
* src/data: Contains the static JSON data source powering the application.
* src/assets: Houses all static assets, layout images, and promotion logos.
* src/types.ts: Defines shared TypeScript interfaces for match data structures.
* src/utils.ts: Utility functions for generating thumbnails and formatting data.

## Local Development

To run this project locally, ensure you have Node.js installed.

1. Install the dependencies using npm:
   npm install

2. Start the development server:
   npm run dev

The application will be accessible at the local URL provided in your terminal output.

## Deployment

This application is configured for deployment on Vercel. You can deploy updates directly by connecting the repository to Vercel or by using the Vercel CLI:

npx vercel --prod
