"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "../components/Alert";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    if (password !== confirmPassword) {
      setMsg("As senhas não conferem.");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      }),
    });

    if (!res.ok) {
      setMsg("Erro ao cadastrar");
      return;
    }

    setMsg("Cadastro feito! Redirecionando...");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-white shadow-xl">
        <div className="space-y-1 text-center">
          <h1 className="relative mx-auto flex w-fit items-center justify-center pl-7 text-2xl font-semibold text-sky-400">
            <span className="absolute left-0 h-4 w-4 animate-pulse rounded-full bg-sky-400" />
            <span className="absolute left-0 h-4 w-4 rounded-full bg-sky-400" />
            Cadastro
          </h1>
          <p className="text-sm text-slate-300">Crie sua conta e tenha acesso total.</p>
        </div>

        <form onSubmit={handleRegister} className="mt-4 grid gap-3">
          <div className="flex gap-2">
            <label className="relative w-full">
              <input
                className="peer w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 pb-2 pt-5 text-sm text-white outline-none focus:border-sky-400"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <span className="pointer-events-none absolute left-2.5 top-1 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-400 peer-valid:text-sky-400">
                Nome
              </span>
            </label>
            <label className="relative w-full">
              <input
                className="peer w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 pb-2 pt-5 text-sm text-white outline-none focus:border-sky-400"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <span className="pointer-events-none absolute left-2.5 top-1 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-400 peer-valid:text-sky-400">
                Sobrenome
              </span>
            </label>
          </div>

          <label className="relative">
            <input
              className="peer w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 pb-2 pt-5 text-sm text-white outline-none focus:border-sky-400"
              placeholder=" "
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="pointer-events-none absolute left-2.5 top-1 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-400 peer-valid:text-sky-400">
              E-mail
            </span>
          </label>

          <label className="relative">
            <input
              className="peer w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 pb-2 pt-5 text-sm text-white outline-none focus:border-sky-400"
              placeholder=" "
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="pointer-events-none absolute left-2.5 top-1 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-400 peer-valid:text-sky-400">
              Senha
            </span>
          </label>

          <label className="relative">
            <input
              className="peer w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 pb-2 pt-5 text-sm text-white outline-none focus:border-sky-400"
              placeholder=" "
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="pointer-events-none absolute left-2.5 top-1 text-xs text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-400 peer-valid:text-sky-400">
              Confirmar senha
            </span>
          </label>

          <button
            type="submit"
            className="rounded-lg bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-300"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-3">{msg && <Alert type={msg.includes("Erro") ? "error" : "success"}>{msg}</Alert>}</div>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-800" />
          <span className="text-xs uppercase tracking-wide text-slate-400">ou</span>
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs font-semibold text-white hover:border-slate-600 hover:bg-slate-700"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-4 w-4"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l5.5-5.5C34 3.4 29.3 1.5 24 1.5 14.8 1.5 7 6.9 3.6 14.7l6.6 5.1C12 14 17.6 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v7.8h12.7c-.3 2.1-1.6 5.3-4.6 7.4l7 5.4c4.1-3.8 6.4-9.3 6.4-16.5z"
              />
              <path
                fill="#34A853"
                d="M10.2 28.6a14.5 14.5 0 0 1 0-9.1l-6.6-5.1a22.5 22.5 0 0 0 0 19.3l6.6-5.1z"
              />
              <path
                fill="#FBBC05"
                d="M24 46.5c6.3 0 11.6-2.1 15.5-5.7l-7-5.4c-1.9 1.3-4.5 2.2-8.5 2.2-6.4 0-12-4.3-14-10.3l-6.6 5.1C7 40.1 14.8 46.5 24 46.5z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs font-semibold text-white hover:border-slate-600 hover:bg-slate-700"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="#0A66C2"
            >
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6 1.11 6 0 4.88 0 3.5 0 2.12 1.11 1 2.49 1c1.38 0 2.49 1.12 2.49 2.5zM.5 8.25h3.98V23H.5zM8.5 8.25h3.82v2.02h.05c.53-1 1.82-2.05 3.75-2.05C20.3 8.22 22 10.4 22 14.02V23h-3.98v-7.9c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.17V23H8.5z" />
            </svg>
            LinkedIn
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 text-xs font-semibold text-white hover:border-slate-600 hover:bg-slate-700"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3" fill="#181717">
                <path d="M12 1.5c-5.8 0-10.5 4.7-10.5 10.5 0 4.6 3 8.5 7.2 9.9.5.1.7-.2.7-.5v-1.9c-2.9.6-3.5-1.4-3.5-1.4-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.6-.7 1.9-1.1.1-.7.4-1.2.7-1.5-2.3-.3-4.8-1.1-4.8-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.2 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.2 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 4-2.5 4.8-4.9 5.1.4.3.8 1 .8 2v3c0 .3.2.6.7.5 4.2-1.4 7.2-5.3 7.2-9.9C22.5 6.2 17.8 1.5 12 1.5z" />
              </svg>
            </span>
            GitHub
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-slate-300">
          Já tem conta?{" "}
          <a className="font-medium text-sky-400 hover:underline" href="/login">
            Entrar
          </a>
        </p>
      </div>
    </main>
  );
}
