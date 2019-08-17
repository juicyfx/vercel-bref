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

	# Replace PHP paths
	#sed -i '' -e "s/\/opt\/bin\/php/\/var\/task\/native\/bref\/bin\/php/g" ./native/bootstrap

	# Extra cleanup(s)
	rm -rf native/bref/lib/php/test

	# Use our tuned bootstrap
	cp lib/bootstrap ./native/bootstrap

publish:
	rm -rf ./dist
	npm publish --access public --tag latest

publish-canary:
	rm -rf ./dist
	npm version --no-git-tag-version prerelease
	npm publish --access public --tag canary

publish-experimental:
	rm -rf ./dist
	npm version --no-git-tag-version prerelease
	npm publish --access public --tag experimental
