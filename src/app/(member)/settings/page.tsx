import type { Metadata } from "next";
import { ProfileSettingsForm } from "@/features/social/components/profile-settings-form";
import { getProfileSettings } from "@/features/social/server/queries";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Profile settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireSession();
  const settings = await getProfileSettings(session.user.id);
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Your account</p><h1 className="mt-2 text-4xl font-black">Profile & privacy</h1><p className="mt-3 text-zinc-500">Control how you appear and who can see the activity you create.</p><section className="mt-9 rounded-3xl border border-white/8 bg-white/[.035] p-6 sm:p-8"><ProfileSettingsForm initialValues={settings} /></section></div>;
}
