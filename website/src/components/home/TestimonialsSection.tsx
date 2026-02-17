import { Star, Quote } from "lucide-react";
import { db } from "@/lib/db";

export async function TestimonialsSection() {
  let testimonials: Awaited<ReturnType<typeof db.testimonial.findMany>> = [];
  try {
    testimonials = await db.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return null;
  }

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-white relative">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line-center mb-4" />
          <h2 className="section-title">לקוחות ממליצים</h2>
          <p className="section-subtitle">
            מה הלקוחות שלי אומרים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`relative rounded-3xl p-8 border transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1 ${
                idx === 1
                  ? "bg-gradient-to-br from-primary to-primary-400 text-white border-primary/20 shadow-premium-lg scale-[1.02]"
                  : "bg-white border-gold/15 shadow-premium"
              }`}
            >
              {/* Quote mark */}
              <Quote className={`w-10 h-10 mb-4 ${idx === 1 ? "text-gold/40" : "text-gold/20"}`} />

              <p className={`leading-relaxed mb-6 text-base ${idx === 1 ? "text-white/85" : "text-gray-600"}`}>
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-current/10">
                <div className="font-bold text-base">
                  {testimonial.name}
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${idx === 1 ? "text-gold fill-gold" : "text-gold-400 fill-gold-400"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
