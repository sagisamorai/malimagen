import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  phone: z
    .string()
    .min(9, "מספר טלפון לא תקין")
    .regex(/^[\d\-\+\s()]+$/, "מספר טלפון לא תקין"),
  email: z.string().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  source: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Helper: coerce to number, but treat empty string as undefined
const optionalNumber = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((val) => {
    if (val === null || val === undefined || val === "") return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  });

export const propertySchema = z.object({
  title: z.string().min(3, "כותרת חייבת להכיל לפחות 3 תווים"),
  slug: z.string().min(1, "slug נדרש"),
  description: z.string().min(10, "תיאור חייב להכיל לפחות 10 תווים"),
  price: z.coerce.number().positive("מחיר חייב להיות חיובי"),
  type: z.enum([
    "APARTMENT",
    "GARDEN_APT",
    "PENTHOUSE",
    "COTTAGE",
    "DUPLEX",
    "STUDIO",
    "LAND",
    "COMMERCIAL",
  ]),
  status: z.enum(["FOR_SALE", "FOR_RENT", "SOLD", "RENTED"]),
  address: z.string().min(3, "כתובת נדרשת"),
  city: z.string().default("ראש העין"),
  neighborhood: z.string().optional(),
  complex: z.string().optional(),
  rooms: z.coerce.number().positive("מספר חדרים נדרש"),
  floor: optionalNumber,
  totalFloors: optionalNumber,
  sizeBuilt: z.coerce.number().positive("שטח בנוי נדרש"),
  sizeGarden: optionalNumber,
  yearBuilt: optionalNumber,
  parking: z.coerce.boolean().default(false),
  storage: z.coerce.boolean().default(false),
  safeRoom: z.coerce.boolean().default(false),
  elevator: z.coerce.boolean().default(false),
  airCondition: z.coerce.boolean().default(false),
  balcony: z.coerce.boolean().default(false),
  renovated: z.coerce.boolean().default(false),
  accessible: z.coerce.boolean().default(false),
  featuredImage: z.string().optional(),
  areaId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(true),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const blogPostSchema = z.object({
  title: z.string().min(3, "כותרת חייבת להכיל לפחות 3 תווים"),
  slug: z.string().min(1, "slug נדרש"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "תוכן חייב להכיל לפחות 10 תווים"),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
  categoryId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;
