import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useArticleById } from "../hooks/useQueries";
import { Link, useNavigate, useParams } from "../router";

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const articleId = id ? BigInt(id) : null;
  const { data: article, isLoading } = useArticleById(articleId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-10"
        data-ocid="newsdetail.loading_state"
      >
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-4 w-20 mb-4" />
        <Skeleton className="h-10 w-3/4 mb-3" />
        <Skeleton className="h-4 w-40 mb-6" />
        <Skeleton className="aspect-video w-full rounded mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((k) => (
            <Skeleton key={k} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-20 text-center"
        data-ocid="newsdetail.error_state"
      >
        <p className="text-2xl font-bold text-news-charcoal mb-3">
          সংবাদটি পাওয়া যায়নি
        </p>
        <p className="text-news-gray mb-8">
          এই সংবাদটি মুছে ফেলা হয়েছে বা উপলব্ধ নেই।
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-news-red text-white px-5 py-2.5 rounded font-medium hover:bg-news-red-dark transition-colors"
          data-ocid="newsdetail.button"
        >
          <ArrowLeft className="w-4 h-4" />
          হোমে ফিরুন
        </button>
      </div>
    );
  }

  const paragraphs = article.content
    ? article.content.split("\n").filter((p) => p.trim())
    : [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-8" data-ocid="newsdetail.page">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-news-gray hover:text-news-red transition-colors mb-6"
        data-ocid="newsdetail.link"
      >
        <ArrowLeft className="w-4 h-4" />
        সকল সংবাদ
      </Link>

      {/* Category */}
      <Badge className="bg-news-red text-white hover:bg-news-red-dark text-xs font-bold mb-4">
        {article.category}
      </Badge>

      {/* Headline */}
      <h1 className="text-2xl md:text-3xl font-bold text-news-charcoal leading-tight mb-4">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-news-gray mb-6">
        {article.author && (
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {article.author}
          </span>
        )}
        {article.date && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {article.date}
          </span>
        )}
      </div>

      {/* Hero image */}
      {article.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded mb-8 bg-muted">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-lg text-news-gray leading-relaxed border-l-4 border-news-red pl-4 mb-8 italic">
          {article.excerpt}
        </p>
      )}

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {paragraphs.length > 0 ? (
          paragraphs.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="text-base text-news-charcoal leading-relaxed mb-4"
            >
              {para}
            </p>
          ))
        ) : (
          <p className="text-news-gray italic">বিস্তারিত সংবাদ পাওয়া যায়নি।</p>
        )}
      </div>

      {/* Footer back link */}
      <div className="mt-12 pt-6 border-t border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-news-red font-medium hover:underline"
          data-ocid="newsdetail.link"
        >
          <ArrowLeft className="w-4 h-4" />
          সকল সংবাদে ফিরুন
        </Link>
      </div>
    </main>
  );
}
