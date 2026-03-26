import { useEffect, useState } from 'react';
import api from '../api';

const diasSemana = [
  { value: 'Lun', label: 'Lunes' },
  { value: 'Mar', label: 'Martes' },
  { value: 'Mie', label: 'Miercoles' },
  { value: 'Jue', label: 'Jueves' },
  { value: 'Vie', label: 'Viernes' },
];

const crearHorarioVacio = () => ({
  dia_semana: 'Lun',
  hora_inicio: '',
  hora_fin: '',
});

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [horariosGuardados, setHorariosGuardados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [profesor, setProfesor] = useState('');
  const [idPeriodo, setIdPeriodo] = useState('');
  const [horarios, setHorarios] = useState([crearHorarioVacio()]);

  const cargarDatos = async () => {
    try {
      const [resMaterias, resPeriodos, resHorarios] = await Promise.all([
        api.get('/materias'),
        api.get('/periodos'),
        api.get('/horarios'),
      ]);
      setMaterias(resMaterias.data);
      setPeriodos(resPeriodos.data);
      setHorariosGuardados(resHorarios.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!idPeriodo) {
      alert('Por favor selecciona un periodo');
      return;
    }
    if (
      horarios.length === 0 ||
      horarios.some((horario) => !horario.dia_semana || !horario.hora_inicio || !horario.hora_fin)
    ) {
      alert('Completa todos los horarios de la materia');
      return;
    }
    try {
      const resMateria = await api.post('/materias', {
        nombre,
        profesor,
        id_periodo: idPeriodo,
      });
      await Promise.all(
        horarios.map((horario) =>
          api.post('/horarios', {
            id_materia: resMateria.data.id_materia,
            dia_semana: horario.dia_semana,
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin,
          })
        )
      );
      setNombre('');
      setProfesor('');
      setIdPeriodo('');
      setHorarios([crearHorarioVacio()]);
      cargarDatos();
      alert('Materia y horarios agregados correctamente');
    } catch (error) {
      alert(error.response?.data?.error || 'Error al agregar la materia');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('Borrar esta materia?')) {
      try {
        await api.delete(`/materias/${id}`);
        cargarDatos();
        alert('Materia eliminada');
      } catch (error) {
        alert('Error al eliminar la materia');
      }
    }
  };

  const actualizarHorario = (index, campo, valor) => {
    setHorarios((actuales) =>
      actuales.map((horario, horarioIndex) =>
        horarioIndex === index ? { ...horario, [campo]: valor } : horario
      )
    );
  };

  const agregarHorario = () => {
    setHorarios((actuales) => [...actuales, crearHorarioVacio()]);
  };

  const eliminarHorario = (index) => {
    setHorarios((actuales) => {
      if (actuales.length === 1) {
        return [crearHorarioVacio()];
      }

      return actuales.filter((_, horarioIndex) => horarioIndex !== index);
    });
  };

  const resumenHorario = (idMateria) => {
    const horariosMateria = horariosGuardados
      .filter((horario) => String(horario.id_materia) === String(idMateria))
      .map((horario) => `${horario.dia_semana} ${String(horario.hora_inicio).slice(0, 5)}-${String(horario.hora_fin).slice(0, 5)}`);

    return horariosMateria.length > 0 ? horariosMateria.join(' | ') : 'Sin horario';
  };

  return (
    <div className="max-w-6xl">
      <div className="animate-soft-rise mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[var(--color-text)]">Mis materias</h1>
        </div>
      </div>

      <div
        className="animate-soft-rise mb-5 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
        style={{ animationDelay: '90ms' }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[var(--color-text)]">Agregar nueva materia</h2>
          <button
            type="submit"
            form="form-materias"
            className="rounded-2xl bg-[linear-gradient(135deg,#2563EB_0%,#06B6D4_100%)] px-5 py-2.5 font-bold text-white transition hover:brightness-95"
          >
            Guardar
          </button>
        </div>

        <form id="form-materias" onSubmit={handleCrear} className="grid items-start gap-4 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.35fr)]">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">Materia</span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                placeholder="Ej. Matematicas"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">Profesor</span>
              <input
                type="text"
                value={profesor}
                onChange={(e) => setProfesor(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                placeholder="Nombre del profesor"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">Periodo</span>
              <select
                value={idPeriodo}
                onChange={(e) => setIdPeriodo(e.target.value)}
                className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                required
              >
                <option value="">Selecciona un periodo...</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id_periodo} value={periodo.id_periodo}>
                    {periodo.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--color-text)]">Horarios por dia</p>
              <button
                type="button"
                onClick={agregarHorario}
                className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)] transition hover:brightness-95"
              >
                Agregar horario
              </button>
            </div>

            <div className="space-y-2.5">
              {horarios.map((horario, index) => (
                <div
                  key={index}
                  className="grid gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 md:grid-cols-[1.05fr_1fr_1fr_auto]"
                >
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Dia
                    </span>
                    <select
                      value={horario.dia_semana}
                      onChange={(e) => actualizarHorario(index, 'dia_semana', e.target.value)}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                      required
                    >
                      {diasSemana.map((dia) => (
                        <option key={dia.value} value={dia.value}>
                          {dia.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Hora inicio
                    </span>
                    <input
                      type="time"
                      value={horario.hora_inicio}
                      onChange={(e) => actualizarHorario(index, 'hora_inicio', e.target.value)}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      Hora fin
                    </span>
                    <input
                      type="time"
                      value={horario.hora_fin}
                      onChange={(e) => actualizarHorario(index, 'hora_fin', e.target.value)}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                      required
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => eliminarHorario(index)}
                    className="self-end rounded-2xl bg-[rgba(239,68,68,0.14)] px-3 py-2.5 font-semibold text-[var(--color-danger)] transition hover:bg-[rgba(239,68,68,0.2)]"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div
        className="animate-soft-rise overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_20px_45px_rgba(15,23,42,0.1)]"
        style={{ animationDelay: '180ms' }}
      >
        <table className="w-full text-left">
          <thead className="bg-[var(--color-surface-soft)] text-[var(--color-text)]">
            <tr>
              <th className="p-3">Materia</th>
              <th className="p-3">Profesor</th>
              <th className="p-3">Periodo</th>
              <th className="p-3">Horario</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[var(--color-text)]">
            {materias.map((materia) => (
              <tr key={materia.id_materia} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-semibold">{materia.nombre}</td>
                <td className="p-3">{materia.profesor}</td>
                <td className="p-3 font-medium text-[var(--color-secondary)]">{materia.periodo}</td>
                <td className="p-3 text-sm text-[var(--color-text-muted)]">{resumenHorario(materia.id_materia)}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEliminar(materia.id_materia)}
                    className="rounded-xl bg-[rgba(239,68,68,0.14)] px-3 py-1.5 font-semibold text-[var(--color-danger)]"
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {materias.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-[var(--color-text-muted)]">
                  No tienes materias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
