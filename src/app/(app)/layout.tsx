import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { ReminderEngine } from "@/components/reminder-engine";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name ||
    user.email?.split("@")[0] ||
    "amigo(a)";

  return (
    <div className="min-h-screen md:flex">
      <Sidebar displayName={displayName} />
      <main className="flex-1 p-4 md:p-8 md:pl-0">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <ReminderEngine notifySoundDefault={profile?.notify_sound ?? true} />
    </div>
  );
}
