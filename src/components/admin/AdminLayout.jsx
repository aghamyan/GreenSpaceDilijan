import { CalendarDays, ClipboardList, Gauge, LogOut, Trees } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase?.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-forest-700 text-white">
                <Trees size={22} />
              </span>
              <div>
                <p className="font-semibold leading-tight">GreenSpace</p>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Admin</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-forest-700 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/92 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Trees size={20} />
              Admin
            </div>
            <button type="button" onClick={handleLogout} className="rounded-md p-2 text-slate-600 hover:bg-slate-100">
              <LogOut size={20} />
            </button>
          </div>
          <nav className="mt-3 grid grid-cols-3 gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-center gap-2 rounded-md px-2 py-2 text-xs font-semibold ${
                    isActive ? "bg-forest-700 text-white" : "bg-slate-100 text-slate-700"
                  }`
                }
              >
                <Icon size={15} />
                <span className="truncate">{label}</span>
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

