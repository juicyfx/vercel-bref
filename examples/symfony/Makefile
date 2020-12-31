install:
	composer install --optimize-autoloader --no-dev --no-scripts

build:
	rm -rf var/cache/*
	php bin/console cache:clear --no-debug --no-warmup --env=prod
	php bin/console cache:warmup --env=prod

deploy: install build
	now --target production -f
