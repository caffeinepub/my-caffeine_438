import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  Flag,
  Globe,
  Heart,
  MapPin,
  Sprout,
  Star,
  Trophy,
  User,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { RSSItem } from "../hooks/useQueries";
import {
  useArticlesByCategory,
  useRSSItemsByCategory,
} from "../hooks/useQueries";
import { Link, useParams } from "../router";

type CategoryConfig = {
  color: string;
  lightBg: string;
  icon: LucideIcon;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "স্থানীয় খবর": { color: "bg-green-700", lightBg: "bg-green-50", icon: MapPin },
  "জাতীয় খবর": { color: "bg-red-700", lightBg: "bg-red-50", icon: Flag },
  "আন্তর্জাতিক খবর": { color: "bg-blue-700", lightBg: "bg-blue-50", icon: Globe },
  শিক্ষা: { color: "bg-yellow-600", lightBg: "bg-yellow-50", icon: BookOpen },
  স্বাস্থ্য: { color: "bg-teal-600", lightBg: "bg-teal-50", icon: Heart },
  কৃষি: { color: "bg-lime-700", lightBg: "bg-lime-50", icon: Sprout },
  খেলাধুলা: { color: "bg-orange-600", lightBg: "bg-orange-50", icon: Trophy },
  "ধর্মীয় অনুষ্ঠান": {
    color: "bg-purple-700",
    lightBg: "bg-purple-50",
    icon: Star,
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  color: "bg-news-red",
  lightBg: "bg-red-50",
  icon: Flag,
};

function getSourceColor(source: string): string {
  if (source.includes("BBC") || source.includes("বিবিসি"))
    return "bg-blue-600 text-white";
  if (source.includes("প্রথম আলো") || source.includes("Prothom"))
    return "bg-green-600 text-white";
  if (source.includes("ইত্তেফাক") || source.includes("Ittefaq"))
    return "bg-orange-500 text-white";
  if (source.includes("আল জাজিরা") || source.includes("Al Jazeera"))
    return "bg-purple-600 text-white";
  if (source.includes("আমার দেশ") || source.includes("Amar Desh"))
    return "bg-teal-600 text-white";
  return "bg-news-red text-white";
}

// Category-specific picsum.photos images with stable seeds
const CATEGORY_IMAGE_SETS: Record<string, string[]> = {
  "স্থানীয় খবর": [
    "https://picsum.photos/seed/local1/400/225",
    "https://picsum.photos/seed/local2/400/225",
    "https://picsum.photos/seed/local3/400/225",
    "https://picsum.photos/seed/local4/400/225",
  ],
  "জাতীয় খবর": [
    "https://picsum.photos/seed/national1/400/225",
    "https://picsum.photos/seed/national2/400/225",
    "https://picsum.photos/seed/national3/400/225",
    "https://picsum.photos/seed/national4/400/225",
  ],
  "আন্তর্জাতিক খবর": [
    "https://picsum.photos/seed/world1/400/225",
    "https://picsum.photos/seed/world2/400/225",
    "https://picsum.photos/seed/world3/400/225",
    "https://picsum.photos/seed/world4/400/225",
  ],
  শিক্ষা: [
    "https://picsum.photos/seed/edu1/400/225",
    "https://picsum.photos/seed/edu2/400/225",
    "https://picsum.photos/seed/edu3/400/225",
    "https://picsum.photos/seed/edu4/400/225",
  ],
  স্বাস্থ্য: [
    "https://picsum.photos/seed/health1/400/225",
    "https://picsum.photos/seed/health2/400/225",
    "https://picsum.photos/seed/health3/400/225",
    "https://picsum.photos/seed/health4/400/225",
  ],
  কৃষি: [
    "https://picsum.photos/seed/farm1/400/225",
    "https://picsum.photos/seed/farm2/400/225",
    "https://picsum.photos/seed/farm3/400/225",
    "https://picsum.photos/seed/farm4/400/225",
  ],
  খেলাধুলা: [
    "https://picsum.photos/seed/sport1/400/225",
    "https://picsum.photos/seed/sport2/400/225",
    "https://picsum.photos/seed/sport3/400/225",
    "https://picsum.photos/seed/sport4/400/225",
  ],
  "ধর্মীয় অনুষ্ঠান": [
    "https://picsum.photos/seed/religion1/400/225",
    "https://picsum.photos/seed/religion2/400/225",
    "https://picsum.photos/seed/religion3/400/225",
    "https://picsum.photos/seed/religion4/400/225",
  ],
};

const FALLBACK_IMAGES = [
  "https://picsum.photos/seed/news1/400/225",
  "https://picsum.photos/seed/news2/400/225",
  "https://picsum.photos/seed/news3/400/225",
];

function getCategoryImage(category: string, id: bigint | number): string {
  const images = CATEGORY_IMAGE_SETS[category] ?? FALLBACK_IMAGES;
  const idx = Number(id) % images.length;
  return images[idx];
}

// ─── RSS Card with click-to-open modal ────────────────────────────────────────
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
      {/* Clickable image */}
      <button
        type="button"
        className="aspect-video overflow-hidden bg-muted w-full cursor-pointer"
        onClick={() => onSelect(item)}
        aria-label={`সংবাদ পড়ুন: ${item.title}`}
        data-ocid="category.open_modal_button"
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
          {item.pubDate && (
            <span className="text-xs text-news-gray ml-auto">
              {item.pubDate}
            </span>
          )}
        </div>
        {/* Clickable title */}
        <button
          type="button"
          className="text-sm font-semibold text-news-charcoal leading-snug line-clamp-2 hover:text-news-red transition-colors text-left cursor-pointer"
          onClick={() => onSelect(item)}
          data-ocid="category.open_modal_button"
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
          onClick={(e) => e.stopPropagation()}
        >
          মূল সংবাদ পড়ুন
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─── News Detail Modal ────────────────────────────────────────────────────────
function NewsDetailModal({
  item,
  onClose,
}: {
  item: RSSItem | null;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isOpen = item !== null;
  const imgSrc = item ? getCategoryImage(item.category, item.id) : "";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl w-full p-0 overflow-hidden"
        data-ocid="category.dialog"
      >
        {item && (
          <>
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

              {/* Source + reference */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-news-gray">সূত্র:</span>
                  <span className="text-xs font-semibold text-news-charcoal">
                    {item.source}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-news-gray shrink-0">
                    রেফারেন্স লিংক:
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {item.link}
                  </a>
                </div>
                <div className="flex gap-2 mt-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    data-ocid="category.close_button"
                  >
                    <X className="w-3.5 h-3.5" />
                    বন্ধ করুন
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const category = decodeURIComponent(name || "");
  const { data: articles, isLoading: articlesLoading } =
    useArticlesByCategory(category);
  const { data: rssItems = [], isLoading: rssLoading } =
    useRSSItemsByCategory(category);
  const [selectedItem, setSelectedItem] = useState<RSSItem | null>(null);

  const config = CATEGORY_CONFIG[category] ?? DEFAULT_CONFIG;
  const CategoryIcon = config.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="category.page">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-sm text-news-gray mb-6"
        aria-label="breadcrumb"
      >
        <Link
          to="/"
          className="hover:text-news-red transition-colors"
          data-ocid="category.link"
        >
          হোম
        </Link>
        <span>/</span>
        <span className="text-news-charcoal font-medium">{category}</span>
      </nav>

      {/* Section header */}
      <div
        className={`flex items-center gap-4 mb-8 p-5 rounded-lg ${config.lightBg} border-l-4 ${config.color.replace("bg-", "border-")}`}
      >
        <div
          className={`${config.color} text-white w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0`}
        >
          <CategoryIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-news-charcoal">{category}</h1>
          <p className="text-sm text-news-gray">{category} বিভাগের সকল সংবাদ</p>
        </div>
      </div>

      {/* Manual articles from backend */}
      {articlesLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          data-ocid="category.loading_state"
        >
          {["c1", "c2", "c3"].map((k) => (
            <div
              key={k}
              className="bg-card rounded-sm overflow-hidden shadow-card border border-border"
            >
              <Skeleton className="w-full aspect-video" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!articlesLoading &&
        articles &&
        articles.length === 0 &&
        rssItems.length === 0 && (
          <div
            className="text-center py-16 text-news-gray"
            data-ocid="category.empty_state"
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.lightBg} mb-4`}
            >
              <CategoryIcon className="w-8 h-8 text-news-gray" />
            </div>
            <p className="text-xl mb-2">কোনো সংবাদ পাওয়া যায়নি</p>
            <p className="text-sm">এই বিভাগে এখনো কোনো সংবাদ প্রকাশিত হয়নি।</p>
          </div>
        )}

      {!articlesLoading && articles && articles.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
          data-ocid="category.list"
        >
          {articles.map((article, i) => (
            <article
              key={Number(article.id)}
              className="news-card bg-card rounded-sm overflow-hidden shadow-card border border-border flex flex-col"
              data-ocid={`category.item.${i + 1}`}
            >
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/800x450/c0392b/white?text=দেশের+খবর";
                  }}
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <span
                  className={`inline-block ${config.color} text-white text-xs font-bold px-2 py-0.5 rounded-sm mb-2 self-start`}
                >
                  {article.category}
                </span>
                <Link
                  to={`/news/${Number(article.id)}`}
                  className="text-base font-bold text-news-charcoal leading-snug mb-2 line-clamp-2 hover:text-news-red transition-colors"
                  data-ocid={`category.link.${i + 1}`}
                >
                  {article.title}
                </Link>
                <p className="text-sm text-news-gray line-clamp-2 flex-1 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-news-gray border-t border-border pt-2 mt-auto">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* RSS feed items for this category */}
      {(rssLoading || rssItems.length > 0) && (
        <div data-ocid="category.section">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-1 h-6 ${config.color} rounded-full`} />
            <h2 className="text-xl font-bold text-news-charcoal">
              অনলাইন সংবাদ ফিড
            </h2>
          </div>

          {rssLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((k) => (
                <div
                  key={k}
                  className="bg-card border border-border rounded-sm overflow-hidden"
                >
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!rssLoading && rssItems.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="category.list"
            >
              {rssItems.map((item, i) => (
                <div key={Number(item.id)} data-ocid={`category.item.${i + 1}`}>
                  <RSSCard
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail modal — always rendered, controlled by selectedItem state */}
      <NewsDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
