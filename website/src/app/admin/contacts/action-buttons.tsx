"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { markAllContactsAsRead } from "@/actions/contact";
import { Button } from "@/components/ui/Button";

export function MarkAllReadButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!confirm("לסמן את כל הפניות כנקראו?")) return;

    setLoading(true);
    try {
      const result = await markAllContactsAsRead();
      if (result.success) {
        toast.success("כל הפניות סומנו כנקראו");
      } else {
        toast.error(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick} disabled={loading}>
      <CheckCheck className="w-4 h-4" />
      סמן הכל כנקרא
    </Button>
  );
}
