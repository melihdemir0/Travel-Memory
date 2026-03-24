.DEFAULT_GOAL := help

.PHONY: FORCE help run install dev build lint format test coverage check

FORCE:

help:
	@echo "Available targets:"
	@echo "  install       Install dependencies"
	@echo "  run           Install dependencies and start the dev server"
	@echo "  dev           Start the Vite dev server"
	@echo "  build         Build the project"
	@echo "  lint          Run Biome lint checks"
	@echo "  format        Format the codebase with Biome"
	@echo "  test          Run tests"
	@echo "  coverage      Run tests with coverage"
	@echo "  check         Run lint, format check, and tests"

run:
	npm install
	npm run dev

install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

format:
	npm run format

test:
	npm run test

coverage:
	npm run test:coverage

check:
	npm run check
