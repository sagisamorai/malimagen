import Link from "next/link";
import Image from "next/image";
import { Phone, Search, ArrowLeft, Building2, Home, Layers, TreePine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import { getHeroCategoryData } from "@/actions/settings";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  APARTMENT: <Building2 className="w-5 h-5" />,
  COTTAGE: <Home className="w-5 h-5" />,
  PENTHOUSE: <Layers className="w-5 h-5" />,
  GARDEN_APT: <TreePine className="w-5 h-5" />,
};

export async function HeroSection() {
  const categories = await getHeroCategoryData();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute top-20 left-20 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-gold border border-gold/20 px-5 py-2.5 rounded-full text-sm font-medium mb-8">
              <span className="text-gold">⭐</span>
              מומחית נדל״ן בפסגות אפק, ראש העין
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.15] mb-6">
              מוצאים לכם
              <br />
              את הבית
              <br />
              <span className="gradient-text-gold">של החלומות</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              ליווי אישי וצמוד לאורך כל תהליך המכירה או הקנייה.
              מומחיות באזור פסגות אפק וראש העין עם מאות עסקאות מוצלחות.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <Link href="/properties">
                <Button size="lg" className="btn-gold rounded-xl text-base w-full sm:w-auto px-8">
                  <Search className="w-5 h-5" />
                  צפו בנכסים
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button variant="outline" size="lg" className="border-white/25 text-white hover:bg-white/10 hover:text-white rounded-xl text-base w-full sm:w-auto px-8">
                  <Phone className="w-5 h-5" />
                  ייעוץ חינם
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 md:gap-12">
              {[
                { number: "100+", label: "עסקאות מוצלחות" },
                { number: "15+", label: "שנות ניסיון" },
                { number: "98%", label: "לקוחות מרוצים" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-bold text-gold mb-1">{stat.number}</div>
                  <div className="text-xs md:text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side - Category Grid with Real Images */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.type}
                      href={`/properties?type=${cat.type}`}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10"
                    >
                      {/* Image or Placeholder */}
                      {cat.image ? (
                        <>
                          <Image
                            src={cat.image}
                            alt={cat.label}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 1200px) 50vw, 200px"
                          />
                          {/* Dark overlay for readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:from-black/70 transition-colors" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}

                      {/* Category Info */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110 ${
                          cat.image
                            ? "bg-gold/90 text-primary shadow-lg shadow-gold/30"
                            : "bg-gold/20 text-gold"
                        }`}>
                          {CATEGORY_ICONS[cat.type]}
                        </div>
                        <span className="text-white font-bold text-base drop-shadow-lg">
                          {cat.label}
                        </span>
                        {cat.propertyCount > 0 && (
                          <span className="mt-1.5 text-[11px] text-gold/90 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-medium">
                            {cat.propertyCount} נכסים
                          </span>
                        )}
                      </div>

                      {/* Hover arrow */}
                      <div className="absolute bottom-3 left-3 w-7 h-7 bg-gold/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                        <ArrowLeft className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-white/10 text-center">
                  <p className="text-white/50 text-sm mb-1">נכסים חמים ממתינים לכם</p>
                  <p className="text-gold font-semibold">פסגות אפק, ראש העין</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-gold text-primary px-6 py-3 rounded-2xl shadow-gold-lg font-bold text-sm">
                ⭐ מומלצת #1 באזור
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L60 73.3C120 66.7 240 53.3 360 48C480 42.7 600 45.3 720 50.7C840 56 960 64 1080 64C1200 64 1320 56 1380 52L1440 48V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
