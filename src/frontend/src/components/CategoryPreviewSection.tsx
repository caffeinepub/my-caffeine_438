import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ChevronRight,
  Flag,
  Globe,
  Heart,
  MapPin,
  Sprout,
  Star,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useArticlesByCategory } from "../hooks/useQueries";
import { Link } from "../router";

type CategoryConfig = {
  color: string;
  textColor: string;
  lightBg: string;
  icon: LucideIcon;
};

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "স্থানীয় খবর": {
    color: "bg-green-700",
    textColor: "text-green-700",
    lightBg: "bg-green-50",
    icon: MapPin,
  },
  "জাতীয় খবর": {
    color: "bg-red-700",
    textColor: "text-red-700",
    lightBg: "bg-red-50",
    icon: Flag,
  },
  "আন্তর্জাতিক খবর": {
    color: "bg-blue-700",
    textColor: "text-blue-700",
    lightBg: "bg-blue-50",
    icon: Globe,
  },
  শিক্ষা: {
    color: "bg-yellow-600",
    textColor: "text-yellow-600",
    lightBg: "bg-yellow-50",
    icon: BookOpen,
  },
  স্বাস্থ্য: {
    color: "bg-teal-600",
    textColor: "text-teal-600",
    lightBg: "bg-teal-50",
    icon: Heart,
  },
  কৃষি: {
    color: "bg-lime-700",
    textColor: "text-lime-700",
    lightBg: "bg-lime-50",
    icon: Sprout,
  },
  খেলাধুলা: {
    color: "bg-orange-600",
    textColor: "text-orange-600",
    lightBg: "bg-orange-50",
    icon: Trophy,
  },
  "ধর্মীয় অনুষ্ঠান": {
    color: "bg-purple-700",
    textColor: "text-purple-700",
    lightBg: "bg-purple-50",
    icon: Star,
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  color: "bg-news-red",
  textColor: "text-news-red",
  lightBg: "bg-red-50",
  icon: Flag,
};

interface CategoryPreviewSectionProps {
  category: string;
}

export default function CategoryPreviewSection({
  category,
}: CategoryPreviewSectionProps) {
  const { data: articles, isLoading } = useArticlesByCategory(category);
  const config = CATEGORY_CONFIG[category] ?? DEFAULT_CONFIG;
  const CategoryIcon = config.icon;

  // Don't render if no articles and not loading
  if (!isLoading && (!articles || articles.length === 0)) return null;

  const displayArticles = articles?.slice(0, 4) ?? [];

  return (
    <section data-ocid="home.section">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`${config.color} text-white w-9 h-9 flex items-center justify-center rounded-md flex-shrink-0`}
          >
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1 h-7 ${config.color} rounded-full`} />
            <h2 className="text-xl font-bold text-news-charcoal">{category}</h2>
          </div>
        </div>
        <Link
          to={`/category/${encodeURIComponent(category)}`}
          className={`flex items-center gap-1 text-sm font-semibold ${config.textColor} hover:underline`}
          data-ocid="home.link"
        >
          আরও দেখুন
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Skeleton loading */}
      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          data-ocid="home.loading_state"
        >
          {[1, 2, 3, 4].map((k) => (
            <div
              key={k}
              className="bg-card rounded-sm overflow-hidden border border-border shadow-card"
            >
              <Skeleton className="w-full aspect-video" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles grid */}
      {!isLoading && displayArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayArticles.map((article, i) => (
            <article
              key={Number(article.id)}
              className="bg-card rounded-sm overflow-hidden border border-border shadow-card flex flex-col hover:shadow-md transition-shadow"
              data-ocid={`home.item.${i + 1}`}
            >
              {/* Article image */}
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x225/e2e8f0/64748b?text=সংবাদ";
                  }}
                />
              </div>
              <div className="p-3 flex flex-col flex-1">
                {/* Category badge */}
                <span
                  className={`inline-block ${config.color} text-white text-xs font-bold px-2 py-0.5 rounded-sm mb-2 self-start`}
                >
                  {article.category}
                </span>
                {/* Title */}
                <Link
                  to={`/news/${Number(article.id)}`}
                  className="text-sm font-bold text-news-charcoal leading-snug line-clamp-2 hover:text-news-red transition-colors flex-1"
                  data-ocid={`home.link.${i + 1}`}
                >
                  {article.title}
                </Link>
                {/* Date */}
                <p className="text-xs text-news-gray mt-2">{article.date}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
