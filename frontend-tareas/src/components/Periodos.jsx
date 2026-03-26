import { useEffect, useState } from 'react';
import api from '../api';

export default function Periodos() {
  const [periodos, setPeriodos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [periodoActivoId, setPeriodoActivoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const cargarPeriodos = async () => {
    try {
      const [responsePeriodos, responseMaterias, responseHorarios] = await Promise.all([
        api.get('/periodos'),
        api.get('/materias'),
        api.get('/horarios'),
      ]);
      setPeriodos(responsePeriodos.data);
      setMaterias(responseMaterias.data);
      setHorarios(responseHorarios.data);
    } catch (error) {
      console.error('Error al cargar periodos:', error);
    }
  };

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await api.post('/periodos', {
        nombre,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
      cargarPeriodos();
      alert('Periodo creado correctamente');
    } catch (error) {
      alert('Error al crear el periodo');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('Seguro que deseas borrar este periodo?')) {
      try {
        await api.delete(`/periodos/${id}`);
        if (String(periodoActivoId) === String(id)) {
          setPeriodoActivoId(null);
        }
        cargarPeriodos();
        alert('Periodo eliminado');
      } catch (error) {
        alert('Error al eliminar el periodo');
      }
    }
  };

  const handleEliminarMateria = async (idMateria) => {
    if (window.confirm('Seguro que deseas borrar esta materia?')) {
      try {
        await api.delete(`/materias/${idMateria}`);
        cargarPeriodos();
        alert('Materia eliminada');
      } catch (error) {
        alert('Error al eliminar la materia');
      }
    }
  };

  const materiasPorPeriodo = (idPeriodo) =>
    materias.filter((materia) => String(materia.id_periodo) === String(idPeriodo));

  const horariosPorMateria = (idMateria) =>
    horarios.filter((horario) => String(horario.id_materia) === String(idMateria));

  const periodoActivo = periodos.find((periodo) => String(periodo.id_periodo) === String(periodoActivoId));
  const materiasDelPeriodoActivo = periodoActivo ? materiasPorPeriodo(periodoActivo.id_periodo) : [];

  return (
    <div className="max-w-6xl">
      <div className="animate-soft-rise mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-4xl font-extrabold text-[var(--color-text)]">Mis periodos</h1>
        </div>
      </div>

      <div
        className="animate-soft-rise mb-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
        style={{ animationDelay: '90ms' }}
      >
        <h2 className="mb-5 text-xl font-bold text-[var(--color-text)]">Agregar nuevo periodo</h2>
        <form onSubmit={handleCrear} className="grid gap-4 lg:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Nombre del periodo</span>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              placeholder="Ej. 2026-1"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Fecha de inicio</span>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Fecha de fin</span>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
              required
            />
          </label>
          <button
            type="submit"
            className="self-end rounded-2xl bg-[var(--color-secondary)] px-6 py-3 font-bold text-white transition hover:brightness-95"
          >
            Guardar
          </button>
        </form>
      </div>

      <div
        className="animate-soft-rise overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
        style={{ animationDelay: '180ms' }}
      >
        <table className="w-full text-left">
          <thead className="bg-[var(--color-surface-soft)] text-[var(--color-text)]">
            <tr>
              <th className="p-4">Periodo</th>
              <th className="p-4">Fecha inicio</th>
              <th className="p-4">Fecha fin</th>
              <th className="p-4">Materias</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-text)]">
            {periodos.map((periodo) => {
              const materiasDelPeriodo = materiasPorPeriodo(periodo.id_periodo);

              return (
                <tr key={periodo.id_periodo} className="border-t border-[var(--color-border)] align-top">
                  <td className="p-4 font-semibold text-[var(--color-primary)]">{periodo.nombre}</td>
                  <td className="p-4">{periodo.fecha_inicio.split('T')[0]}</td>
                  <td className="p-4">{periodo.fecha_fin.split('T')[0]}</td>
                  <td className="p-4">
                    <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                      {materiasDelPeriodo.length} {materiasDelPeriodo.length === 1 ? 'materia' : 'materias'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPeriodoActivoId((actual) =>
                            String(actual) === String(periodo.id_periodo) ? null : periodo.id_periodo
                          )
                        }
                        className="rounded-xl bg-[var(--color-surface-soft)] px-3 py-2 font-semibold text-[var(--color-primary)] transition hover:brightness-95"
                      >
                        {String(periodoActivoId) === String(periodo.id_periodo) ? 'Ocultar contenido' : 'Ver contenido'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminar(periodo.id_periodo)}
                        className="rounded-xl bg-[rgba(239,68,68,0.14)] px-3 py-2 font-semibold text-[var(--color-danger)]"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {periodos.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[var(--color-text-muted)]">
                  No tienes periodos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {periodoActivo && (
        <section
          className="animate-soft-rise mt-8 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
          style={{ animationDelay: '220ms' }}
        >
          <div className="mb-6 rounded-[24px] bg-[var(--color-surface-soft)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
              Contenido del periodo
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-text)]">{periodoActivo.nombre}</h2>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">
              Del {periodoActivo.fecha_inicio.split('T')[0]} al {periodoActivo.fecha_fin.split('T')[0]}
            </p>
          </div>

          <div className="space-y-4">
            {materiasDelPeriodoActivo.length > 0 ? (
              materiasDelPeriodoActivo.map((materia) => {
                const horariosDeMateria = horariosPorMateria(materia.id_materia);

                return (
                  <article
                    key={materia.id_materia}
                    className="flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg)] p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text)]">{materia.nombre}</h3>
                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        Profesor: <span className="font-semibold text-[var(--color-text)]">{materia.profesor || 'Sin profesor'}</span>
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {horariosDeMateria.length > 0 ? (
                          horariosDeMateria.map((horario) => (
                            <span
                              key={horario.id_horario}
                              className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-sm font-semibold text-[var(--color-primary)]"
                            >
                              {horario.dia_semana} {String(horario.hora_inicio).slice(0, 5)} - {String(horario.hora_fin).slice(0, 5)}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[var(--color-text-muted)]">Sin horario asignado</span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEliminarMateria(materia.id_materia)}
                      className="rounded-xl bg-[rgba(239,68,68,0.14)] px-4 py-3 font-semibold text-[var(--color-danger)] transition hover:bg-[rgba(239,68,68,0.2)]"
                    >
                      Eliminar materia
                    </button>
                  </article>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-center text-[var(--color-text-muted)]">
                Este periodo todavia no tiene materias.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
