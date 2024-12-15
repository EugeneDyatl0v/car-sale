# Local commands (add/modify)
build_local:
	docker compose -f contrib/docker/docker-compose.local.yml build

up_local:
	docker compose -f contrib/docker/docker-compose.local.yml up -d

build_up_local: build_local up_local

down_local:
	docker compose -f contrib/docker/docker-compose.local.yml down --remove-orphans