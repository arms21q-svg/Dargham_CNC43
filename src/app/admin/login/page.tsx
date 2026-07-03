"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setError("كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-xl space-y-5"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gold mx-auto flex items-center justify-center mb-3">
            <span className="text-navy-900 font-bold">D</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">لوحة إدارة ضرغام</h1>
          <p className="text-sm text-gray-500 mt-1">أدخل كلمة المرور للمتابعة</p>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-400/40"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-navy-800 text-white rounded-lg font-medium hover:bg-navy-700 disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          الافتراضي: dirgham2025 — غيّرها عبر ADMIN_PASSWORD
        </p>
      </form>
    </div>
  );
}
