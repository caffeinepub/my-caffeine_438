import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User } from "lucide-react";
import type { Article } from "../backend.d";
import { usePublishedArticles } from "../hooks/useQueries";

const FALLBACK_ARTICLES: Article[] = [
  {
    id: BigInt(10),
    title: "প্রযুক্তি খাতে বাংলাদেশের উন্নতি, আইটি রপ্তানি দ্বিগুণ",
    content: "",
    category: "প্রযুক্তি",
    imageUrl: "/assets/generated/news-tech.dim_800x500.jpg",
    author: "প্রযুক্তি ডেস্ক",
    excerpt:
      "গত অর্থবছরে বাংলাদেশের আইটি রপ্তানি দ্বিগুণ হয়েছে। সফটওয়্যার ও আইটি সেবা রপ্তানিতে নতুন রেকর্ড।",
    date: "৫ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
  {
    id: BigInt(11),
    title: "ঢালিউড চলচ্চিত্র উৎসবে পুরস্কার জিতলেন তারকারা",
    content: "",
    category: "বিনোদন",
    imageUrl: "/assets/generated/news-entertainment.dim_800x500.jpg",
    author: "বিনোদন ডেস্ক",
    excerpt:
      "ঢাকায় আয়োজিত জাতীয় চলচ্চিত্র পুরস্কার অনুষ্ঠানে দেশের সেরা চলচ্চিত্রকর্মীদের পুরস্কৃত করা হয়েছে।",
    date: "৪ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
  {
    id: BigInt(12),
    title: "স্বাস্থ্য মন্ত্রণালয়ের নতুন টিকা কার্যক্রম শুরু",
    content: "",
    category: "স্বাস্থ্য",
    imageUrl: "/assets/generated/news-health.dim_800x500.jpg",
    author: "স্বাস্থ্য ডেস্ক",
    excerpt:
      "সারা দেশে শিশুদের জন্য নতুন টিকা কার্যক্রম চালু করেছে স্বাস্থ্য মন্ত্রণালয়। আগামী তিন মাসে ১০ লাখ শিশুকে টিকা দেওয়ার লক্ষ্যমাত্রা।",
    date: "৪ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
  {
    id: BigInt(13),
    title: "বিশ্ব অর্থনীতির নতুন চ্যালেঞ্জ, বাংলাদেশের কৌশল",
    content: "",
    category: "আন্তর্জাতিক",
    imageUrl: "/assets/generated/news-city.dim_800x500.jpg",
    author: "আন্তর্জাতিক ডেস্ক",
    excerpt:
      "বৈশ্বিক মন্দার আশঙ্কায় বিশ্বের অর্থনীতিবিদরা নতুন কৌশল নিয়ে আলোচনা করছেন। বাংলাদেশও প্রস্তুতি নিচ্ছে।",
    date: "৩ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
  {
    id: BigInt(14),
    title: "ফুটবল লিগে মোহামেডানের দুর্দান্ত জয়",
    content: "",
    category: "খেলাধুলা",
    imageUrl: "/assets/generated/news-sports.dim_800x500.jpg",
    author: "ক্রীড়া ডেস্ক",
    excerpt: "জাতীয় ফুটবল লিগে মোহামেডান স্পোর্টিং ক্লাব আবাহনীকে ৩-১ গোলে পরাজিত করেছে।",
    date: "৩ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
  {
    id: BigInt(15),
    title: "সংসদে বিরোধী দলের কঠোর সমালোচনা, উত্তপ্ত বিতর্ক",
    content: "",
    category: "রাজনীতি",
    imageUrl: "/assets/generated/news-politics.dim_800x500.jpg",
    author: "রাজনীতি ডেস্ক",
    excerpt:
      "জাতীয় সংসদে বাজেট অধিবেশনে বিরোধী দল সরকারের নীতির তীব্র সমালোচনা করেছে।",
    date: "২ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: false,
    isPublished: true,
  },
];

function NewsCard({ article, index }: { article: Article; index: number }) {
  return (
    <article
      className="news-card bg-card rounded-sm overflow-hidden shadow-card border border-border flex flex-col"
      data-ocid={`news.item.${index + 1}`}
    >
      {/* Thumbnail */}
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

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category badge */}
        <span className="inline-block bg-news-red text-white text-xs font-bold px-2 py-0.5 rounded-sm mb-2 self-start">
          {article.category}
        </span>

        {/* Headline */}
        <h3 className="text-base font-bold text-news-charcoal leading-snug mb-2 line-clamp-2 hover:text-news-red transition-colors cursor-pointer">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-news-gray leading-relaxed line-clamp-2 flex-1 mb-3">
          {article.excerpt}
        </p>

        {/* Author + date footer */}
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
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-sm overflow-hidden shadow-card border border-border">
      <Skeleton className="w-full aspect-video" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

export default function NewsGrid() {
  const { data: articles, isLoading } = usePublishedArticles();

  const displayArticles =
    articles && articles.length > 0 ? articles : FALLBACK_ARTICLES;

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="news.loading_state"
      >
        {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
          <SkeletonCard key={k} />
        ))}
      </div>
    );
  }

  if (!isLoading && displayArticles.length === 0) {
    return (
      <div
        className="text-center py-16 text-news-gray"
        data-ocid="news.empty_state"
      >
        <p className="text-lg">কোনো সংবাদ পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-ocid="news.list"
    >
      {displayArticles.map((article, i) => (
        <NewsCard key={Number(article.id)} article={article} index={i} />
      ))}
    </div>
  );
}
