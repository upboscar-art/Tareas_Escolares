import { useEffect, useMemo, useState } from 'react';
import api from '../api';

const dias = [
  { short: 'Lun', label: 'Lunes' },
  { short: 'Mar', label: 'Martes' },
  { short: 'Mie', label: 'Miercoles' },
  { short: 'Jue', label: 'Jueves' },
  { short: 'Vie', label: 'Viernes' },
];

function normalizarHora(valor) {
  return String(valor || '').slice(0, 5);
}

function textoRango(inicio, fin) {
  return `${inicio} a ${fin}`;
}

export default function Horario() {
  const [horarios, setHorarios] = useState([]);
  const [materias, setMaterias] = useState([]);

  const cargarDatos = async () => {
    try {
      const [resHorarios, resMaterias] = await Promise.all([api.get('/horarios'), api.get('/materias')]);
      setHorarios(resHorarios.data);
      setMaterias(resMaterias.data);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm('Borrar este horario?')) {
      try {
        await api.delete(`/horarios/${id}`);
        cargarDatos();
        alert('Horario eliminado');
      } catch (error) {
        alert('Error al eliminar el horario');
      }
    }
  };

  const materiaPorId = (idMateria) =>
    materias.find((materia) => String(materia.id_materia) === String(idMateria));

  const bloques = useMemo(() => {
    const extras = horarios.map((horario) => ({
      inicio: normalizarHora(horario.hora_inicio),
      fin: normalizarHora(horario.hora_fin),
    }));

    const mapa = new Map();
    extras.forEach((bloque) => {
      mapa.set(`${bloque.inicio}-${bloque.fin}`, bloque);
    });

    return Array.from(mapa.values()).sort((a, b) => a.inicio.localeCompare(b.inicio));
  }, [horarios]);

  const horariosMap = useMemo(() => {
    const mapa = new Map();

    horarios.forEach((horario) => {
      const inicio = normalizarHora(horario.hora_inicio);
      const fin = normalizarHora(horario.hora_fin);
      mapa.set(`${horario.dia_semana}-${inicio}-${fin}`, horario);
    });

    return mapa;
  }, [horarios]);

  return (
    <div className="max-w-6xl">
      <div className="animate-soft-rise mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-extrabold text-[var(--color-text)]">Mi horario</h1>
        </div>
      </div>

      <section
        className="animate-soft-rise relative overflow-hidden rounded-[28px] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,#fffdf8_0%,#f8fbf7_100%)] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
        style={{ animationDelay: '90ms' }}
      >
        <div className="pointer-events-none absolute -left-8 top-16 h-24 w-24 rounded-full bg-[rgba(6,182,212,0.12)] blur-2xl" />
        <div className="pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full bg-[rgba(245,158,11,0.12)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-28 w-28 rounded-full bg-[rgba(34,197,94,0.12)] blur-3xl" />

        <div className="mb-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            Vista semanal
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-wide text-[#172033]">HORARIO ESCOLAR</h2>
        </div>

        {bloques.length === 0 ? (
          <div className="mx-auto mt-3 max-w-[760px] text-center">
            <div className="grid gap-2 md:grid-cols-5">
              {dias.map((dia) => (
                <div
                  key={dia.short}
                  className="rounded-xl border border-[rgba(34,197,94,0.12)] bg-[#dcebdd] px-2 py-2 text-center text-base font-bold text-[#172033] lg:text-lg"
                >
                  {dia.label}
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-[var(--color-text-muted)]">
              Aun no has agregado materias con horario. Crea una materia y define dia, hora inicio y hora fin para verla aqui.
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="mx-auto w-full max-w-[920px]">
              <div className="mb-3 grid gap-2" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                  {dias.map((dia) => (
                    <div
                      key={dia.short}
                      className="rounded-xl border border-[rgba(34,197,94,0.12)] bg-[#dcebdd] px-2 py-2 text-center text-base font-bold text-[#172033] lg:text-lg"
                    >
                      {dia.label}
                    </div>
                  ))}
              </div>

              <div className="space-y-1.5">
                {bloques.map((bloque) => (
                  <div key={`${bloque.inicio}-${bloque.fin}`} className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' }}>
                      {dias.map((dia) => {
                        const horario = horariosMap.get(`${dia.short}-${bloque.inicio}-${bloque.fin}`);
                        const materia = horario ? materiaPorId(horario.id_materia) : null;

                        return (
                          <div
                            key={`${dia.short}-${bloque.inicio}-${bloque.fin}`}
                            className={`rounded-xl border border-[rgba(34,197,94,0.1)] bg-[#e7f0e6] p-2 ${
                              horario ? 'min-h-[72px]' : 'min-h-[36px]'
                            }`}
                          >
                            {horario ? (
                              <div className="flex h-full flex-col justify-between rounded-lg bg-white/75 p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                                <div>
                                  <p className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-[var(--color-primary)]">
                                    {materia?.nombre || horario.materia || 'Clase'}
                                  </p>
                                  <p className="mt-0.5 text-[11px] font-bold text-[#172033]">
                                    {textoRango(bloque.inicio, bloque.fin)}
                                  </p>
                                  <p className="mt-0.5 text-[11px] font-semibold text-[#172033]">
                                    {materia?.profesor || 'Profesor'}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleEliminar(horario.id_horario)}
                                  className="mt-1 rounded-lg bg-[rgba(239,68,68,0.14)] px-2 py-1 text-[10px] font-bold text-[var(--color-danger)] transition hover:bg-[rgba(239,68,68,0.2)]"
                                >
                                  Borrar
                                </button>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
