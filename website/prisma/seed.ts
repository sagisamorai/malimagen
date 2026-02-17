import { PrismaClient, PropertyType, PropertyStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create areas
  const areas = await Promise.all([
    prisma.area.upsert({
      where: { slug: "pisgat-afek" },
      update: {},
      create: {
        name: "פסגות אפק",
        slug: "pisgat-afek",
        description: "שכונה חדשה ומבוקשת בראש העין",
        city: "ראש העין",
      },
    }),
    prisma.area.upsert({
      where: { slug: "merkaz-rosh-haayin" },
      update: {},
      create: {
        name: "מרכז ראש העין",
        slug: "merkaz-rosh-haayin",
        description: "מרכז העיר ראש העין",
        city: "ראש העין",
      },
    }),
    prisma.area.upsert({
      where: { slug: "nofei-hasharon" },
      update: {},
      create: {
        name: "נופי השרון",
        slug: "nofei-hasharon",
        city: "ראש העין",
      },
    }),
  ]);

  // Create blog categories
  await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: "tips" },
      update: {},
      create: { name: "טיפים", slug: "tips" },
    }),
    prisma.blogCategory.upsert({
      where: { slug: "market-updates" },
      update: {},
      create: { name: "עדכוני שוק", slug: "market-updates" },
    }),
    prisma.blogCategory.upsert({
      where: { slug: "guides" },
      update: {},
      create: { name: "מדריכים", slug: "guides" },
    }),
  ]);

  // Create sample testimonials
  await Promise.all([
    prisma.testimonial.upsert({
      where: { id: "testimonial-1" },
      update: {},
      create: {
        id: "testimonial-1",
        name: "משפחת כהן",
        content:
          "מלי ליוותה אותנו בתהליך רכישת הדירה בצורה מקצועית ואישית. היא הייתה זמינה לכל שאלה ודאגה לכל פרט.",
        rating: 5,
        order: 1,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-2" },
      update: {},
      create: {
        id: "testimonial-2",
        name: "יוסי ורונית לוי",
        content:
          "מכרנו את הדירה שלנו דרך מלי תוך שבועות ספורים. השיווק היה מעולה והיא השיגה לנו מחיר מעל הציפיות.",
        rating: 5,
        order: 2,
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-3" },
      update: {},
      create: {
        id: "testimonial-3",
        name: "דני ישראלי",
        content:
          "הליווי של מלי היה ברמה אחרת. מהרגע הראשון הרגשתי שאני בידיים טובות. ממליץ בחום!",
        rating: 5,
        order: 3,
      },
    }),
  ]);

  // Create site settings
  const settings = [
    { key: "site_title", value: "מלי מגן - תיווך נדל״ן" },
    { key: "site_description", value: "מתווכת נדל״ן עם ניסיון עשיר בפסגות אפק, ראש העין" },
    { key: "phone", value: "052-2207149" },
    { key: "whatsapp", value: "+972522207149" },
    { key: "email", value: "malior0770@gmail.com" },
    { key: "facebook", value: "https://www.facebook.com/profile.php?id=100000278814564" },
    { key: "instagram", value: "https://www.instagram.com/mali.magen/" },
    { key: "address", value: "ראש העין" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
