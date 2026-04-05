import { Zap } from "lucide-react";
import { useBreakingNewsText } from "../hooks/useQueries";

const FALLBACK_TEXT =
  "ব্রেকিং: জাতীয় সংসদে গুরুত্বপূর্ণ বিল পাস • বাংলাদেশ-ভারত দ্বিপক্ষীয় বৈঠক অনুষ্ঠিত • ঢাকায় তাপমাত্রা রেকর্ড উচ্চতায় • জাতীয় ক্রিকেট দলের নতুন অধিনায়ক ঘোষণা";

export default function BreakingNewsTicker() {
  const { data: breakingText, isLoading } = useBreakingNewsText();

  const text = breakingText || FALLBACK_TEXT;
  const displayText = `${text} ••• ${text}`;

  return (
    <div
      className="bg-news-red text-white flex items-stretch overflow-hidden"
      role="marquee"
      aria-label="ব্রেকিং নিউজ"
      data-ocid="ticker.panel"
    >
      {/* Label */}
      <div className="flex-shrink-0 bg-news-red-dark flex items-center gap-1.5 px-3 py-2 z-10">
        <Zap className="w-3.5 h-3.5 fill-white" />
        <span className="text-xs font-bold whitespace-nowrap tracking-wide">
          ব্রেকিং নিউজ
        </span>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/30 flex-shrink-0" />

      {/* Scrolling ticker */}
      <div className="flex-1 ticker-container ticker-pause py-2 overflow-hidden">
        {isLoading ? (
          <span className="text-sm px-4 opacity-70">লোড হচ্ছে...</span>
        ) : (
          <span className="animate-marquee-seamless text-sm font-medium">
            {displayText}
          </span>
        )}
      </div>
    </div>
  );
}
