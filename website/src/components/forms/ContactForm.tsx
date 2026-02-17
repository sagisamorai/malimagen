"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/lib/schemas";
import { submitContact } from "@/actions/contact";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  propertyId?: string;
  source?: string;
}

export function ContactForm({ propertyId, source }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      propertyId,
      source: source || "general",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitContact(data);
    if (result.success) {
      toast.success("הפרטים נשלחו בהצלחה! נחזור אליך בהקדם.");
      reset();
    } else {
      toast.error(result.error || "שגיאה בשליחת הטופס");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="name"
        label="שם"
        placeholder="השם שלך"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        id="phone"
        label="מספר טלפון"
        placeholder="050-0000000"
        type="tel"
        dir="ltr"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        id="email"
        label="אימייל (אופציונלי)"
        placeholder="email@example.com"
        type="email"
        dir="ltr"
        error={errors.email?.message}
        {...register("email")}
      />

      <Textarea
        id="message"
        label="הודעה (אופציונלי)"
        placeholder="ספרו לנו במה נוכל לעזור..."
        error={errors.message?.message}
        {...register("message")}
      />

      <input type="hidden" {...register("propertyId")} />
      <input type="hidden" {...register("source")} />

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        שלח פרטים
      </Button>
    </form>
  );
}
