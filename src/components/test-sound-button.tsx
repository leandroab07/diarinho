"use client";

import { Button } from "@/components/ui/button";
import { playReminderChime } from "@/lib/sound";
import { Volume2 } from "lucide-react";
import { toast } from "sonner";

export function TestSoundButton() {
  return (
    <Button
      type="button"
      variant="soft"
      onClick={() => {
        playReminderChime();
        toast("🔔 Sininho!", { description: "É esse o som dos lembretes." });
      }}
    >
      <Volume2 className="h-4 w-4" /> Testar som
    </Button>
  );
}
