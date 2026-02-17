import { Clock, Megaphone, Zap, ArrowLeft } from "lucide-react";
import { ADVANTAGES } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  clock: <Clock className="w-7 h-7" />,
  megaphone: <Megaphone className="w-7 h-7" />,
  zap: <Zap className="w-7 h-7" />,
};

const numbers = ["01", "02", "03"];

export function AdvantagesSection() {
  return (
    <section id="advantages" className="section-padding bg-gradient-hero text-white relative overflow-hidden">
      {/* Gold line top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />

      {/* Decorative */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gold/3 rounded-full blur-[100px]" />

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="gold-line-center mb-4" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            למה דווקא <span className="text-gold">מלי מגן</span>?
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            היתרונות במכירת הדירה שלכם בליווי שלי
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {ADVANTAGES.map((advantage, idx) => (
            <div
              key={advantage.title}
              className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-gold/30 transition-all duration-300 group"
            >
              {/* Number */}
              <div className="text-6xl font-bold text-white/5 absolute top-4 left-4">
                {numbers[idx]}
              </div>

              <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center text-gold mb-6 group-hover:bg-gold/30 transition-colors">
                {iconMap[advantage.icon]}
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-white/60 leading-relaxed text-sm">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
