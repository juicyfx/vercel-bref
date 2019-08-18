.PHONY: prepare sync clean build publish publish-canary publish-experimental

prepare:
	git clone git@github.com:brefphp/bref.git build/bref

sync:
	git -C build/bref reset --hard HEAD
	git -C build/bref pull

clean:
	rm -rf build/bref/runtime/export/tmp/**

build:
	# Just build from Docker hub
	sed -i '' -e 's/export\/php%.zip: build/export\/php%.zip:/g' build/bref/runtime/Makefile

	# Create binaries
	cd build/bref/runtime && make export/php-73-fpm.zip

	# Ensure folder
	mkdir -p native

	# Cleanup folder
	rm -rf native/**

	# Extract binaries
	tar zxvf build/bref/runtime/export/php-73-fpm.zip -C native

	# Download composer
	curl -sS https://getcomposer.org/installer | php -- --install-dir=native/bin --filename=composer

	# Replace PHP paths
	#sed -i '' -e "s/\/opt\/bin\/php/\/var\/task\/native\/bref\/bin\/php/g" ./native/bootstrap

	# Extra cleanup(s)
	rm -rf native/bref/lib/php/test
	rm -rf native/bref/bin
	rm -rf native/bref/lib/{cmake,pkgconfig}
	find native/bref/lib/php -not -path "native/bref/lib/php/extensions*" -not -path "native/bref/lib/php" -exec rm -rf {} +
	rm -rf native/bref/php
	rm -rf native/bref/sbin
	rm -rf native/bref/share

	# Use our tuned bootstrap
	cp lib/bootstrap ./native/bootstrap

	# Use our tuned PHP ini
	cp lib/now.ini ./native/bref/etc/php/conf.d/now.ini

publish:
	rm -rf ./dist
	npm publish --access public --tag latest

publish-dry:
	rm -rf ./dist
	npm publish --dry

publish-canary:
	rm -rf ./dist
	npm version --no-git-tag-version prerelease
	npm publish --access public --tag canary

publish-experimental:
	rm -rf ./dist
	npm version --no-git-tag-version prerelease
	npm publish --access public --tag experimental
