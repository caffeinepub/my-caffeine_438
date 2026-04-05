import HeroSlider from "../components/HeroSlider";
import NewsGrid from "../components/NewsGrid";
import RSSFeedSection from "../components/RSSFeedSection";

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

      {/* RSS Feed section — auto-fetched from online sources */}
      <div className="border-t border-border">
        <RSSFeedSection />
      </div>
    </div>
  );
}
