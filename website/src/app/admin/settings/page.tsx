import { getAboutSettings, getHeroImage } from "@/actions/settings";
import { AboutSettingsForm } from "./about-settings-form";
import { HeroSettingsForm } from "./hero-settings-form";

export default async function AdminSettingsPage() {
  const [aboutSettings, heroImage] = await Promise.all([
    getAboutSettings(),
    getHeroImage(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">הגדרות האתר</h1>

      {/* Hero Image Settings */}
      <div className="mb-12">
        <HeroSettingsForm initialImage={heroImage} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-8" />

      {/* About Section Settings */}
      <AboutSettingsForm initialData={aboutSettings} />
    </div>
  );
}
