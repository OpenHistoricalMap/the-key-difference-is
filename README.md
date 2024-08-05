# the-key-difference-is

This script was written to compare keys in locale files for updates and inconsistencies. It was written in the context of the [OpenHistoricalMap (OHM) fork of overpass-turbo](https://github.com/OpenHistoricalMap/overpass-turbo) and will be modified to work in other OHM properties.

## Usage

The script uses [`commander.js`](https://github.com/tj/commander.js) and options are explained with `tkdi --help`. A concrete example of usage in the `overpass-turbo/locales` directory to investigate an incoming Icelandic file is

```
tkdi.js --debug --ours en.json --theirs is.json
```

which displays the values of all keys (`--debug`) and writes to `out.json` in the `locales` subdirectory.

<pre>
Ours vs. Theirs
  Ours: Run     Theirs: Keyra
  Ours: Share   Theirs: Deila
  Ours: Export  Theirs: Flytja út
  Ours: Save    Theirs: Vista
  Ours: Load    Theirs: Hlaða
  Ours: Wizard  Theirs: Leiðarvísir
  Ours: Settings        Theirs: Stillingar
  Ours: Help    Theirs: Hjálp
  Ours: Logout  Theirs: Útskráning
  Ours: Map     Theirs: Landakort

…

  Ours: Relations       Theirs: Vensl
Theirs vs. Ours ("What fresh hell can this be?" –Dorothy Parker)
  Theirs has key not in Ours: @metadata value: {"authors":["Sveinn í Felli"]}
</pre>
Differences can be eyeballed as a reality check, then `out.json` would replace 'is.json'.
