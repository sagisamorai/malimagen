import { Home, Search, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-7 h-7" />,
  search: <Search className="w-7 h-7" />,
};

export function ServicesSection() {
  return (
    <section id="services" className="section-padding bg-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line-center mb-4" />
          <h2 className="section-title">השירותים שלי</h2>
          <p className="section-subtitle">ליווי מקצועי ואישי בכל שלב</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {SERVICES.map((service, idx) => (
            <div
              key={service.title}
              className={`relative rounded-3xl p-8 md:p-10 border transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 ${
                idx === 0
                  ? "bg-gradient-to-br from-primary to-primary-400 text-white border-primary/20"
                  : "bg-white border-gold/20 shadow-premium"
              }`}
            >
              {/* Gold corner accent */}
              <div className={`absolute top-0 left-0 w-20 h-20 rounded-tl-3xl ${
                idx === 0 ? "bg-gold/10" : "bg-gold/5"
              }`} style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                idx === 0 ? "bg-gold/20 text-gold" : "bg-primary/10 text-primary"
              }`}>
                {iconMap[service.icon]}
              </div>

              <h3 className={`text-2xl font-bold mb-2 ${idx === 0 ? "text-white" : "text-primary"}`}>
                {service.title}
              </h3>
              <p className={`font-medium mb-6 ${idx === 0 ? "text-gold" : "text-gold-500"}`}>
                {service.description}
              </p>

              <ul className="space-y-3">
                {service.items.map((item) => (
                  <li key={item} className={`flex items-start gap-3 ${idx === 0 ? "text-white/80" : "text-gray-600"}`}>
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${idx === 0 ? "text-gold" : "text-gold-500"}`} />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
