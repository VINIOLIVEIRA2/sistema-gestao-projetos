"use client";
import { useState } from "react";
import Alert from "../components/Alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.error ?? "Erro ao logar");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="login-stars" aria-hidden="true">
        <div className="star-layer layer-1" />
        <div className="star-layer layer-2" />
        <div className="star-layer layer-3" />
      </div>
      <div className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-white shadow-xl">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-sky-400">Login</h1>
          <p className="text-sm text-slate-300">Acesse sua conta para continuar.</p>
        </div>

        {msg && <Alert type={msg.includes("Erro") ? "error" : "success"}>{msg}</Alert>}

        <form onSubmit={handleLogin} className="grid gap-3">
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
            type="submit"
          >
            Entrar
          </button>
        </form>

        <p className="text-sm text-slate-300">
          Não tem conta?{" "}
          <a className="font-medium text-sky-400 hover:underline" href="/register">
            Criar agora
          </a>
        </p>
      </div>
    </main>
  );
}
