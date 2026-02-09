"use client";

import { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  service: string;
  status: string;
  createdAt: string;
  requesterName?: string | null;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requesterName, setRequesterName] = useState("");
  const [title, setTitle] = useState("");
  const [service, setService] = useState("Design");
  const [status, setStatus] = useState("Em andamento");
  const [msg, setMsg] = useState("");
  const services = ["Design", "IPTV", "Software"];

  async function loadProjects() {
    setMsg("");
    const res = await fetch("/api/projects", {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Erro ao carregar projetos");
      return;
    }
    setProjects(data);
  }

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/projects", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, service, status, requesterName }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Erro ao criar projeto");
      return;
    }

    setTitle("");
    setRequesterName("");
    await loadProjects();
  }

  async function deleteProject(id: string) {
    setMsg("");
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error ?? "Erro ao excluir projeto");
      return;
    }

    await loadProjects();
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-6 p-6">
      <header className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold">Painel</h1>
        <p className="text-sm text-slate-300">Gerencie seus projetos e tarefas.</p>
      </header>

      {msg && (
        <div className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-sm">
          {msg}
        </div>
      )}

      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
        <h2 className="mx-auto w-full max-w-xl pt-1 text-left text-sm text-slate-300">
          Novo Projeto
        </h2>

        <form onSubmit={createProject} className="mx-auto mt-5 grid w-full max-w-xl gap-4">
          <input
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Nome do solicitante"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
          />
          <input
            className="h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Título do projeto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-sm text-slate-300">
            Serviço
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="mt-2 block h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-sky-400"
            >
              <option>Design</option>
              <option>IPTV</option>
              <option>Software</option>
            </select>
          </label>

          <label className="text-sm text-slate-300">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 block h-11 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-sky-400"
            >
              <option>Em andamento</option>
              <option>Finalizado</option>
            </select>
          </label>

          <button
            type="submit"
            className="mt-2 h-11 rounded-lg bg-sky-400 px-4 text-sm font-semibold text-slate-950 hover:bg-sky-300"
          >
            Criar
          </button>
        </form>
      </section>

      <section className="w-full space-y-3">
        <h2 className="text-lg font-semibold">Meus Projetos</h2>

        {projects.length === 0 ? (
          <div className="rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-sm">
            Nenhum projeto ainda.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((segment) => {
              const items = projects.filter((p) => p.service === segment);
              return (
                <div
                  key={segment}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                    {segment}
                  </h3>
                  <div className="mt-3 grid gap-4">
                    {items.length === 0 ? (
                      <div className="rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-xs text-slate-400">
                        Nenhum projeto.
                      </div>
                    ) : (
                      items.map((p) => (
                        <div
                          key={p.id}
                          className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl"
                        >
                          <div className="text-base font-semibold">{p.title}</div>
                          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-sky-200">
                            Solicitante: {p.requesterName || "N\u00e3o informado"}
                          </div>
                          <div className="text-sm text-slate-300">Serviço: {p.service}</div>
                          <div className="text-sm text-slate-300">Status: {p.status}</div>
                          <div className="flex items-center gap-3 pt-2">
                            <a
                              className="text-sm font-medium text-sky-300 underline decoration-slate-700 underline-offset-4 hover:text-sky-200"
                              href={`/projects/${p.id}`}
                            >
                              Ver tarefas
                            </a>
                            <button
                              onClick={() => deleteProject(p.id)}
                              className="text-sm text-red-300 hover:text-red-200"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
