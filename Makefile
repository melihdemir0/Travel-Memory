.PHONY: FORCE install dev build lint format test coverage check

FORCE:

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
