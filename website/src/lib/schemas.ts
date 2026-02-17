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
  floor: z.coerce.number().optional().nullable(),
  totalFloors: z.coerce.number().optional().nullable(),
  sizeBuilt: z.coerce.number().positive("שטח בנוי נדרש"),
  sizeGarden: z.coerce.number().optional().nullable(),
  yearBuilt: z.coerce.number().optional().nullable(),
  parking: z.boolean().default(false),
  storage: z.boolean().default(false),
  safeRoom: z.boolean().default(false),
  elevator: z.boolean().default(false),
  airCondition: z.boolean().default(false),
  balcony: z.boolean().default(false),
  renovated: z.boolean().default(false),
  accessible: z.boolean().default(false),
  featuredImage: z.string().optional(),
  areaId: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
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
