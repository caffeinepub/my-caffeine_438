import { Mail, MapPin, Phone, Shield, Target, Users } from "lucide-react";
import { useState } from "react";
import { useLogoUrl, useSiteSettings } from "../hooks/useQueries";

export default function AboutPage() {
  const { data: settings } = useSiteSettings();
  const { data: logoUrl } = useLogoUrl();
  const [logoImgError, setLogoImgError] = useState(false);

  const siteName = settings?.siteName || "বালিগাঁও নিউজ";
  const tagline = settings?.tagline || "বালিগাঁওয়ের বিশ্বস্ত সংবাদ";
  const editorName = settings?.editorName || "";
  const editorEmail = settings?.editorEmail || "";
  const editorPhone = settings?.editorPhone || "";
  const address = settings?.address || "বালিগাঁও, পশ্চিমবঙ্গ";
  const contactEmail = settings?.contactEmail || "baligawnews.bd@gmail.com";
  const reporters = settings?.reporters || [];

  return (
    <div className="min-h-screen bg-background" data-ocid="about.page">
      {/* Hero banner */}
      <div className="bg-news-charcoal text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {logoUrl && !logoImgError ? (
              <div
                className="w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden rounded-full"
                style={{
                  background: "#000000",
                  boxShadow: "0 0 0 3px #000000",
                }}
              >
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="w-full h-full object-contain p-1"
                  onError={() => setLogoImgError(true)}
                />
              </div>
            ) : null}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{siteName}</h1>
          <p className="text-lg text-white/70">{tagline}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* আমাদের সম্পর্কে */}
        <section data-ocid="about.section">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 bg-news-red rounded-full" />
            <h2 className="text-2xl font-bold text-news-charcoal">
              আমাদের সম্পর্কে
            </h2>
          </div>
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed text-base mb-4">
              <strong className="text-news-charcoal">{siteName}</strong> বালিগাঁও
              অঞ্চলের একটি বিশ্বস্ত ও নির্ভরযোগ্য অনলাইন সংবাদ পোর্টাল। আমরা স্থানীয়, জাতীয় ও
              আন্তর্জাতিক খবর সত্য ও নিরপেক্ষভাবে পরিবেশন করি।
            </p>
            <p className="text-muted-foreground leading-relaxed text-base">
              বালিগাঁওয়ের মানুষের কাছে সময়মতো, নির্ভুল ও গুরুত্বপূর্ণ তথ্য পৌঁছে দেওয়াই আমাদের
              প্রধান লক্ষ্য। আমরা বিশ্বাস করি, একটি সচেতন সমাজ গড়ে তুলতে মুক্ত ও স্বাধীন
              সাংবাদিকতা অপরিহার্য।
            </p>
          </div>
        </section>

        {/* লক্ষ্য ও উদ্দেশ্য */}
        <section data-ocid="about.section">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 bg-news-red rounded-full" />
            <h2 className="text-2xl font-bold text-news-charcoal">
              আমাদের লক্ষ্য ও মূল্যবোধ
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              className="bg-white border border-border rounded-xl p-5 shadow-sm text-center"
              data-ocid="about.card"
            >
              <div className="bg-news-red/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-news-red" />
              </div>
              <h3 className="font-bold text-news-charcoal mb-2">
                সত্য ও নিরপেক্ষতা
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                আমরা সর্বদা সত্য ও নিরপেক্ষ সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ। কোনো রাজনৈতিক বা
                বাণিজ্যিক চাপের কাছে আমরা নতিস্বীকার করি না।
              </p>
            </div>
            <div
              className="bg-white border border-border rounded-xl p-5 shadow-sm text-center"
              data-ocid="about.card"
            >
              <div className="bg-news-red/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-news-red" />
              </div>
              <h3 className="font-bold text-news-charcoal mb-2">
                দায়িত্বশীল সাংবাদিকতা
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                আমরা যাচাইকৃত ও নির্ভরযোগ্য তথ্যের উপর ভিত্তি করে সংবাদ প্রকাশ করি। ভুল তথ্য
                ছড়ানো থেকে আমরা সর্বদা বিরত থাকি।
              </p>
            </div>
            <div
              className="bg-white border border-border rounded-xl p-5 shadow-sm text-center"
              data-ocid="about.card"
            >
              <div className="bg-news-red/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-news-red" />
              </div>
              <h3 className="font-bold text-news-charcoal mb-2">
                সম্প্রদায়ের জন্য
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                বালিগাঁওয়ের মানুষের প্রতিদিনকার জীবনের সাথে সংশ্লিষ্ট খবর সর্বোচ্চ গুরুত্ব দিয়ে
                পরিবেশন করা আমাদের অঙ্গীকার।
              </p>
            </div>
          </div>
        </section>

        {/* সম্পাদকীয় দল */}
        {(editorName || reporters.length > 0) && (
          <section data-ocid="about.section">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-8 bg-news-red rounded-full" />
              <h2 className="text-2xl font-bold text-news-charcoal">
                সম্পাদকীয় দল
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {editorName && (
                <div
                  className="bg-white border border-border rounded-xl p-5 shadow-sm"
                  data-ocid="about.team_card"
                >
                  <div className="w-12 h-12 bg-news-red rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">
                      {editorName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-bold text-news-charcoal">{editorName}</h3>
                  <p className="text-sm text-news-red font-medium mb-2">
                    সম্পাদক
                  </p>
                  {editorPhone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {editorPhone}
                    </p>
                  )}
                  {editorEmail && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      <a
                        href={`mailto:${editorEmail}`}
                        className="hover:text-news-red transition-colors"
                      >
                        {editorEmail}
                      </a>
                    </p>
                  )}
                </div>
              )}
              {reporters.map((reporter, i) => (
                <div
                  key={`reporter-${reporter.name}-${i}`}
                  className="bg-white border border-border rounded-xl p-5 shadow-sm"
                  data-ocid={`about.team_card.${i + 1}`}
                >
                  <div className="w-12 h-12 bg-news-charcoal rounded-full flex items-center justify-center mb-3">
                    <span className="text-white font-bold text-lg">
                      {reporter.name?.charAt(0) || "?"}
                    </span>
                  </div>
                  <h3 className="font-bold text-news-charcoal">
                    {reporter.name}
                  </h3>
                  {reporter.role && (
                    <p className="text-sm text-news-red font-medium mb-2">
                      {reporter.role}
                    </p>
                  )}
                  {reporter.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {reporter.phone}
                    </p>
                  )}
                  {reporter.email && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      <a
                        href={`mailto:${reporter.email}`}
                        className="hover:text-news-red transition-colors"
                      >
                        {reporter.email}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* যোগাযোগ */}
        <section data-ocid="about.section">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-8 bg-news-red rounded-full" />
            <h2 className="text-2xl font-bold text-news-charcoal">
              যোগাযোগ করুন
            </h2>
          </div>
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {address && (
                <div className="flex items-start gap-3">
                  <div className="bg-news-red/10 p-2 rounded-lg shrink-0">
                    <MapPin className="w-5 h-5 text-news-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-news-charcoal mb-1">
                      ঠিকানা
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                </div>
              )}
              {contactEmail && (
                <div className="flex items-start gap-3">
                  <div className="bg-news-red/10 p-2 rounded-lg shrink-0">
                    <Mail className="w-5 h-5 text-news-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-news-charcoal mb-1">
                      ইমেইল
                    </h4>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-news-red hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {editorPhone && (
                <div className="flex items-start gap-3">
                  <div className="bg-news-red/10 p-2 rounded-lg shrink-0">
                    <Phone className="w-5 h-5 text-news-red" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-news-charcoal mb-1">
                      ফোন
                    </h4>
                    <a
                      href={`tel:${editorPhone}`}
                      className="text-sm text-news-red hover:underline"
                    >
                      {editorPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
