"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditableTaskTitle from "../../components/EditableTaskTitle";

type Task = {
  id: string;
  title: string;
  done: boolean;
  priority: number;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
};

export default function ProjectTasksPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [dueDate, setDueDate] = useState(""); // yyyy-mm-dd
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const priorityColors: Record<number, string> = {
    0: "bg-gray-200 text-gray-700",
    1: "bg-yellow-200 text-yellow-800",
    2: "bg-red-200 text-red-800",
  };
  const priorityLabels = ["Low", "Medium", "High"];

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  const orderedTasks = [...tasks].sort((a, b) => {
    if (a.done === b.done) return 0;
    return a.done ? 1 : -1;
  });
  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 86400000).toDateString();
  const groups: Record<"today" | "tomorrow" | "future" | "noDate", Task[]> = {
    today: [],
    tomorrow: [],
    future: [],
    noDate: [],
  };

  orderedTasks.forEach((task) => {
    if (!task.dueDate) return groups.noDate.push(task);
    const date = new Date(task.dueDate).toDateString();
    if (date === today) groups.today.push(task);
    else if (date === tomorrow) groups.tomorrow.push(task);
    else groups.future.push(task);
  });

  async function loadTasks() {
    setMsg("");
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao carregar tarefas");
        return;
      }
      setTasks(data);
    } catch {
      setError("Falha ao carregar tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setMsg("");
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          startDate: startDate ? `${startDate}T12:00:00.000Z` : null,
          dueDate: dueDate ? `${dueDate}T12:00:00.000Z` : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar tarefa");
        return;
      }

      setTitle("");
      setStartDate("");
      setDueDate("");
      setNotes("");
      setMessage("Task criada.");
      await loadTasks();
    } catch {
      setError("Falha ao criar task.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleDone(id: string, done: boolean) {
    setMsg("");
    setError(null);
    setMessage(null);

    const prev = tasks;
    setTasks((curr) => curr.map((t) => (t.id === id ? { ...t, done } : t)));

    try {
      const completedAt = done ? new Date().toISOString().slice(0, 10) : null;
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done, completedAt }),
      });

      if (!res.ok) throw new Error("PATCH failed");
    } catch {
      setTasks(prev);
      setError("Falha ao atualizar task.");
    }
  }

  async function cyclePriority(id: string, current: number) {
    setMsg("");
    setError(null);
    setMessage(null);

    const next = (current + 1) % 3;
    const prev = tasks;
    setTasks((curr) => curr.map((t) => (t.id === id ? { ...t, priority: next } : t)));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: next }),
      });

      if (!res.ok) throw new Error("PATCH failed");
    } catch {
      setTasks(prev);
      setError("Falha ao atualizar prioridade.");
    }
  }

  async function deleteTask(id: string) {
    const ok = window.confirm("Tem certeza que deseja excluir esta task?");
    if (!ok) return;

    setError(null);
    setMessage(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`DELETE task ${res.status}`);

      setMessage("Task excluída.");
      await loadTasks();
    } catch {
      setError("Falha ao excluir task.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center space-y-4 p-6">
      <div className="relative w-full">
        <a
          className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-slate-300 hover:text-slate-100"
          href="/dashboard"
        >
          ← Voltar
        </a>
        <h1 className="text-center text-2xl font-semibold">Tarefas do Projeto</h1>
      </div>

      {loading && (
        <div className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-sm">
          Carregando...
        </div>
      )}
      {error && (
        <div className="w-full rounded-md border border-red-800 bg-red-900/40 px-3 py-2 text-center text-sm text-red-200">
          {error}
        </div>
      )}
      {message && (
        <div className="w-full rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-sm">
          {message}
        </div>
      )}
      {msg && (
        <div className="w-full rounded-md bg-slate-800 px-3 py-2 text-center text-sm text-white">
          {msg}
        </div>
      )}

      <section className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
        <form
          onSubmit={createTask}
          className="mt-4 grid max-w-xl gap-4 text-center mx-auto justify-items-center"
        >
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
          />
          <textarea
            className="w-full min-h-[90px] rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
            placeholder="Observações (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={saving}
          />
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <label className="text-sm text-center">
              Data de início (opcional)
              <input
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={saving}
              />
            </label>
            <label className="text-sm text-center">
              Data (opcional)
              <input
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={saving}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="w-full rounded-lg bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Criar"}
          </button>
        </form>
      </section>

      <section className="w-full space-y-3">
        <h2 className="text-lg font-semibold">Minhas tarefas</h2>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-sky-400" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-center text-sm">
            Nenhuma tarefa ainda.
          </div>
        ) : (
          <div className="space-y-6">
            {groups.today.length > 0 && (
              <TaskSection
                title="Hoje"
                tasks={groups.today}
                deletingId={deletingId}
                onToggleDone={toggleDone}
                onCyclePriority={cyclePriority}
                onDelete={deleteTask}
                onSaveTitle={async (id, title) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ title }),
                  });
                  await loadTasks();
                }}
                onSaveDueDate={async (id, dueDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ dueDate }),
                  });
                  await loadTasks();
                }}
                onSaveStartDate={async (id, startDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ startDate }),
                  });
                  await loadTasks();
                }}
                priorityColors={priorityColors}
                priorityLabels={priorityLabels}
              />
            )}
            {groups.tomorrow.length > 0 && (
              <TaskSection
                title="Amanhã"
                tasks={groups.tomorrow}
                deletingId={deletingId}
                onToggleDone={toggleDone}
                onCyclePriority={cyclePriority}
                onDelete={deleteTask}
                onSaveTitle={async (id, title) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ title }),
                  });
                  await loadTasks();
                }}
                onSaveDueDate={async (id, dueDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ dueDate }),
                  });
                  await loadTasks();
                }}
                onSaveStartDate={async (id, startDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ startDate }),
                  });
                  await loadTasks();
                }}
                priorityColors={priorityColors}
                priorityLabels={priorityLabels}
              />
            )}
            {groups.future.length > 0 && (
              <TaskSection
                title="Próximas"
                tasks={groups.future}
                deletingId={deletingId}
                onToggleDone={toggleDone}
                onCyclePriority={cyclePriority}
                onDelete={deleteTask}
                onSaveTitle={async (id, title) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ title }),
                  });
                  await loadTasks();
                }}
                onSaveDueDate={async (id, dueDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ dueDate }),
                  });
                  await loadTasks();
                }}
                onSaveStartDate={async (id, startDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ startDate }),
                  });
                  await loadTasks();
                }}
                priorityColors={priorityColors}
                priorityLabels={priorityLabels}
              />
            )}
            {groups.noDate.length > 0 && (
              <TaskSection
                title="Sem data"
                tasks={groups.noDate}
                deletingId={deletingId}
                onToggleDone={toggleDone}
                onCyclePriority={cyclePriority}
                onDelete={deleteTask}
                onSaveTitle={async (id, title) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ title }),
                  });
                  await loadTasks();
                }}
                onSaveDueDate={async (id, dueDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ dueDate }),
                  });
                  await loadTasks();
                }}
                onSaveStartDate={async (id, startDate) => {
                  await fetch(`/api/tasks/${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ startDate }),
                  });
                  await loadTasks();
                }}
                priorityColors={priorityColors}
                priorityLabels={priorityLabels}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}

type TaskSectionProps = {
  title: string;
  tasks: Task[];
  deletingId: string | null;
  onToggleDone: (id: string, done: boolean) => Promise<void>;
  onCyclePriority: (id: string, current: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSaveTitle: (id: string, title: string) => Promise<void>;
  onSaveDueDate: (id: string, dueDate: string | null) => Promise<void>;
  onSaveStartDate: (id: string, startDate: string | null) => Promise<void>;
  priorityColors: Record<number, string>;
  priorityLabels: string[];
};

function TaskSection({
  title,
  tasks,
  deletingId,
  onToggleDone,
  onCyclePriority,
  onDelete,
  onSaveTitle,
  onSaveDueDate,
  onSaveStartDate,
  priorityColors,
  priorityLabels,
}: TaskSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      <div className="grid gap-4">
        {tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            deleting={deletingId === t.id}
            onToggleDone={onToggleDone}
            onCyclePriority={onCyclePriority}
            onDelete={onDelete}
            onSaveTitle={onSaveTitle}
            onSaveDueDate={onSaveDueDate}
            onSaveStartDate={onSaveStartDate}
            priorityColors={priorityColors}
            priorityLabels={priorityLabels}
          />
        ))}
      </div>
    </div>
  );
}

type TaskItemProps = {
  task: Task;
  deleting: boolean;
  onToggleDone: (id: string, done: boolean) => Promise<void>;
  onCyclePriority: (id: string, current: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSaveTitle: (id: string, title: string) => Promise<void>;
  onSaveDueDate: (id: string, dueDate: string | null) => Promise<void>;
  onSaveStartDate: (id: string, startDate: string | null) => Promise<void>;
  priorityColors: Record<number, string>;
  priorityLabels: string[];
};

function TaskItem({
  task,
  deleting,
  onToggleDone,
  onCyclePriority,
  onDelete,
  onSaveTitle,
  onSaveDueDate,
  onSaveStartDate,
  priorityColors,
  priorityLabels,
}: TaskItemProps) {
  const [loading, setLoading] = useState(false);
  const dateValue = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "";
  const startDateValue = task.startDate
    ? new Date(task.startDate).toISOString().slice(0, 10)
    : "";

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.done}
            disabled={loading}
            onChange={(e) => run(() => onToggleDone(task.id, e.target.checked))}
            className="mt-1 h-4 w-4"
          />
          <strong className={`text-base ${task.done ? "text-slate-500 line-through" : ""}`}>
            <EditableTaskTitle
              id={task.id}
              title={task.title}
              onSave={(id, title) => run(() => onSaveTitle(id, title))}
              disabled={loading}
            />
          </strong>
        </label>
        <button
          type="button"
          onClick={() => run(() => onCyclePriority(task.id, task.priority))}
          disabled={loading}
          className={`shrink-0 text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]} disabled:opacity-60`}
        >
          {priorityLabels[task.priority]}
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-slate-600">
          Início
          <input
            type="date"
            value={startDateValue}
            disabled={loading}
            onChange={(e) => run(() => onSaveStartDate(task.id, e.target.value || null))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
          />
        </label>
        <label className="text-xs text-slate-600">
          Data
          <input
            type="date"
            value={dateValue}
            disabled={loading}
            onChange={(e) => run(() => onSaveDueDate(task.id, e.target.value || null))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-sm text-white"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
        <span className="rounded-full bg-slate-800 px-2 py-0.5">
          Concluída: {task.done ? "Sim" : "Não"}
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-0.5">
          Início: {task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"}
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-0.5">
          Data: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
        </span>
        <span className="rounded-full bg-slate-800 px-2 py-0.5">
          Conclusão: {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "-"}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        disabled={deleting || loading}
        className="w-fit rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? "Excluindo..." : "Excluir"}
      </button>
    </div>
  );
}
