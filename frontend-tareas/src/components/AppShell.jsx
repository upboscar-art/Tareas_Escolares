import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Inicio' },
  { to: '/periodos', label: 'Periodos' },
  { to: '/materias', label: 'Materias' },
  { to: '/tareas', label: 'Tareas' },
  { to: '/horario', label: 'Horario' },
];

export default function AppShell() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="min-h-screen px-4 pb-4 pt-8 sm:px-6 sm:pt-8">
      <div className="mx-auto flex max-w-7xl items-start gap-6">
        <aside className="sticky top-24 hidden h-[calc(100vh-10rem)] w-[280px] shrink-0 overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)] lg:flex lg:flex-col">
          <div className="rounded-[24px] bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] p-4 text-white">
            <p className="text-lg font-extrabold uppercase tracking-[0.18em] text-blue-50">Tarevia</p>
            <p className="mt-2 text-base leading-relaxed text-blue-50/90">Tu espacio de organizacion academica.</p>
          </div>

          <nav className="mt-4 flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-2.5 font-semibold transition ${
                    isActive
                      ? 'bg-[var(--color-surface-soft)] text-[var(--color-text)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={cerrarSesion}
            className="mt-4 w-full rounded-2xl bg-[var(--color-danger)] px-4 py-3 font-bold text-white transition hover:brightness-95"
          >
            Salir
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-3 overflow-x-auto lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="pt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
