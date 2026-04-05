# Baligaw News - Category-Based News Sections

## Current State
- Header has 7 old categories: রাজনীতি, খেলাধুলা, বিনোদন, আন্তর্জাতিক, প্রযুক্তি, অর্থনীতি, স্বাস্থ্য
- CategoryPage exists with manual articles + RSS feed section
- HomePage has HeroSlider, NewsGrid, RSSFeedSection
- Router handles `/category/:name` already

## Requested Changes (Diff)

### Add
- 8 new categories in Header navigation: স্থানীয় খবর, জাতীয় খবর, আন্তর্জাতিক খবর, শিক্ষা, স্বাস্থ্য, কৃষি, খেলাধুলা, ধর্মীয় অনুষ্ঠান
- Homepage category preview sections: show 3-4 latest news per category with "আরও দেখুন" link to category page
- CategoryPage improvements: better layout, category icon/color per category, breadcrumb navigation

### Modify
- Header NAV_CATEGORIES: replace old list with new 8 categories
- HomePage: add category preview sections below the main news grid
- CategoryPage: add category-specific colors and better empty state

### Remove
- Old navigation categories: রাজনীতি, বিনোদন, প্রযুক্তি, অর্থনীতি (replaced by new set)

## Implementation Plan
1. Update Header.tsx NAV_CATEGORIES to the 8 new categories
2. Update CategoryPage.tsx with category-specific colors/icons and improved layout
3. Create CategoryPreviewSection component for homepage
4. Update HomePage.tsx to include category preview sections
5. Validate build
