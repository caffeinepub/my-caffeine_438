# Baligaw News - RSS Auto News Feed System

## Current State
A full-stack Bengali news portal (বালিগাঁও নিউজ) with:
- Motoko backend with Article CRUD, categories, breaking news ticker, logo management
- React frontend with hero slider, news grid, category pages, admin panel
- Admin panel with Internet Identity auth (first login = admin)
- Static seed news articles (8 articles, manually curated)
- No automatic news fetching capability
- No news detail page (clicking headline does nothing)

## Requested Changes (Diff)

### Add
- **RSS Feed System**: Backend HTTP outcalls to fetch RSS feeds from:
  - BBC Bangla: https://feeds.bbci.co.uk/bengali/rss.xml
  - Prothom Alo: https://www.prothomalo.com/feed (RSS)
  - Daily Ittefaq: https://www.ittefaq.com.bd/feed
  - Amar Desh: https://www.amardesh.com/feed
  - Al Jazeera Bangla: https://www.aljazeera.com/xml/rss/all.xml (with Bangla filter)
- **RSS Feed Cache**: Backend stores fetched RSS items in a stable var with timestamp; refresh on demand or auto-expire after 30 minutes
- **RSS Feed Article Type**: Separate from manual articles -- RSSArticle includes: title, description, link (source URL), pubDate, source (feed name), category (mapped from feed)
- **News Detail Page** (`/news/:id`): Full article view for manually added news with full content, author, date, category badge, back link
- **RSS Article View**: Clicking RSS item shows summary + prominent "মূল সংবাদ পড়ুন" button linking to source
- **Admin RSS Settings Tab**: View RSS feed sources, trigger manual refresh, toggle feeds on/off
- **Site Settings Tab in Admin**: Site name, tagline, contact email, social links, footer text - stored in backend
- **Auto-refresh indicator**: UI shows last fetch time for RSS feeds

### Modify
- **NewsCard component**: Clicking headline navigates to `/news/:id` (manual) or opens source URL in new tab (RSS)
- **CategoryPage**: Shows both manual articles AND RSS-fetched articles filtered by category, with source badge (e.g., "BBC বাংলা")
- **HomePage**: RSS feed section added below latest news grid, showing recent feed items per category
- **AdminPage**: Add "RSS ফিড" tab and "সাইট সেটিংস" tab
- **backend.mo**: Add RSS fetch function, RSSArticle type, site settings storage
- **Header**: Support dynamic site name and tagline from settings

### Remove
- Static FALLBACK_ARTICLES (replace with real RSS or keep as offline fallback only)
- Hardcoded breaking news seed text (keep as default only if not overridden)

## Implementation Plan

1. **Select** `http-outcalls` component
2. **Backend** (Motoko):
   - Add `SiteSettings` type and storage (siteName, tagline, email, footerText)
   - Add `RSSItem` type: { id, title, description, link, pubDate, source, category, fetchedAt }
   - Add `fetchRSSFeed(url: Text, sourceName: Text, category: Text): async [RSSItem]` using http_request
   - Add `refreshAllFeeds(): async Nat` -- fetches all configured feeds, stores up to 100 items, returns count
   - Add `getRSSItems(): async [RSSItem]` and `getRSSItemsByCategory(category: Text): async [RSSItem]`
   - Add `getLastFetchTime(): async Text`
   - Add `getSiteSettings() / setSiteSettings()` functions
   - Store up to 5 configured feed sources with on/off toggle
3. **Frontend**:
   - Add `/news/:id` route for manual article detail page
   - Add `NewsDetailPage.tsx` -- full content, category, author, date, back button
   - Add `RSSFeedSection.tsx` -- compact list of recent RSS items with source badge and link
   - Update `NewsCard` to be clickable (router link)
   - Update `CategoryPage` to show RSS items alongside manual articles
   - Update `AdminPage`: add RSS settings tab (feeds list, manual refresh button, last fetch time), add site settings tab
   - Update `Header` to optionally use dynamic site name from settings
   - Add `useRSSItems`, `useRefreshFeeds`, `useSiteSettings` hooks
