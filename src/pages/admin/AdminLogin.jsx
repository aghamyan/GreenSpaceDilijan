import { useEffect, useState } from "react";
import { CalendarCheck, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function redirectExistingAdmin() {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (active && isAdmin) {
        navigate("/admin/dashboard", { replace: true });
      }
    }

    redirectExistingAdmin();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Supabase environment variables are missing.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

    if (adminError || !isAdmin) {
      await supabase.auth.signOut();
      setMessage("This account is not allowed to access the admin panel.");
      setLoading(false);
      return;
    }

    navigate("/admin/dashboard", { replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-forest-700 text-white">
            <CalendarCheck size={23} />
          </span>
          <div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="text-sm text-slate-500">GreenSpace Dilijan bookings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-forest-700"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2.5 outline-none focus:border-forest-700"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-forest-700 px-4 py-2.5 font-semibold text-white hover:bg-forest-900 disabled:bg-slate-400"
          >
            <Lock size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800" role="alert">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}

