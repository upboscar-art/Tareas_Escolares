import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import Horario from './components/Horario';
import Home from './components/Home';
import Login from './components/Login';
import Materias from './components/Materias';
import Periodos from './components/Periodos';
import Register from './components/Register';
import Tareas from './components/Tareas';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function App() {
  const [theme, setTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const actualizarTema = (event) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    setTheme(mediaQuery.matches ? 'dark' : 'light');

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', actualizarTema);
      return () => mediaQuery.removeEventListener('change', actualizarTema);
    }

    mediaQuery.addListener(actualizarTema);
    return () => mediaQuery.removeListener(actualizarTema);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/periodos" element={<Periodos />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/tareas" element={<Tareas />} />
            <Route path="/horario" element={<Horario />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
