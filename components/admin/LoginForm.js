"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { loginAction } from "@/app/admin/actions";
import { inputClass } from "./ui";

export default function LoginForm({ configured }) {
  const [state, action, pending] = useActionState(loginAction, null);
  const [show, setShow] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand.png" alt="We Sell Dead Lots" className="mb-4 h-16 w-16 object-contain" />
          <h1 className="text-2xl font-bold text-slate-900">Website admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to edit We Sell Dead Lots</p>
        </div>

        <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {!configured && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              The admin panel isn&apos;t set up yet. Add ADMIN_PASSWORD, ADMIN_SESSION_SECRET and SANITY_API_WRITE_TOKEN to the environment settings.
            </p>
          )}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input id="password" name="password" type={show ? "text" : "password"} autoComplete="current-password" required autoFocus className={`${inputClass} pl-9 pr-10`} />
              <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {state?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
          <button
            type="submit"
            disabled={pending || !configured}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1392f9] font-semibold text-white shadow-sm transition hover:bg-[#0d7dd4] disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
