export const SITE_CONFIG = {
  name: "מלי מגן",
  title: "מלי מגן - תיווך נדל״ן",
  description:
    "מתווכת נדל״ן עם ניסיון עשיר בתחום, מתמחה בפסגות אפק ראש העין. ליווי אישי במכירה וקנייה של נכסים.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://malimagen.co.il",
  phone: process.env.NEXT_PUBLIC_PHONE || "052-2207149",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "+972522207149",
  email: process.env.NEXT_PUBLIC_EMAIL || "malior0770@gmail.com",
  social: {
    facebook:
      "https://www.facebook.com/profile.php?id=100000278814564",
    instagram: "https://www.instagram.com/mali.magen/",
  },
  address: "ראש העין",
} as const;

export const NAV_ITEMS = [
  { label: "דף הבית", href: "/" },
  { label: "נכסים", href: "/properties" },
  { label: "אודות", href: "/about" },
  { label: "בלוג", href: "/blog" },
  { label: "צור קשר", href: "/contact" },
] as const;

export const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "דירה" },
  { value: "GARDEN_APT", label: "דירת גן" },
  { value: "PENTHOUSE", label: "פנטהאוז" },
  { value: "COTTAGE", label: "קוטג׳" },
  { value: "DUPLEX", label: "דופלקס" },
  { value: "STUDIO", label: "סטודיו" },
  { value: "LAND", label: "מגרש" },
  { value: "COMMERCIAL", label: "מסחרי" },
] as const;

export const PROPERTY_STATUSES = [
  { value: "FOR_SALE", label: "למכירה" },
  { value: "FOR_RENT", label: "להשכרה" },
  { value: "SOLD", label: "נמכר" },
  { value: "RENTED", label: "הושכר" },
] as const;

export const ROOMS_OPTIONS = [
  { value: "2", label: "2 חדרים" },
  { value: "3", label: "3 חדרים" },
  { value: "3.5", label: "3.5 חדרים" },
  { value: "4", label: "4 חדרים" },
  { value: "4.5", label: "4.5 חדרים" },
  { value: "5", label: "5 חדרים" },
  { value: "5.5", label: "5.5 חדרים" },
  { value: "6", label: "6+ חדרים" },
] as const;

export const SERVICES = [
  {
    title: "למוכרים",
    description: "מכירת נכסים",
    items: [
      "ליווי אישי וצמוד לאורך כל התהליך",
      "בניית אסטרטגיית שיווק מותאמת אישית לכל נכס",
      "ניהול משא ומתן מקצועי להשגת תנאי עסקה הטובים ביותר עבורכם",
      "טיפול מלא בכל ההיבטים הבירוקרטיים ועד לחתימת חוזה",
      "ייעוץ משפטי מקצועי על ידי עורך דין מטעם המשרד",
    ],
    icon: "home",
  },
  {
    title: "לקונים",
    description: "קנייה וייעוץ נדל״ן",
    items: [
      "אפיון ובדיקת צרכים של הקונים",
      "איתור הנכס המושלם עבורכם",
      "בדיקת כדאיות הרכישה",
      "ליווי בתהליך המשכנתא",
    ],
    icon: "search",
  },
] as const;

export const ADVANTAGES = [
  {
    title: "חסכון בזמן",
    description:
      "מכירת דירה אינה עסק פשוט. אני משקיעה את מירב המאמצים כדי להוביל למכירת הנכס שלכם תוך זמן קצר מבלי שתצטרכו להתאמץ כלל.",
    icon: "clock",
  },
  {
    title: "שיווק מיטבי",
    description:
      "אני עובדת עם מגוון רחב של לוחות נדל״ן וברשתות החברתיות, לרבות קמפיינים ממומנים על חשבוני, מה שמאפשר לי לחשוף את הנכס למספר גבוה מאוד של אנשים.",
    icon: "megaphone",
  },
  {
    title: "זמני קנייה",
    description:
      "מכירת הדירה בליווי שלי מזרזת את מועד הרכישה עם לקוח פוטנציאלי ומונעת מהדירה לעמוד למכירה זמן רב.",
    icon: "zap",
  },
] as const;

export const ITEMS_PER_PAGE = 12;
