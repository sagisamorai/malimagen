import Image from "next/image";
import { db } from "@/lib/db";

async function getAboutContent() {
  try {
    const settings = await db.siteSetting.findMany({
      where: {
        key: {
          in: ["about_text", "about_image", "about_title", "about_bg"],
        },
      },
    });

    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }

    return {
      title: map["about_title"] || "קצת עליי",
      text:
        map["about_text"] ||
        `היי, נעים להכיר, שמי מלי מגן ואני מתווכת נדל"ן עם ניסיון עשיר בתחום ובעלת משרד תיווך Real 770 בראש העין.

במהלך הקריירה שלי, הובלתי (ועדיין מובילה!) עסקאות רבות וליוויתי בהצלחה מאות לקוחות מרוצים בעסקת חייהם ומצאתי להם את הפתרונות המושלמים לצרכים ולחלומות שלהם. אני מתמחה בעסקאות מגורים.

בעלת תואר ראשון במשפטים LLB.

הערך המוביל אותי הוא יושרה, שקיפות והבנה עמוקה של שוק הנדל"ן המקומי, הלקוחות שלי זוכים ליחס אישי, זמינות מלאה לאורך כל תהליך העסקה ומקבלים את כל המידע וההכוונה הנדרשים לקבלת החלטות נכונות.

אז בין אם אתם מחפשים דירה לחלום בה או למכור את דירתכם הקיימת וצריכים ייעוץ מקצועי – אני כאן בשבילכם, וזאת, כדי להפוך את התהליך לפשוט, מהנה ומוצלח ככל האפשר.

אני מזמינה אתכם ליצור קשר ולקבל את השירות המקצועי והאישי ביותר בעולם הנדל"ן שבו מעורבים אנשים ומשפחות.`,
      image: map["about_image"] || null,
      background: map["about_bg"] || null,
    };
  } catch {
    return {
      title: "קצת עליי",
      text: `היי, נעים להכיר, שמי מלי מגן ואני מתווכת נדל"ן עם ניסיון עשיר בתחום ובעלת משרד תיווך Real 770 בראש העין.

במהלך הקריירה שלי, הובלתי (ועדיין מובילה!) עסקאות רבות וליוויתי בהצלחה מאות לקוחות מרוצים בעסקת חייהם ומצאתי להם את הפתרונות המושלמים לצרכים ולחלומות שלהם. אני מתמחה בעסקאות מגורים.

בעלת תואר ראשון במשפטים LLB.

הערך המוביל אותי הוא יושרה, שקיפות והבנה עמוקה של שוק הנדל"ן המקומי, הלקוחות שלי זוכים ליחס אישי, זמינות מלאה לאורך כל תהליך העסקה ומקבלים את כל המידע וההכוונה הנדרשים לקבלת החלטות נכונות.

אז בין אם אתם מחפשים דירה לחלום בה או למכור את דירתכם הקיימת וצריכים ייעוץ מקצועי – אני כאן בשבילכם, וזאת, כדי להפוך את התהליך לפשוט, מהנה ומוצלח ככל האפשר.

אני מזמינה אתכם ליצור קשר ולקבל את השירות המקצועי והאישי ביותר בעולם הנדל"ן שבו מעורבים אנשים ומשפחות.`,
      image: null,
      background: null,
    };
  }
}

export async function AboutSection() {
  const about = await getAboutContent();
  const paragraphs = about.text.split("\n").filter((p) => p.trim() !== "");
  const hasBgImage = about.background && about.background.length > 0;

  return (
    <section id="about" className="relative overflow-hidden">
      {/* Background layer */}
      {hasBgImage ? (
        <>
          {/* Photo background with dark overlay */}
          <Image
            src={about.background!}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            quality={80}
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
        </>
      ) : (
        <>
          {/* Default dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1a2e] via-[#0f2137] to-[#0b1a2e]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-primary-400/5 rounded-full blur-[100px]" />
        </>
      )}

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />

      <div className="relative z-10 py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile Photo */}
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-gold/30 via-gold/10 to-gold/30 rounded-full blur-lg" />
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-[3px] border-gold/50 shadow-2xl ring-2 ring-gold/10 ring-offset-4 ring-offset-black/30">
                {about.image ? (
                  <Image
                    src={about.image}
                    alt="מלי מגן"
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center">
                    <span className="text-white text-5xl font-bold">מ</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-0.5 bg-gold/50 rounded-full" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gold drop-shadow-lg">
            {about.title}
          </h2>

          {/* Bio Text */}
          <div className="space-y-5">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-gray-200 text-base md:text-lg leading-[1.9] text-center drop-shadow-sm"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="flex justify-center mt-14">
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-10" />
    </section>
  );
}
