import { getAboutSettings, getHeroCategoryData } from "@/actions/settings";
import { AboutSettingsForm } from "./about-settings-form";
import { HeroSettingsForm } from "./hero-settings-form";

export default async function AdminSettingsPage() {
  const [aboutSettings, heroData] = await Promise.all([
    getAboutSettings(),
    getHeroCategoryData(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">הגדרות האתר</h1>

      {/* Hero Section Settings */}
      <div className="mb-12">
        <HeroSettingsForm initialData={heroData} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />

      {/* About Section Settings */}
      <AboutSettingsForm initialData={aboutSettings} />
    </div>
  );
}
