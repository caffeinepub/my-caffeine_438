import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Rss } from "lucide-react";
import type { RSSItem } from "../hooks/useQueries";
import { useLastFetchTime, useRSSItems } from "../hooks/useQueries";

function getSourceColor(source: string): string {
  if (source.includes("BBC") || source.includes("বিবিসি")) {
    return "bg-blue-600 text-white";
  }
  if (source.includes("প্রথম আলো") || source.includes("Prothom")) {
    return "bg-green-600 text-white";
  }
  if (source.includes("ইত্তেফাক") || source.includes("Ittefaq")) {
    return "bg-orange-500 text-white";
  }
  if (source.includes("আল জাজিরা") || source.includes("Al Jazeera")) {
    return "bg-purple-600 text-white";
  }
  if (source.includes("আমার দেশ") || source.includes("Amar Desh")) {
    return "bg-teal-600 text-white";
  }
  if (source.includes("বাংলা এডিশন") || source.includes("Bangla Edition")) {
    return "bg-indigo-500 text-white";
  }
  return "bg-news-red text-white";
}

// Category-based placeholder images
function getCategoryImage(category: string, id: bigint | number): string {
  const seed = (Number(id) % 30) + 1;
  const categoryImages: Record<string, string> = {
    আন্তর্জাতিক: `https://picsum.photos/seed/intl${seed}/400/225`,
    রাজনীতি: `https://picsum.photos/seed/pol${seed}/400/225`,
    "স্থানীয় খবর": `https://picsum.photos/seed/local${seed}/400/225`,
    "জাতীয় খবর": `https://picsum.photos/seed/natl${seed}/400/225`,
    শিক্ষা: `https://picsum.photos/seed/edu${seed}/400/225`,
    স্বাস্থ্য: `https://picsum.photos/seed/health${seed}/400/225`,
    কৃষি: `https://picsum.photos/seed/agri${seed}/400/225`,
    খেলাধুলা: `https://picsum.photos/seed/sports${seed}/400/225`,
    "ধর্মীয় অনুষ্ঠান": `https://picsum.photos/seed/relig${seed}/400/225`,
  };
  return (
    categoryImages[category] ?? `https://picsum.photos/seed/news${seed}/400/225`
  );
}

function formatFetchTime(nanos: number): string {
  if (!nanos) return "কখনো করা হয়নি";
  const ms = nanos / 1_000_000;
  const date = new Date(ms);
  const bengaliNums: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  const toBn = (n: number) =>
    n
      .toString()
      .split("")
      .map((d) => bengaliNums[d] ?? d)
      .join("");
  const bengaliMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  return `${toBn(date.getDate())} ${bengaliMonths[date.getMonth()]} ${toBn(date.getFullYear())}, ${toBn(date.getHours())}:${toBn(date.getMinutes()).padStart(2, "০")}`;
}

function RSSCard({ item }: { item: RSSItem }) {
  const imgSrc = getCategoryImage(item.category, item.id);
  return (
    <div className="flex flex-col bg-card border border-border rounded-sm hover:border-news-red/30 hover:shadow-md transition-all overflow-hidden">
      {/* News image */}
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x225/e2e8f0/64748b?text=সংবাদ";
          }}
        />
      </div>
      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-sm ${getSourceColor(item.source)}`}
          >
            {item.source}
          </span>
          {item.category && (
            <span className="text-xs text-news-gray bg-muted px-2 py-0.5 rounded-sm">
              {item.category}
            </span>
          )}
          {item.pubDate && (
            <span className="text-xs text-news-gray ml-auto">
              {item.pubDate}
            </span>
          )}
        </div>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-news-charcoal leading-snug line-clamp-2 hover:text-news-red transition-colors"
          data-ocid="rss.link"
        >
          {item.title}
        </a>
        {item.description && (
          <p className="text-xs text-news-gray line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-news-red font-medium hover:underline self-start mt-1"
          data-ocid="rss.link"
        >
          মূল সংবাদ পড়ুন
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function SkeletonRSSCard() {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden space-y-0">
      <Skeleton className="w-full aspect-video" />
      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export default function RSSFeedSection() {
  const { data: items = [], isLoading } = useRSSItems();
  const { data: lastFetch = 0 } = useLastFetchTime();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" data-ocid="rss.section">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-news-red rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-news-charcoal flex items-center gap-2">
              <Rss className="w-5 h-5 text-news-red" />
              সর্বশেষ অনলাইন সংবাদ
            </h2>
            <p className="text-xs text-news-gray">
              সর্বশেষ আপডেট:{" "}
              <span className="font-medium">{formatFetchTime(lastFetch)}</span>
            </p>
          </div>
        </div>
        {lastFetch > 0 && (
          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <RefreshCw className="w-3 h-3" />
            লাইভ ফিড
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="rss.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <SkeletonRSSCard key={k} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-sm bg-muted/30 text-center"
          data-ocid="rss.empty_state"
        >
          <Rss className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-news-charcoal font-medium mb-1">
            অনলাইন সংবাদ ফিড লোড হয়নি
          </p>
          <p className="text-sm text-news-gray max-w-sm">
            অ্যাডমিন প্যানেল থেকে{" "}
            <strong className="text-news-red">নিউজ ফিড রিফ্রেশ করুন</strong> বাটনে
            ক্লিক করুন — বিবিসি বাংলা, প্রথম আলো, ইত্তেফাক ও অন্যান্য উৎস থেকে সংবাদ
            স্বয়ংক্রিয়ভাবে যুক্ত হবে।
          </p>
        </div>
      )}

      {/* RSS items grid */}
      {!isLoading && items.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="rss.list"
        >
          {items.map((item, i) => (
            <div key={Number(item.id)} data-ocid={`rss.item.${i + 1}`}>
              <RSSCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Source attribution */}
      {!isLoading && items.length > 0 && (
        <p className="text-xs text-news-gray text-center mt-6">
          সংবাদ সংগ্রহ: বিবিসি বাংলা • প্রথম আলো • ইত্তেফাক • আমার দেশ • বাংলা এডিশন • আল
          জাজিরা বাংলা — সকল সংবাদের মূল উৎস সংশ্লিষ্ট সংবাদ মাধ্যম।
        </p>
      )}
    </section>
  );
}
