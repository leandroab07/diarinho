import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { ActiveReminders } from "@/components/active-reminders";

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
    profile?.display_name || user.email?.split("@")[0] || "amigo(a)";

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar displayName={displayName} />
      <div className="flex-1 md:flex">
        <Sidebar
          profile={{
            displayName,
            avatarUrl: profile?.avatar_url ?? null,
            bio: profile?.bio ?? null,
          }}
        />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <ActiveReminders notifySoundDefault={profile?.notify_sound ?? true} />
    </div>
  );
}
