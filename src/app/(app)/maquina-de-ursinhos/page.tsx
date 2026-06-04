import { ClawMachine } from "@/components/claw-machine";

export const dynamic = "force-static";

export default function ClawMachinePage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="inline-flex h-12 w-12 rounded-2xl bg-[var(--primary)]/15 items-center justify-center animate-float">
            🧸
          </span>
          Joguinho
        </h1>
        <p className="text-[var(--muted-fg)] mt-1">
          Pega os ursinhos com a garra e monta sua coleção 💝
        </p>
      </header>

      <ClawMachine />
    </div>
  );
}
