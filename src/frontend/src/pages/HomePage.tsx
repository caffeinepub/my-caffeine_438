import CategoryPreviewSection from "../components/CategoryPreviewSection";
import HeroSlider from "../components/HeroSlider";
import NewsGrid from "../components/NewsGrid";
import RSSFeedSection from "../components/RSSFeedSection";

const CATEGORIES = [
  "স্থানীয় খবর",
  "জাতীয় খবর",
  "আন্তর্জাতিক খবর",
  "শিক্ষা",
  "স্বাস্থ্য",
  "কৃষি",
  "খেলাধুলা",
  "ধর্মীয় অনুষ্ঠান",
];

export default function HomePage() {
  return (
    <div data-ocid="home.page">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Latest news section */}
      <section className="max-w-7xl mx-auto px-4 py-8" data-ocid="home.section">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-news-red rounded-full" />
          <h2 className="text-2xl font-bold text-news-charcoal">সর্বশেষ সংবাদ</h2>
        </div>
        <NewsGrid />
      </section>

      {/* Category preview sections */}
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-10 border-t border-border">
        {CATEGORIES.map((cat) => (
          <CategoryPreviewSection key={cat} category={cat} />
        ))}
      </div>

      {/* RSS Feed section — auto-fetched from online sources */}
      <div className="border-t border-border">
        <RSSFeedSection />
      </div>
    </div>
  );
}
