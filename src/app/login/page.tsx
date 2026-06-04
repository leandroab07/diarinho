"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("Não consegui entrar 🥺", { description: error.message });
      return;
    }
    toast.success("Bem-vindo de volta! 🌸");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3 pt-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-[var(--primary)]/15 flex items-center justify-center animate-float">
            <Sparkles className="h-8 w-8 text-[var(--primary)]" />
          </div>
          <CardTitle className="text-3xl font-handwriting text-[var(--primary)]">
            Diarinho
          </CardTitle>
          <CardDescription>
            Que bom te ver! Entra pra continuar seu diário ✨
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)]" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-fg)]" />
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar 🌸"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted-fg)]">
            Ainda não tem conta?{" "}
            <Link
              href="/signup"
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Criar uma agora
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
