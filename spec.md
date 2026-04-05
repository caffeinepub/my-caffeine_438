# লোকাল নিউজ পোর্টাল

## Current State
New project. Only scaffolded Motoko actor and empty frontend exist.

## Requested Changes (Diff)

### Add
- Motoko backend: news articles CRUD (title, content, category, imageUrl, author, excerpt, date, isBreaking, isSlider, isPublished)
- Motoko backend: categories management (add, remove, list)
- Motoko backend: breaking news text management
- Header with logo, site name, tagline, nav menu with Bengali categories (রাজনীতি, খেলাধুলা, বিনোদন, আন্তর্জাতিক, প্রযুক্তি)
- Breaking news scrolling ticker bar (red background, white text)
- Hero image slider (3-5 slides, full-width, headline overlay, category badge, date, prev/next arrows, dot indicators)
- Latest news responsive card grid (thumbnail, category tag, headline, excerpt, author, date)
- Admin panel at /admin route: add/edit/delete articles, manage categories, update breaking news
- Admin panel fields: title, content, category, imageUrl, author, excerpt, isBreaking toggle, isSlider toggle, isPublished toggle
- Bengali sample data pre-populated in backend
- Full Bengali UI throughout

### Modify
- Nothing existing to modify

### Remove
- Nothing

## Implementation Plan
1. Select `authorization` component for admin panel access control
2. Generate Motoko backend with:
   - Article type with all fields
   - Category list
   - Breaking news text
   - CRUD operations for articles
   - Category add/remove
   - Breaking news update
   - Sample Bengali data seed
3. Build frontend:
   - React Router with `/` (homepage) and `/admin` routes
   - Header component with logo, site name, nav categories
   - BreakingNewsTicker component (CSS marquee/scroll animation)
   - HeroSlider component (auto-advance + manual nav)
   - NewsGrid component (responsive card layout)
   - AdminPanel component (full CRUD UI)
   - Use Tailwind for responsive styling, red accent color scheme
   - Bengali text throughout all UI labels
