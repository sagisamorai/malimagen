import { Phone, Mail, MapPin, MessageCircle, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { ContactForm } from "@/components/forms/ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="section-padding bg-background-warm relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px]" />

      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="gold-line-center mb-4" />
          <h2 className="section-title">בואו נדבר</h2>
          <p className="section-subtitle">
            השאירו פרטים ואחזור אליכם בהקדם
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gold/10 shadow-premium">
            <h3 className="text-xl font-bold text-primary mb-6">השאירו פרטים</h3>
            <ContactForm source="homepage" />
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  מוכנים להתחיל?
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  בין אם אתם מחפשים דירה לחלום בה או למכור את דירתכם הקיימת
                  — אני כאן בשבילכם.
                </p>
              </div>

              <div className="space-y-5">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-center gap-4 group bg-white p-5 rounded-2xl border border-gold/10 shadow-sm hover:shadow-premium transition-all"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">טלפון</div>
                    <div className="font-bold text-primary text-lg" dir="ltr">
                      {SITE_CONFIG.phone}
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-300 mr-auto" />
                </a>

                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group bg-white p-5 rounded-2xl border border-gold/10 shadow-sm hover:shadow-premium transition-all"
                >
                  <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">WhatsApp</div>
                    <div className="font-bold text-primary">שלחו הודעה</div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-300 mr-auto" />
                </a>

                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-4 group bg-white p-5 rounded-2xl border border-gold/10 shadow-sm hover:shadow-premium transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">אימייל</div>
                    <div className="font-bold text-primary">{SITE_CONFIG.email}</div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-300 mr-auto" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
