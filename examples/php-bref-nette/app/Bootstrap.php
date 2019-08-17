<?php

declare(strict_types=1);

namespace App;

use Nette\Configurator;


class Bootstrap
{
	public static function boot(): Configurator
	{
		$configurator = new Configurator;

		$configurator->setDebugMode(true);
		$configurator->enableTracy('/tmp');

		$configurator->setTimeZone('Europe/Prague');
		$configurator->setTempDirectory('/tmp/temp');

		$configurator->createRobotLoader()
			->addDirectory(__DIR__)
			->register();

		$configurator
			->addConfig(__DIR__ . '/config/common.neon');

		return $configurator;
	}


	public static function bootForTests(): Configurator
	{
		$configurator = self::boot();
		\Tester\Environment::setup();
		return $configurator;
	}
}
