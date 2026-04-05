import { Newspaper } from "lucide-react";
import { useSiteSettings } from "../hooks/useQueries";
import { Link } from "../router";

const NAV_CATEGORIES = ["রাজনীতি", "খেলাধুলা", "বিনোদন", "আন্তর্জাতিক", "প্রযুক্তি"];

export default function Footer() {
  const year = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.siteName || "বালিগাঁও নিউজ";
  const tagline = settings?.tagline || "বালিগাঁওয়ের বিশ্বস্ত সংবাদ";
  const contactEmail = settings?.contactEmail || "baligawnews.bd@gmail.com";
  const address = settings?.address || "বালিগাঁও, পশ্চিমবঙ্গ";
  const editorEmail = settings?.editorEmail || "";

  return (
    <footer className="bg-news-charcoal text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-news-red text-white w-10 h-10 flex items-center justify-center rounded">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{siteName}</h3>
                <p className="text-xs text-white/60">{tagline}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              {siteName} বালিগাঁওয়ের একটি বিশ্বস্ত অনলাইন সংবাদ মাধ্যম। আমরা সত্য, নিরপেক্ষ
              ও সময়মতো সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/80">
              বিভাগসমূহ
            </h4>
            <ul className="space-y-2">
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                    data-ocid="footer.link"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/80">
              যোগাযোগ
            </h4>
            <address className="not-italic text-sm text-white/60 space-y-1.5">
              {address && <p className="leading-snug">{address}</p>}
              {editorEmail && (
                <p>
                  সম্পাদকীয়:{" "}
                  <a
                    href={`mailto:${editorEmail}`}
                    className="hover:text-white transition-colors"
                  >
                    {editorEmail}
                  </a>
                </p>
              )}
              {contactEmail && (
                <p>
                  যোগাযোগ:{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-white transition-colors"
                  >
                    {contactEmail}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>
            © {year} {siteName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
