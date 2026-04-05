import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Article } from "../backend.d";
import { useSliderArticles } from "../hooks/useQueries";

const FALLBACK_SLIDES: Article[] = [
  {
    id: BigInt(1),
    title: "জাতীয় সংসদে ঐতিহাসিক বাজেট অধিবেশন শুরু, নতুন কর নীতি ঘোষণা",
    content: "",
    category: "রাজনীতি",
    imageUrl: "/assets/generated/news-politics.dim_800x500.jpg",
    author: "রাজনীতি ডেস্ক",
    excerpt:
      "আজ থেকে জাতীয় সংসদে বার্ষিক বাজেট অধিবেশন শুরু হয়েছে। অর্থমন্ত্রী নতুন কর কাঠামো ঘোষণা করেছেন।",
    date: "৫ এপ্রিল ২০২৬",
    isBreaking: true,
    isSlider: true,
    isPublished: true,
  },
  {
    id: BigInt(2),
    title: "বাংলাদেশ ক্রিকেট দল পাকিস্তানকে হারিয়ে সিরিজ জিতল",
    content: "",
    category: "খেলাধুলা",
    imageUrl: "/assets/generated/news-sports.dim_800x500.jpg",
    author: "ক্রীড়া ডেস্ক",
    excerpt:
      "ঢাকার মিরপুর স্টেডিয়ামে উত্তেজনাপূর্ণ শেষ ওভারে বাংলাদেশ ৬ উইকেটে জয়লাভ করেছে।",
    date: "৪ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: true,
    isPublished: true,
  },
  {
    id: BigInt(3),
    title: "ঢাকায় নতুন মেট্রোরেল রুট চালু, যাত্রীদের উচ্ছ্বাস",
    content: "",
    category: "অর্থনীতি",
    imageUrl: "/assets/generated/news-city.dim_800x500.jpg",
    author: "নগর ডেস্ক",
    excerpt:
      "রাজধানী ঢাকায় নতুন মেট্রোরেল রুটের উদ্বোধন হয়েছে। হাজারো যাত্রী উৎসাহে নতুন এই পরিবহন সেবা উপভোগ করছেন।",
    date: "৩ এপ্রিল ২০২৬",
    isBreaking: false,
    isSlider: true,
    isPublished: true,
  },
];

const AUTO_ADVANCE_MS = 5000;

export default function HeroSlider() {
  const { data: articles, isLoading } = useSliderArticles();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = articles && articles.length > 0 ? articles : FALLBACK_SLIDES;

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length, next]);

  if (isLoading) {
    return (
      <div className="w-full" data-ocid="slider.loading_state">
        <Skeleton className="w-full h-[55vw] max-h-[520px] min-h-[280px]" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-news-charcoal"
      style={{ minHeight: 280, maxHeight: 520 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-ocid="slider.panel"
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={Number(s.id)}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={s.imageUrl}
            alt={s.title}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 slider-gradient" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-news-red text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
                  {s.category}
                </span>
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {s.date}
                </span>
              </div>
              <h2 className="text-white text-xl md:text-3xl font-bold leading-snug line-clamp-3 md:line-clamp-2">
                {s.title}
              </h2>
            </div>
          </div>
        </div>
      ))}

      {/* Placeholder height */}
      <div
        className="relative"
        style={{ paddingBottom: "min(55vw, 520px)", minHeight: 280 }}
      />

      {/* Prev arrow */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        aria-label="পূর্ববর্তী"
        data-ocid="slider.pagination_prev"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        aria-label="পরবর্তী"
        data-ocid="slider.pagination_next"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 md:right-8 z-30 flex items-center gap-2">
        {slides.map((s, i) => (
          <button
            type="button"
            key={Number(s.id)}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all ${
              i === current
                ? "bg-white w-6 h-2"
                : "bg-white/50 hover:bg-white/80 w-2 h-2"
            }`}
            aria-label={`স্লাইড ${i + 1}`}
            data-ocid="slider.toggle"
          />
        ))}
      </div>
    </div>
  );
}
