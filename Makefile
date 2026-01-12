.PHONY: help setup dev build test test-docker clean

help:
	@echo "Comandi disponibili:"
	@echo "  make setup       - Installa le dipendenze e configura il progetto"
	@echo "  make dev         - Avvia l'applicazione in modalità sviluppo con Docker"
	@echo "  make build       - Costruisce l'applicazione per produzione"
	@echo "  make test        - Esegue i test localmente"
	@echo "  make test-docker - Esegue i test su Docker"
	@echo "  make clean       - Pulisce i file generati"

setup:
	cd frontend && pnpm install
	cd backend && mix deps.get

dev:
	docker compose up --build

build:
	docker compose build

test:
	cd frontend && pnpm test
	cd backend && mix test

test-docker:
	docker compose exec backend sh -c "MIX_ENV=test mix ecto.create || true && MIX_ENV=test mix ecto.migrate && MIX_ENV=test mix test"

clean:
	docker compose down -v
	cd frontend && rm -rf node_modules dist
	cd backend && rm -rf _build deps

