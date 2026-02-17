import { getAboutSettings } from "@/actions/settings";
import { AboutSettingsForm } from "./about-settings-form";

export default async function AdminSettingsPage() {
  const aboutSettings = await getAboutSettings();

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">הגדרות האתר</h1>
      <AboutSettingsForm initialData={aboutSettings} />
    </div>
  );
}
