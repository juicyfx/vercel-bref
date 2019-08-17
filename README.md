<h1 align=center>now-bref</h1>

<p align=center>
Deploy <a href="https://bref.sh">bref</a> to ZEIT Now
</p>

<p align=center>
🕹 <a href="https://f3l1x.io">f3l1x.io</a> | 💻 <a href="https://github.com/f3l1x">f3l1x</a> | 🐦 <a href="https://twitter.com/xf3l1x">@xf3l1x</a>
</p>

<p align=center>
	<a href="https://www.npmjs.com/package/now-bref"><img alt="npm" src="https://img.shields.io/npm/dt/now-bref?style=flat-square"></a>
	<a href="https://www.npmjs.com/package/now-bref"><img alt="npm (tag)" src="https://img.shields.io/npm/v/now-bref/latest?style=flat-square"></a>
	<a href="https://www.npmjs.com/package/now-bref"><img alt="npm (tag)" src="https://img.shields.io/npm/v/now-bref/canary?style=flat-square"></a>
</p>

## 🐣 Versions

|    | Pkg      | Tag          | Stability   | Info                     |
|----|----------|--------------|-------------|--------------------------|
| ✅ | now-bref | latest       | production  | Rock-solid stable.       |
| 🔥 | now-bref | canary       | testing     | For early-adopters.      |
| ⚠️ | now-bref | experimental | development | Testing and high danger. |

## ⚙️ Usage

1. Setup composer.json

```json
{
    "require": {
        "bref/bref": "^0.5.0"
    }
}
```

2. Setup now.json

```json
{
  "version": 2,
  "builds": [
    { "src": "index.php", "use": "now-bref" }
  ]
}
```

3. Deploy with `now`

## 📝 License

Copyright © 2019 [f3l1x](https://github.com/f3l1x).
This project is [MIT](LICENSE) licensed.
