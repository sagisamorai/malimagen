import type { Metadata } from "next";
import { Award, Users, Heart, Scale, Check, Star } from "lucide-react";
import { SERVICES, SITE_CONFIG } from "@/lib/constants";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "אודות",
  description: "מלי מגן - מתווכת נדל״ן עם ניסיון עשיר בפסגות אפק, ראש העין. ליווי אישי במכירה וקנייה.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-hero text-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="gold-line mb-4" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              אודות <span className="text-gold">מלי מגן</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              מתווכת נדל״ן עם ניסיון עשיר בתחום, בעלת תואר ראשון במשפטים,
              ומשרד תיווך בראש העין. מתמחה בעסקאות מגורים באזור פסגות אפק.
            </p>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 53.3C120 46.7 240 33.3 360 28C480 22.7 600 25.3 720 30.7C840 36 960 44 1080 44C1200 44 1320 36 1380 32L1440 28V60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto space-y-6 text-gray-600 leading-relaxed text-lg">
            <p>
              שמי <strong className="text-primary">מלי מגן</strong> ואני מתווכת נדל״ן עם ניסיון עשיר בתחום ובעלת משרד
              תיווך בראש העין. במהלך הקריירה שלי הובלתי ועדיין מובילה עסקאות
              רבות וליוויתי בהצלחה מאות לקוחות מרוצים.
            </p>
            <p>
              הערך המוביל אותי הוא יושרה, שקיפות והבנה עמוקה של שוק הנדל״ן
              המקומי. הלקוחות שלי זוכים ליחס אישי, זמינות מלאה לאורך כל תהליך
              העסקה ומקבלים את כל המידע וההכוונה הנדרשים לקבלת החלטות נכונות.
            </p>
            <p>
              בין אם אתם מחפשים דירה לחלום בה או למכור את דירתכם הקיימת
              — אני כאן בשבילכם, כדי להפוך את התהליך
              לפשוט, מהנה ומוצלח ככל האפשר.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background-warm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="gold-line-center mb-4" />
            <h2 className="section-title">הערכים שלי</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: "יחס אישי", desc: "כל לקוח מקבל תשומת לב מלאה וליווי צמוד" },
              { icon: Scale, title: "יושרה", desc: "שקיפות מלאה בכל שלב של העסקה" },
              { icon: Award, title: "מקצועיות", desc: "ידע משפטי וניסיון עשיר בנדל״ן" },
              { icon: Users, title: "מחויבות", desc: "זמינות מלאה ומחויבות להצלחת העסקה" },
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-6 border border-gold/10 text-center card-hover shadow-premium">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="gold-line-center mb-4" />
            <h2 className="section-title">השירותים שלי</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {SERVICES.map((service, idx) => (
              <div key={service.title} className={`rounded-3xl p-8 border ${
                idx === 0
                  ? "bg-gradient-to-br from-primary to-primary-400 text-white border-primary/20"
                  : "bg-white border-gold/15 shadow-premium"
              }`}>
                <h3 className={`text-2xl font-bold mb-2 ${idx === 0 ? "text-white" : "text-primary"}`}>{service.title}</h3>
                <p className={`font-medium mb-4 ${idx === 0 ? "text-gold" : "text-gold-500"}`}>{service.description}</p>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className={`flex items-start gap-3 ${idx === 0 ? "text-white/80" : "text-gray-600"}`}>
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${idx === 0 ? "text-gold" : "text-gold-500"}`} />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
