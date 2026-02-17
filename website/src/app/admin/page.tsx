import Link from "next/link";
import { Building2, FileText, MessageSquare, TrendingUp, Phone, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminDashboard() {
  const [propertiesCount, blogCount, contactsCount, unreadContacts] =
    await Promise.all([
      db.property.count({ where: { published: true } }),
      db.blogPost.count({ where: { published: true } }),
      db.contact.count(),
      db.contact.count({ where: { read: false } }),
    ]);

  const recentContacts = await db.contact.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "נכסים פעילים", value: propertiesCount, icon: Building2, color: "bg-blue-500", href: "/admin/properties" },
    { label: "פוסטים בבלוג", value: blogCount, icon: FileText, color: "bg-green-500", href: "/admin/blog" },
    { label: "סה״כ פניות", value: contactsCount, icon: MessageSquare, color: "bg-purple-500", href: "/admin/contacts" },
    { label: "פניות חדשות", value: unreadContacts, icon: TrendingUp, color: "bg-orange-500", href: "/admin/contacts?filter=unread" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">לוח בקרה</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">פניות אחרונות</h2>
          <Link href="/admin/contacts" className="text-sm text-primary hover:underline flex items-center gap-1">
            צפה בכל הפניות
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentContacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">אין פניות עדיין</div>
          ) : (
            recentContacts.map((contact) => (
              <Link
                key={contact.id}
                href="/admin/contacts"
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors block"
              >
                <div className="flex items-center gap-3">
                  {!contact.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1" dir="ltr">
                      <Phone className="w-3 h-3" />
                      {contact.phone}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-400">
                    {new Date(contact.createdAt).toLocaleDateString("he-IL", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {!contact.read && (
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                      חדש
                    </span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
