import { useEffect, useState } from 'react';
import api from '../api';

const filtros = [
  { id: 'todas', label: 'Todas' },
  { id: 'vencidas', label: 'Vencidas' },
  { id: 'entregadas', label: 'Entregadas' },
];

const obtenerFechaLocal = (fecha) => {
  if (!fecha) return '';
  return String(fecha).split('T')[0];
};

const esTareaVencida = (tarea) => {
  if (tarea.completada || !tarea.fecha_entrega) return false;
  const hoy = new Date().toISOString().split('T')[0];
  return obtenerFechaLocal(tarea.fecha_entrega) < hoy;
};

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState({ titulo: '', id_materia: '', fecha: '' });
  const [filtroActivo, setFiltroActivo] = useState('todas');

  const cargar = async () => {
    try {
      const resM = await api.get('/materias');
      const resT = await api.get('/tareas');
      setMaterias(resM.data);
      setTareas(resT.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tareas', {
        titulo: form.titulo,
        id_materia: form.id_materia,
        fecha_entrega: form.fecha,
      });
      setForm({ titulo: '', id_materia: '', fecha: '' });
      cargar();
    } catch (error) {
      alert('Error al crear tarea');
    }
  };

  const cambiarEstado = async (tarea, completada) => {
    try {
      await api.put(`/tareas/${tarea.id_tarea}`, { completada });
      cargar();
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar la tarea');
    }
  };

  const eliminarTarea = async (idTarea) => {
    try {
      await api.delete(`/tareas/${idTarea}`);
      setTareas((actuales) => actuales.filter((tarea) => tarea.id_tarea !== idTarea));
    } catch (error) {
      console.error(error);
      alert('No se pudo eliminar la tarea');
    }
  };

  const tareasVencidas = tareas.filter((tarea) => esTareaVencida(tarea));
  const tareasEntregadas = tareas.filter((tarea) => tarea.completada);

  const tareasFiltradas =
    filtroActivo === 'vencidas'
        ? tareasVencidas
      : filtroActivo === 'entregadas'
        ? tareasEntregadas
        : tareas;

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-text)]">Mis tareas</h1>
        </div>
      </div>

      <form
        onSubmit={crear}
        className="animate-soft-rise mb-8 grid gap-4 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)] lg:grid-cols-[1.6fr_1fr_1fr_auto]"
      >
        <input
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Titulo de la tarea"
          required
        />
        <select
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          value={form.id_materia}
          onChange={(e) => setForm({ ...form, id_materia: e.target.value })}
          required
        >
          <option value="">Selecciona materia...</option>
          {materias.map((materia) => (
            <option key={materia.id_materia} value={materia.id_materia}>
              {materia.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          value={form.fecha}
          onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          required
        />
        <button className="rounded-2xl bg-[var(--color-warning)] px-6 py-3 font-bold text-white transition hover:brightness-95">
          Anadir
        </button>
      </form>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div
          className="animate-soft-rise rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
          style={{ animationDelay: '80ms' }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Total
          </p>
          <p className="mt-3 text-3xl font-extrabold text-[var(--color-text)]">{tareas.length}</p>
        </div>
        <div
          className="animate-soft-rise rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
          style={{ animationDelay: '160ms' }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-danger)]">
            Vencidas
          </p>
          <p className="mt-3 text-3xl font-extrabold text-[var(--color-text)]">{tareasVencidas.length}</p>
        </div>
        <div
          className="animate-soft-rise rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
          style={{ animationDelay: '240ms' }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-secondary)]">
            Entregadas
          </p>
          <p className="mt-3 text-3xl font-extrabold text-[var(--color-text)]">{tareasEntregadas.length}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {filtros.map((filtro) => (
          <button
            key={filtro.id}
            type="button"
            onClick={() => setFiltroActivo(filtro.id)}
            style={{ animationDelay: `${120 + filtros.indexOf(filtro) * 70}ms` }}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              filtroActivo === filtro.id
                ? 'bg-[var(--color-primary)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            } animate-soft-rise`}
          >
            {filtro.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
        {tareasFiltradas.map((tarea, index) => (
          <div
            key={tarea.id_tarea}
            style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
            className={`flex flex-col gap-4 border-t border-[var(--color-border)] p-4 first:border-t-0 md:flex-row md:items-center ${
              tarea.completada
                ? 'bg-[rgba(34,197,94,0.08)]'
                : esTareaVencida(tarea)
                  ? 'bg-[rgba(239,68,68,0.08)]'
                  : ''
            } animate-soft-rise`}
          >
            <div className="flex-1">
              <p
                className={`font-bold ${
                  tarea.completada ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text)]'
                }`}
              >
                {tarea.titulo}
              </p>
              <p className="text-xs font-semibold text-[var(--color-primary)]">{tarea.materia}</p>
            </div>
            <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-text-muted)]">
              {obtenerFechaLocal(tarea.fecha_entrega)}
            </span>
            {(tarea.completada || esTareaVencida(tarea)) && (
              <span
                className={`rounded-full px-3 py-2 text-sm font-semibold ${
                  tarea.completada
                    ? 'bg-[rgba(34,197,94,0.14)] text-[var(--color-secondary)]'
                    : 'bg-[rgba(239,68,68,0.14)] text-[var(--color-danger)]'
                }`}
              >
                {tarea.completada ? 'Entregada' : 'Vencida'}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {tarea.completada ? (
                <button
                  type="button"
                  onClick={() => cambiarEstado(tarea, false)}
                  className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-surface-soft)]"
                >
                  Reabrir
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => cambiarEstado(tarea, true)}
                  className="rounded-xl bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Marcar entregada
                </button>
              )}
              <button
                type="button"
                onClick={() => eliminarTarea(tarea.id_tarea)}
                className="rounded-xl bg-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {tareasFiltradas.length === 0 && (
          <div className="p-6 text-center text-[var(--color-text-muted)]">
            No hay tareas en la seccion seleccionada.
          </div>
        )}
      </div>
    </div>
  );
}
