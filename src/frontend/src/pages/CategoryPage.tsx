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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

// Category-based placeholder images for RSS items
function getCategoryImage(category: string, id: bigint | number): string {
  const seed = (Number(id) % 30) + 1;
  const categoryImages: Record<string, string> = {
    আন্তর্জাতিক: `https://picsum.photos/seed/intl${seed}/400/225`,
    "আন্তর্জাতিক খবর": `https://picsum.photos/seed/world${seed}/400/225`,
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

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const category = decodeURIComponent(name || "");
  const { data: articles, isLoading: articlesLoading } =
    useArticlesByCategory(category);
  const { data: rssItems = [], isLoading: rssLoading } =
    useRSSItemsByCategory(category);

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

      {/* Section header with category color */}
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

      {/* Manual articles */}
      {articlesLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          data-ocid="category.loading_state"
        >
          {["c1", "c2", "c3", "c4", "c5", "c6"].map((k) => (
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

      {/* RSS items for this category */}
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
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!rssLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="category.list"
            >
              {rssItems.map((item, i) => (
                <div
                  key={Number(item.id)}
                  className="flex flex-col bg-card border border-border rounded-sm hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
                  data-ocid={`category.item.${i + 1}`}
                >
                  {/* News image */}
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={getCategoryImage(item.category, item.id)}
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
                      data-ocid={`category.link.${i + 1}`}
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
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline self-start mt-1"
                      data-ocid={`category.link.${i + 1}`}
                    >
                      মূল সংবাদ পড়ুন
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
