# @kamataryo/inat-convex

A CLI tool to generate GeoJSON polygons that enclose the convex hull of species distribution areas.

## Requirements

- Node.js or Deno

## Usage example

Place a common name, taxon (genus, family, order and etc) or scientific name as an argument and you can get a GeoJSON object which streamed out from standard output of the process.

```shell
$ npx @kamataryo/inat-convex "セトウチマイマイ"          # with a Japanese common name
$ npx @kamataryo/inat-convex "Arctic Char"            # with an English common name
$ npx @kamataryo/inat-convex "Salvelinus leucomaenis" # with a scientific name
```

It is convenient to pipe to any tool which supports standard input e.g. [@geolonia/view-geojson](https://github.com/geolonia/view-geojson).

```shell
$ npx @kamataryo/inat-convex "セトウチマイマイ" | npx @geolonia/view-geojson
```

### (Option) with Deno

```shell
$ git clone git@github.com:kamataryo/inat-convex.git
$ cd inat-convex
$ deno run ./src/shims/deno.ts
```

### more samples

|||
|---|---|
|<span class="italic" style="font-style:italic">Euhadra quaesita</span> (ヒダリマキマイマイ)|<span class="italic" style="font-style:italic">Euhadra subnimbosa</span> (セトウチマイマイ)|
|![](https://kamataryo.github.io/inat-convex/ヒダリマキマイマイ.png)|![](https://kamataryo.github.io/inat-convex/セトウチマイマイ.png)|
|`$ npx @kamataryo/inat-convex "ヒダリマキマイマイ" \| npx @geolonia/view-geojson` | `$ npx @kamataryo/inat-convex "セトウチマイマイ" \| npx @geolonia/view-geojson`|
|Arctic Char (ホッキョクイワナ)|Char (イワナ)|
|![](https://kamataryo.github.io/inat-convex/arctic%20char.png)|![](https://kamataryo.github.io/inat-convex/salvelinus%20leucomaenis.png)|
|`$ npx @kamataryo/inat-convex "Arctic Char" \| npx @geolonia/view-geojson`|`$ npx @kamataryo/inat-convex "salvelinus leucomaenis" \| npx @geolonia/view-geojson`|

### Note

### Quality of data

The output distribution area is just a convex of sampled observation points and does not reflect detailed.

### Resources

This tool makes a maximum of 5 HTTP requests / 5 seconds / 1 command execution against `www.inaturalist.org` from your environment. and please note the iNaturalist [rate limit](https://www.inaturalist.org/pages/api+recommended+practices). We have not yet implemented an authentication flow using the iNaturalist API tokens. If you are interested in, please [submit an issue](https://github.com/kamataryo/inat-convex/issues/new/choose) or [a pull request](https://github.com/kamataryo/inat-convex/compare).

## Acknowledgments

This tool wraps [iNaturalist API](https://www.inaturalist.org/pages/api+reference).
I would like to thanks to all iNaturalist users and the great platform.
