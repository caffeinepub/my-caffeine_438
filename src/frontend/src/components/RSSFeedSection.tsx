import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, RefreshCw, Rss, X } from "lucide-react";
import { useState } from "react";
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

// Category-specific Unsplash images (reliable, no API key needed)
const CATEGORY_IMAGE_SETS: Record<string, string[]> = {
  "স্থানীয় খবর": [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=225&fit=crop",
  ],
  "জাতীয় খবর": [
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop",
  ],
  "আন্তর্জাতিক খবর": [
    "https://images.unsplash.com/photo-1476304884326-cd2c88572c5f?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
  ],
  শিক্ষা: [
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=225&fit=crop",
  ],
  স্বাস্থ্য: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=225&fit=crop",
  ],
  কৃষি: [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=225&fit=crop",
  ],
  খেলাধুলা: [
    "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=225&fit=crop",
  ],
  "ধর্মীয় অনুষ্ঠান": [
    "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
    "https://images.unsplash.com/photo-1545259742-56fde9e7dad0?w=400&h=225&fit=crop",
  ],
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=225&fit=crop",
  "https://images.unsplash.com/photo-1476304884326-cd2c88572c5f?w=400&h=225&fit=crop",
];

function getCategoryImage(category: string, id: bigint | number): string {
  const images = CATEGORY_IMAGE_SETS[category] ?? FALLBACK_IMAGES;
  const idx = Number(id) % images.length;
  return images[idx];
}

function formatFetchTime(ms: number): string {
  if (!ms) return "কখনো করা হয়নি";
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

function RSSCard({
  item,
  onSelect,
}: {
  item: RSSItem;
  onSelect: (item: RSSItem) => void;
}) {
  const imgSrc = getCategoryImage(item.category, item.id);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col bg-card border border-border rounded-sm hover:border-news-red/30 hover:shadow-md transition-all overflow-hidden">
      {/* News image */}
      <button
        type="button"
        className="aspect-video overflow-hidden bg-muted w-full cursor-pointer"
        onClick={() => onSelect(item)}
        data-ocid="rss.open_modal_button"
        tabIndex={0}
        aria-label={`সংবাদ পড়ুন: ${item.title}`}
      >
        {!imgError ? (
          <img
            src={imgSrc}
            alt={item.category}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-3xl">📰</span>
          </div>
        )}
      </button>
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
        {/* Title */}
        <button
          type="button"
          className="text-sm font-semibold text-news-charcoal leading-snug line-clamp-2 hover:text-news-red transition-colors text-left cursor-pointer"
          onClick={() => onSelect(item)}
          data-ocid="rss.open_modal_button"
        >
          {item.title}
        </button>
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
          onClick={(e) => e.stopPropagation()}
        >
          মূল সংবাদ পড়ুন
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

function NewsDetailModal({
  item,
  onClose,
}: {
  item: RSSItem | null;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  if (!item) return null;
  const imgSrc = getCategoryImage(item.category, item.id);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-2xl w-full p-0 overflow-hidden"
        data-ocid="rss.dialog"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-sm ${getSourceColor(item.source)}`}
            >
              {item.source}
            </span>
            {item.category && (
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            )}
            {item.pubDate && (
              <span className="text-xs text-news-gray ml-auto">
                {item.pubDate}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-news-charcoal leading-snug text-left">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 pb-6 pt-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
          {/* Image */}
          <div className="w-full aspect-video rounded-sm overflow-hidden bg-muted">
            {!imgError ? (
              <img
                src={imgSrc}
                alt={item.category}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-5xl">📰</span>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description ? (
            <div className="bg-muted/40 rounded-sm p-4 border-l-4 border-news-red">
              <p className="text-sm font-medium text-news-charcoal mb-1">
                সংক্ষিপ্ত বিবরণ
              </p>
              <p className="text-sm text-news-charcoal leading-relaxed">
                {item.description}
              </p>
            </div>
          ) : (
            <div className="bg-muted/40 rounded-sm p-4 border-l-4 border-news-red">
              <p className="text-sm text-news-gray italic">
                বিস্তারিত বিবরণ পাওয়া যায়নি। মূল সংবাদ পড়তে নিচের লিংকে ক্লিক করুন।
              </p>
            </div>
          )}

          {/* Source reference */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-news-gray">সূত্র:</span>
              <span className="text-xs font-semibold text-news-charcoal">
                {item.source}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-news-gray">রেফারেন্স লিংক:</span>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline break-all"
                data-ocid="rss.link"
              >
                {item.link}
              </a>
            </div>
            <div className="flex gap-2 mt-2">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="rss.link"
                className="flex-1"
              >
                <Button
                  size="sm"
                  className="w-full bg-news-red hover:bg-news-red/90 text-white gap-1.5"
                >
                  মূল সংবাদ পড়ুন
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="gap-1.5"
                data-ocid="rss.close_button"
              >
                <X className="w-3.5 h-3.5" />
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);

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
            ক্লিক করুন।
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
              <RSSCard item={item} onSelect={setSelectedItem} />
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

      {/* News Detail Modal */}
      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
