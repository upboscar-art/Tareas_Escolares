import { Link } from 'react-router-dom';
import AnimatedLetters from './AnimatedLetters';

const shortcuts = [
  { to: '/periodos', title: 'Periodos', note: 'Define ciclos escolares', tone: 'var(--color-primary)' },
  { to: '/materias', title: 'Materias', note: 'Conecta cada clase a un periodo', tone: 'var(--color-info)' },
  { to: '/tareas', title: 'Tareas', note: 'Visualiza entregas y avances', tone: 'var(--color-secondary)' },
  { to: '/horario', title: 'Horario', note: 'Ordena tus clases por dia y hora', tone: 'var(--color-warning)' },
];

export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const nombrePartes = usuario.nombre ? String(usuario.nombre).trim().split(/\s+/).filter(Boolean) : [];
  const primerNombre = nombrePartes[0] || '';
  const primerApellido = nombrePartes.length >= 2 ? nombrePartes[nombrePartes.length - 2] : '';
  const nombreMostrado = [primerNombre, primerApellido].filter(Boolean).join(' ');

  return (
    <div className="space-y-5">
      <section className="animate-soft-rise rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
        {nombreMostrado ? (
          <p className="text-xl font-semibold text-[var(--color-text-muted)] md:text-2xl">
            <span>Hola </span>
            <span className="font-bold text-[#16A34A]">
              <AnimatedLetters text={nombreMostrado} />
            </span>
          </p>
        ) : null}
        <h2 className="mt-3 text-4xl font-extrabold text-[var(--color-text)]">
          Manten tus actividades bajo control
        </h2>
        <p className="mt-4 max-w-2xl text-base text-[var(--color-text-muted)]">
          Ahora puedes moverte entre Periodos, Materias, Tareas y Horario desde la barra lateral fija sin volver al inicio.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            style={{ animationDelay: `${100 + index * 80}ms` }}
            className="animate-soft-rise rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
          >
            <div className="h-2 w-16 rounded-full" style={{ backgroundColor: item.tone }} />
            <h3 className="mt-5 text-2xl font-bold text-[var(--color-text)]">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{item.note}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
