import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-10">
      <section className="animate-soft-rise w-full max-w-5xl overflow-hidden rounded-[36px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] p-8 text-white md:p-10">
          <p className="inline-flex rounded-full border border-white/25 px-4 py-2 text-sm font-semibold uppercase tracking-[0.22em] text-blue-50">
            Tarevia
          </p>
          <h1 className="mt-8 text-4xl font-extrabold leading-tight md:text-5xl">
            Organiza tu semestre sin perder entregas.
          </h1>
          <p className="mt-5 max-w-lg text-base text-blue-50/90 md:text-lg">
            Periodos, materias, tareas y horario en un mismo espacio para que estudies con mas orden y menos estres.
          </p>
        </div>

        <div className="p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Inicio
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--color-text)]">Bienvenido a Tarevia</h2>
          <p className="mt-3 text-sm text-[var(--color-text-muted)]">
            Entra con tu cuenta para comenzar.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <Link
              to="/login"
              className="rounded-2xl bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] px-5 py-3 text-center font-bold text-white transition hover:brightness-95"
            >
              Iniciar sesion
            </Link>
            <Link
              to="/register"
              className="rounded-2xl border border-[var(--color-border)] px-5 py-3 text-center font-bold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
