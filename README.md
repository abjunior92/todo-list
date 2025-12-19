# Todo List App

Applicazione Todo List con autenticazione utente.

## Stack Tecnologico

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router V7
- React Hook Form
- Vitest + React Testing Library
- pnpm

### Backend
- Elixir Phoenix
- PostgreSQL
- Ecto

### Docker
- Docker Compose per orchestrazione servizi

## Requisiti

- Docker e Docker Compose
- pnpm (per sviluppo locale frontend)
- Elixir e Mix (per sviluppo locale backend)

## Setup

### Con Docker (Raccomandato)

1. Clona il repository
```bash
git clone <repository-url>
cd todo-list
```

2. Avvia i servizi
```bash
docker-compose up --build
```

I servizi saranno disponibili su:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Database PostgreSQL: localhost:5432

### Sviluppo Locale

#### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

#### Backend

```bash
cd backend
mix deps.get
mix ecto.create
mix ecto.migrate
mix phx.server
```

## Struttura Progetto

```
todo-list/
├── frontend/          # Applicazione React
├── backend/           # Applicazione Phoenix
├── docker-compose.yml # Configurazione Docker
└── README.md
```

## Funzionalità

- [x] Login con email e password
- [x] Logout
- [ ] Gestione Todo (da implementare)

## Testing

### Frontend
```bash
cd frontend
pnpm test
```

### Backend
```bash
cd backend
mix test
```

## Git Workflow

- Branch principale: `main`
- Feature branches: `feat/nome-feature`
- Bug branches: `bug/nome-bug`
- Pull requests vengono mergeate in `main`

## Licenza

MIT

