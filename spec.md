# Baligaw News

## Current State
- News portal with RSS feed, categories, admin panel
- RSSFeedSection.tsx has image + modal code, but Unsplash images fail to load due to CORS/hotlinking restrictions
- CategoryPage.tsx has RSSCard + NewsDetailModal, same issue
- useRefreshFeeds() only re-saves static sample data — no real RSS fetch
- Modal code exists but images fail silently, causing user confusion

## Requested Changes (Diff)

### Add
- RSS CORS proxy fetch in useRefreshFeeds() — try to fetch from allorigins.win proxy for real news
- New refreshed sample items with updated timestamps when RSS proxy fails
- Working news images using picsum.photos with category-specific seeds (guaranteed to load)

### Modify
- useRefreshFeeds() — attempt real RSS fetch via CORS proxy, fallback to refreshed sample data with new timestamps
- getCategoryImage() — use picsum.photos with deterministic seeds (no CORS issues)
- Ensure NewsDetailModal renders correctly in both RSSFeedSection and CategoryPage
- Add timestamp to refresh so news appears "new" each time

### Remove
- Unsplash URLs (they fail due to hotlink protection)

## Implementation Plan
1. Replace all Unsplash URLs with picsum.photos URLs (category-specific seeds, always load)
2. Update useRefreshFeeds() to fetch RSS via allorigins.win CORS proxy, parse XML, extract real items; fallback to refreshed sample data with new IDs/timestamps if proxy fails
3. Verify NewsDetailModal is properly triggered from both RSSFeedSection and CategoryPage
4. Validate and deploy
