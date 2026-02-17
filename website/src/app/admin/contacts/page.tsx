import { db } from "@/lib/db";
import { MessageSquare, CheckCheck } from "lucide-react";
import { ContactsTable } from "./contacts-table";
import { MarkAllReadButton } from "./action-buttons";

interface Props {
  searchParams: { filter?: string; page?: string };
}

export default async function AdminContactsPage({ searchParams }: Props) {
  const filter = searchParams.filter || "all";
  const page = parseInt(searchParams.page || "1");
  const perPage = 20;

  const where =
    filter === "unread"
      ? { read: false }
      : filter === "read"
        ? { read: true }
        : {};

  const [contacts, total, unreadCount] = await Promise.all([
    db.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.contact.count({ where }),
    db.contact.count({ where: { read: false } }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">פניות</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} פניות סה״כ
            {unreadCount > 0 && (
              <span className="text-orange-600 font-medium"> • {unreadCount} חדשות</span>
            )}
          </p>
        </div>
        {unreadCount > 0 && <MarkAllReadButton />}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "הכל", count: total },
          { key: "unread", label: "חדשות", count: unreadCount },
          { key: "read", label: "נקראו", count: total - unreadCount },
        ].map((f) => (
          <a
            key={f.key}
            href={`/admin/contacts?filter=${f.key}`}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            {f.label}
            <span className="mr-1.5 opacity-70">({f.count})</span>
          </a>
        ))}
      </div>

      {/* Table */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-1">אין פניות</h3>
          <p className="text-sm text-gray-400">
            {filter === "unread" ? "אין פניות חדשות שלא נקראו" : "עדיין לא התקבלו פניות"}
          </p>
        </div>
      ) : (
        <ContactsTable contacts={contacts} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/contacts?filter=${filter}&page=${p}`}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
                ${
                  p === page
                    ? "bg-primary text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
