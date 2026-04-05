import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";
import { useArticlesByCategory } from "../hooks/useQueries";
import { useParams } from "../router";

export default function CategoryPage() {
  const { name } = useParams<{ name: string }>();
  const category = decodeURIComponent(name || "");
  const { data: articles, isLoading } = useArticlesByCategory(category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-ocid="category.page">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-news-red rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-news-charcoal">{category}</h1>
          <p className="text-sm text-news-gray">{category} বিভাগের সকল সংবাদ</p>
        </div>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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

      {!isLoading && articles && articles.length === 0 && (
        <div
          className="text-center py-20 text-news-gray"
          data-ocid="category.empty_state"
        >
          <p className="text-xl mb-2">কোনো সংবাদ পাওয়া যায়নি</p>
          <p className="text-sm">এই বিভাগে এখনো কোনো সংবাদ প্রকাশিত হয়নি।</p>
        </div>
      )}

      {!isLoading && articles && articles.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
                <span className="inline-block bg-news-red text-white text-xs font-bold px-2 py-0.5 rounded-sm mb-2 self-start">
                  {article.category}
                </span>
                <h3 className="text-base font-bold text-news-charcoal leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
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
    </div>
  );
}
