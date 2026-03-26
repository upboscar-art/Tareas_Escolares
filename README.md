# Tarevia - Agenda Académica Web

Tarevia es una agenda académica web para administrar períodos, materias, tareas y horarios desde un solo panel. El proyecto incluye backend con Express y PostgreSQL, autenticación con JWT, y una interfaz en `public/` con temas de color, resumen general, calendario y horario semanal.

## Funcionalidades

- Registro e inicio de sesión con token JWT.
- CRUD de periodos escolares.
- CRUD de materias asociadas a un periodo.
- CRUD de tareas asociadas a una materia.
- Marcado de tareas como entregadas.
- Listados de tareas pendientes, vencidas y completadas.
- Calendario mensual con tareas por fecha y tarjeta de detalle.
- Horario semanal por materia con bloques de color.
- Panel de resumen con métricas, mini calendario y agenda del día.
- Selector de temas visuales: `light`, `indigo`, `emerald`, `sunset`, `rose`.
- Interfaz responsive con estilos según tema activo.

## Tecnologías

- Node.js
- Express
- PostgreSQL
- JSON Web Token (`jsonwebtoken`)
- bcrypt
- dotenv
- nodemon
- HTML, CSS y JavaScript vanilla

## Estructura General

```text
backend/
|-- public/
|   |-- app.js
|   |-- index.html
|   `-- styles.css
|-- src/
|   |-- app.js
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |-- middlewares/
|   `-- routes/
|-- package.json
`-- README.md
```

## Requisitos

- Node.js instalado
- PostgreSQL disponible
- Variables de entorno configuradas en `.env`

## Instalación

```bash
npm install
```

## Variables de Entorno

Crea un archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=tu_base_de_datos
JWT_SECRET=tu_clave_secreta
```

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Abrir navegador:

```text
http://localhost:3000
```

## Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión (JWT)

### Periodos

- `POST /api/periodos`
- `GET /api/periodos`
- `GET /api/periodos/:id`
- `PUT /api/periodos/:id`
- `DELETE /api/periodos/:id`

### Materias

- `POST /api/materias`
- `GET /api/materias`
- `GET /api/materias/:id_periodo`
- `GET /api/materias/detalle/:id`
- `PUT /api/materias/:id`
- `DELETE /api/materias/:id`

### Tareas

- `POST /api/tareas`
- `GET /api/tareas`
- `GET /api/tareas/:id`
- `PUT /api/tareas/:id`
- `DELETE /api/tareas/:id`
- `PATCH /api/tareas/:id/completar`
- `GET /api/tareas/estado/pendientes`
- `GET /api/tareas/estado/vencidas`
- `GET /api/tareas/estado/completadas`

### Horarios

- `POST /api/horarios`
- `GET /api/horarios`
- `GET /api/horarios/materia/:id_materia`
- `PUT /api/horarios/:id`
- `DELETE /api/horarios/:id`

## Scripts

- `npm run dev` - Inicia servidor con nodemon
- `npm test` - placeholder

## Notas

- `public/` contiene interfaz consumiendo API del mismo servidor.
- Tema guardado en `localStorage`.
- Filtro de periodo afecta resumen, materias, tareas y horarios.
- `npm test` sin pruebas automáticas aún.

## Autor

Universidad Politécnica de Bacalar  
Desarrollador: Fabian Hernández Ceja
