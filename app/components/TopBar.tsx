"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hide = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (hide) return;
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [hide]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (hide) return null;

  return (
    <div className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-end p-4">
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            Perfil
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-40 rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
              <a
                href="/register"
                className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              >
                Cadastro
              </a>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-300 hover:bg-slate-800 hover:text-red-200"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
