import { Button } from "@/components/ui/button";
import { Menu, Newspaper, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "../router";

const NAV_CATEGORIES = [
  { label: "রাজনীতি", slug: "রাজনীতি" },
  { label: "খেলাধুলা", slug: "খেলাধুলা" },
  { label: "বিনোদন", slug: "বিনোদন" },
  { label: "আন্তর্জাতিক", slug: "আন্তর্জাতিক" },
  { label: "প্রযুক্তি", slug: "প্রযুক্তি" },
  { label: "অর্থনীতি", slug: "অর্থনীতি" },
  { label: "স্বাস্থ্য", slug: "স্বাস্থ্য" },
];

function formatBengaliDate() {
  const now = new Date();
  const bengaliMonths = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const days = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  const bengaliNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const toBengali = (n: number) =>
    n
      .toString()
      .split("")
      .map((d) => bengaliNums[Number.parseInt(d)])
      .join("");
  return `${days[now.getDay()]}, ${toBengali(now.getDate())} ${bengaliMonths[now.getMonth()]} ${toBengali(now.getFullYear())}`;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top masthead */}
      <div className="bg-white border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo + site name */}
          <Link
            to="/"
            className="flex items-center gap-3"
            data-ocid="header.link"
          >
            <div className="bg-news-red text-white w-12 h-12 flex items-center justify-center rounded font-bold text-lg flex-shrink-0">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-news-charcoal leading-tight tracking-tight">
                দেশের খবর
              </h1>
              <p className="text-xs text-news-gray leading-none mt-0.5">
                বাংলাদেশের বিশ্বস্ত সংবাদ
              </p>
            </div>
          </Link>

          {/* Date + search */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-news-gray">
              {formatBengaliDate()}
            </span>
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="অনুসন্ধান"
              data-ocid="header.search_input"
            >
              <Search className="w-5 h-5 text-news-gray" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded text-news-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="মেনু"
            data-ocid="header.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-news-red text-white" aria-label="মূল নেভিগেশন">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden md:flex items-center gap-0">
            {NAV_CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <Link
                  to={`/category/${encodeURIComponent(cat.slug)}`}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-news-red-dark transition-colors whitespace-nowrap"
                  data-ocid="header.link"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link
                to="/admin"
                className="block px-4 py-3 text-sm font-semibold hover:bg-news-red-dark transition-colors opacity-80"
                data-ocid="header.link"
              >
                ⚙ অ্যাডমিন
              </Link>
            </li>
          </ul>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <ul className="md:hidden flex flex-col">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${encodeURIComponent(cat.slug)}`}
                    className="block px-4 py-3 text-sm font-semibold hover:bg-news-red-dark transition-colors border-t border-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                    data-ocid="header.link"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin"
                  className="block px-4 py-3 text-sm font-semibold hover:bg-news-red-dark transition-colors border-t border-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                  data-ocid="header.link"
                >
                  ⚙ অ্যাডমিন
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div className="bg-white border-b border-border px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-news-gray" />
              <input
                type="text"
                placeholder="সংবাদ অনুসন্ধান করুন..."
                className="flex-1 outline-none text-foreground text-sm py-1"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                data-ocid="header.search_input"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
