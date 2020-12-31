<h1 align=center>Bref Serverless Runtime for <a href="https://vercel.com">Vercel</a></h1>

<p align=center>
  The power of <a href="https://github.com/brefphp/bref">Bref Serverless PHP</a> deploy easily to Vercel platform.
</p>

<p align=center>
  <a href="https://www.npmjs.com/package/vercel-bref"><img src="https://badgen.net/npm/v/vercel-bref"></a>
  <a href="https://www.npmjs.com/package/vercel-bref"><img src="https://badgen.net/npm/dt/vercel-bref"></a>
  <a href="https://www.npmjs.com/package/vercel-bref"><img src="https://badgen.net/github/checks/juicyfx/vercel-bref/"></a>
</p>

<p align=center>
Made with  ❤️  by <a href="https://github.com/f3l1x">@f3l1x</a> (<a href="https://f3l1x.io">f3l1x.io</a>) • 🐦 <a href="https://twitter.com/xf3l1x">@xf3l1x</a>
</p>

-----

## ⚙️ Usage

1. Setup index.php

```php
phpinfo();
```

2. Setup composer.json

```json
{
    "require": {
        "bref/bref": "^1.0.0"
    }
}
```

3. Setup vercel.json

```json
{
  "version": 2,
  "builds": [
    { "src": "index.php", "use": "vercel-bref" }
  ]
}
```

4. Deploy with `vercel`

## 📝 License

Copyright © 2019 [f3l1x](https://github.com/f3l1x).
This project is [MIT](LICENSE) licensed.
