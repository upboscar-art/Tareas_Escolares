import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { correo, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.error ||
        (error.request ? 'No hay respuesta del servidor de login' : null) ||
        error.message ||
        'No se pudo iniciar sesión';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:grid-cols-[1.1fr_0.9fr]">
        <section className="animate-soft-rise hidden bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] p-8 text-white md:flex md:flex-col md:justify-between">
          <div className="inline-flex w-fit rounded-full border border-white/25 px-4 py-2 text-sm font-semibold tracking-[0.18em] uppercase text-blue-50">
            Tarevia
          </div>
          <div>
            <h1 className="max-w-sm text-4xl font-extrabold leading-tight lg:text-[2.7rem]">
              Organiza materias, tareas y fechas sin perder el ritmo.
            </h1>
            <p className="mt-4 max-w-md text-sm text-blue-50/90 lg:text-base">
              Un panel limpio para estudiar mejor, entregar a tiempo y ver tu avance con estilo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Estado</p>
              <p className="mt-2 text-2xl font-bold">En control</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4 backdrop-blur">
              <p className="text-sm text-blue-100">Flujo</p>
              <p className="mt-2 text-2xl font-bold">Productivo</p>
            </div>
          </div>
        </section>

        <section className="animate-soft-rise bg-[var(--color-surface)] p-7 md:p-8" style={{ animationDelay: '120ms' }}>
          <div className="mx-auto max-w-md pt-6 md:pt-4">
            <div className="mb-5 inline-flex rounded-full bg-[var(--color-surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] md:hidden">
              Tarevia
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">
              Acceso
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-text)] md:text-[2rem]">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Entra a tu espacio de trabajo y administra tus actividades con la paleta oficial de Tarevia.
            </p>

            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                  Correo
                </label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                  placeholder="tu_correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] px-4 py-3 font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-sm text-[var(--color-text-muted)]">
              No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
