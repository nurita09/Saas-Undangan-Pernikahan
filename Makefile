# Wrapper supaya docker compose selalu baca .env di root project ini,
# meskipun docker-compose.yml letaknya di infra/. Jalankan semua perintah
# dari root folder, misal: `make up`.

COMPOSE = docker compose -p undangan --env-file .env -f infra/docker-compose.yml

.PHONY: up down restart logs ps build

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

build:
	$(COMPOSE) build
