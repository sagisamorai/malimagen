# MaliMagen - אתר תיווך נדל"ן

אתר מודרני למלי מגן - מתווכת נדל"ן בראש העין, בנוי עם Next.js 14 ו-TypeScript.

## Stack טכנולוגי

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Neon (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Validation**: Zod
- **Forms**: React Hook Form
- **Image Upload**: Cloudinary
- **Icons**: Lucide React
- **Notifications**: Sonner

## מבנה תיקיות

```
website/
├── prisma/
│   ├── schema.prisma         # סכמת DB
│   └── seed.ts               # נתוני התחלה
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (marketing)/      # דפים ציבוריים
│   │   │   ├── page.tsx       # דף הבית
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── properties/
│   │   │   └── blog/
│   │   ├── admin/             # ממשק ניהול (מוגן)
│   │   │   ├── page.tsx       # לוח בקרה
│   │   │   ├── properties/    # ניהול נכסים
│   │   │   └── blog/          # ניהול בלוג
│   │   ├── api/
│   │   │   ├── webhooks/clerk/  # Clerk webhook
│   │   │   └── upload/          # העלאת תמונות
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/               # קומפוננטות UI בסיסיות
│   │   ├── layout/           # Header, Footer, AdminSidebar
│   │   ├── home/             # סקשנים של דף הבית
│   │   ├── properties/       # קומפוננטות נכסים
│   │   ├── forms/            # טפסים
│   │   └── shared/           # קומפוננטות משותפות
│   ├── lib/
│   │   ├── db.ts             # Prisma client
│   │   ├── utils.ts          # פונקציות עזר
│   │   ├── constants.ts      # קבועים
│   │   └── schemas.ts        # Zod schemas
│   ├── actions/
│   │   ├── properties.ts     # Server actions לנכסים
│   │   ├── blog.ts           # Server actions לבלוג
│   │   └── contact.ts        # Server action לטופס
│   └── types/
│       └── index.ts          # TypeScript types
├── middleware.ts              # Clerk middleware
├── next.config.mjs
├── tailwind.config.ts
├── package.json
└── .env.example
```

## סכמת Database

```
┌─────────────────┐     ┌─────────────────┐
│     users        │     │     areas        │
├─────────────────┤     ├─────────────────┤
│ id (clerk)       │     │ id              │
│ email            │     │ name            │
│ firstName        │     │ slug            │
│ lastName         │     │ description     │
│ role (ADMIN/     │     │ city            │
│   EDITOR/VIEWER) │     └────────┬────────┘
└───────┬─────────┘              │
        │                        │
        │     ┌──────────────────┤
        │     │                  │
┌───────┴─────┴───┐     ┌───────┴─────────┐
│   properties     │     │ property_images  │
├─────────────────┤     ├─────────────────┤
│ id, title, slug  │     │ id              │
│ description      │     │ url, alt, order │
│ price, type      │◄────│ propertyId      │
│ status, address  │     └─────────────────┘
│ rooms, floor     │
│ amenities (bool) │     ┌─────────────────┐
│ SEO fields       │     │  blog_posts      │
│ featured, pub    │     ├─────────────────┤
│ areaId, authorId │     │ id, title, slug │
└─────────────────┘     │ content, excerpt│
                         │ SEO fields      │
┌─────────────────┐     │ authorId        │
│  testimonials    │     │ categoryId      │
├─────────────────┤     └─────────────────┘
│ id, name         │
│ content, rating  │     ┌─────────────────┐
│ published, order │     │   contacts       │
└─────────────────┘     ├─────────────────┤
                         │ id, name, phone │
┌─────────────────┐     │ email, message  │
│ site_settings    │     │ source, read    │
├─────────────────┤     └─────────────────┘
│ key, value       │
└─────────────────┘
```

## התקנה מקומית

### דרישות מוקדמות

- Node.js >= 18
- npm / yarn / pnpm
- חשבון [Neon](https://neon.tech) (PostgreSQL)
- חשבון [Clerk](https://clerk.com) (Authentication)
- חשבון [Cloudinary](https://cloudinary.com) (Image Upload) - אופציונלי

### שלבים

1. **Clone והתקנה**:
```bash
cd website
npm install
```

2. **הגדרת Environment Variables**:
```bash
cp .env.example .env
```
ערוך את `.env` עם הערכים שלך:

| משתנה | תיאור | מקור |
|--------|--------|-------|
| `DATABASE_URL` | Connection string ל-PostgreSQL | Neon Dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard |
| `CLERK_WEBHOOK_SECRET` | Webhook verification | Clerk Webhooks |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | API key | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | API secret | Cloudinary Dashboard |
| `NEXT_PUBLIC_SITE_URL` | כתובת האתר | שלך |

3. **הגדרת Database**:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

4. **הרצה מקומית**:
```bash
npm run dev
```
האתר יעלה ב-[http://localhost:3000](http://localhost:3000)

5. **הגדרת Admin**:
   - הירשם דרך `/sign-in`
   - עדכן את ה-role ל-`ADMIN` ב-database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
   - או דרך Prisma Studio: `npx prisma studio`

### Clerk Webhook Setup

1. ב-Clerk Dashboard, לך ל-Webhooks
2. צור endpoint חדש: `https://your-domain.com/api/webhooks/clerk`
3. בחר events: `user.created`, `user.updated`, `user.deleted`
4. העתק את ה-Signing Secret ל-`CLERK_WEBHOOK_SECRET`

## Deploy ל-Vercel

### שלבים

1. **Push ל-GitHub**:
```bash
cd website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-user/malimagen.git
git push -u origin main
```

2. **Import ב-Vercel**:
   - לך ל-[vercel.com/new](https://vercel.com/new)
   - בחר את הריפו
   - Root Directory: `website`
   - Framework: Next.js (auto-detected)

3. **הגדר Environment Variables**:
   - הוסף את כל המשתנים מ-`.env.example`
   - ודא ש-`NEXT_PUBLIC_SITE_URL` מצביע ל-domain הסופי

4. **Deploy!** Vercel יריץ build אוטומטי

5. **Post-deploy**:
   - עדכן את Clerk webhook URL ל-production domain
   - עדכן Allowed Origins ב-Clerk Dashboard
   - הרץ seed אם צריך

### Custom Domain

1. ב-Vercel Dashboard → Domains
2. הוסף `malimagen.co.il`
3. עדכן DNS records בהתאם להוראות

## פקודות שימושיות

```bash
npm run dev          # הרצה מקומית
npm run build        # בניית production
npm run lint         # בדיקת לינטר
npm run db:generate  # עדכון Prisma Client
npm run db:push      # Push schema ל-DB
npm run db:migrate   # יצירת migration
npm run db:seed      # הרצת seed
npm run db:studio    # פתיחת Prisma Studio
```

## רישיון

כל הזכויות שמורות &copy; מלי מגן
