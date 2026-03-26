import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { nombre, correo, password });
      alert('Registro exitoso. Ahora inicia sesión.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="animate-soft-rise w-full max-w-xl rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[0_30px_80px_rgba(15,23,42,0.16)] md:p-10">
        <div className="inline-flex rounded-full bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-secondary)]">
          Crear cuenta
        </div>

        <h1 className="mt-5 text-4xl font-extrabold text-[var(--color-text)]">Bienvenido a Tarevia</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          Registra tu cuenta y empieza a organizar periodos, materias y entregas desde un solo lugar.
        </p>

        <form onSubmit={handleRegister} className="mt-8 flex flex-col gap-5">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded-2xl bg-[var(--color-secondary)] px-6 py-3 font-bold text-white transition hover:brightness-95"
          >
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-sm text-[var(--color-text-muted)]">
          Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
