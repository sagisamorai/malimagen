"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  MapPin,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { markContactAsRead, markContactAsUnread, deleteContact } from "@/actions/contact";
import { Button } from "@/components/ui/Button";
import type { Contact } from "@prisma/client";

interface ContactsTableProps {
  contacts: Contact[];
}

function getSourceLabel(source: string | null): string {
  if (!source) return "כללי";
  if (source.startsWith("property-")) return "דף נכס";
  if (source === "general") return "כללי";
  if (source === "contact-page") return "דף יצירת קשר";
  if (source === "homepage") return "עמוד הבית";
  return source;
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleToggleRead = async (contact: Contact) => {
    setLoadingAction(contact.id);
    try {
      const result = contact.read
        ? await markContactAsUnread(contact.id)
        : await markContactAsRead(contact.id);

      if (result.success) {
        toast.success(contact.read ? "סומן כלא נקרא" : "סומן כנקרא");
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את הפנייה?")) return;

    setLoadingAction(id);
    try {
      const result = await deleteContact(id);
      if (result.success) {
        toast.success("הפנייה נמחקה");
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {contacts.map((contact) => {
          const isExpanded = expandedId === contact.id;
          const isLoading = loadingAction === contact.id;

          return (
            <div
              key={contact.id}
              className={`transition-colors ${!contact.read ? "bg-orange-50/50" : "hover:bg-gray-50"}`}
            >
              {/* Main Row */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => {
                  setExpandedId(isExpanded ? null : contact.id);
                  if (!contact.read) {
                    markContactAsRead(contact.id);
                  }
                }}
              >
                {/* Unread indicator */}
                <div className="shrink-0">
                  {!contact.read ? (
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                  )}
                </div>

                {/* Name & Phone */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${!contact.read ? "text-gray-900" : "text-gray-700"}`}>
                      {contact.name}
                    </span>
                    {!contact.read && (
                      <span className="text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">
                        חדש
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm text-gray-500 flex items-center gap-1" dir="ltr">
                      <Phone className="w-3 h-3" />
                      {contact.phone}
                    </span>
                    {contact.email && (
                      <span className="text-sm text-gray-400 flex items-center gap-1" dir="ltr">
                        <Mail className="w-3 h-3" />
                        {contact.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Source */}
                <div className="hidden md:block">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                    {getSourceLabel(contact.source)}
                  </span>
                </div>

                {/* Date */}
                <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400 shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(contact.createdAt).toLocaleDateString("he-IL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                {/* Expand icon */}
                <div className="shrink-0 text-gray-400">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="pt-4 space-y-4">
                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* Phone */}
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">טלפון</div>
                          <div className="font-medium text-gray-900" dir="ltr">{contact.phone}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-300 mr-auto" />
                      </a>

                      {/* Email */}
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">אימייל</div>
                            <div className="font-medium text-gray-900" dir="ltr">{contact.email}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-300 mr-auto" />
                        </a>
                      )}

                      {/* Source */}
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">מקור</div>
                          <div className="font-medium text-gray-900">{getSourceLabel(contact.source)}</div>
                        </div>
                        {contact.propertyId && (
                          <a
                            href={`/admin/properties/${contact.propertyId}/edit`}
                            className="text-xs text-primary hover:underline mr-auto"
                          >
                            צפה בנכס
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    {contact.message && (
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">הודעה</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {contact.message}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(contact);
                        }}
                        disabled={isLoading}
                      >
                        {contact.read ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            סמן כלא נקרא
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            סמן כנקרא
                          </>
                        )}
                      </Button>

                      <a href={`tel:${contact.phone}`}>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                          חייג
                        </Button>
                      </a>

                      {contact.email && (
                        <a href={`mailto:${contact.email}`}>
                          <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4" />
                            שלח מייל
                          </Button>
                        </a>
                      )}

                      <div className="mr-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(contact.id);
                          }}
                          disabled={isLoading}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          מחק
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
