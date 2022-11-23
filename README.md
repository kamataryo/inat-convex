# @kamataryo/inat-convex

A CLI tool to generate GeoJSON polygons that enclose the convex hull of species distribution areas.

## Requirements

- Node.js@18 with experimental fetch API

## Usage example

Place a common name or scientific name as an argument and you can get a GeoJSON object which streamed out from standard output of the process.

```shell
$ npx @kamataryo/inat-convex "セトウチマイマイ"          # with a Japanese common name
$ npx @kamataryo/inat-convex "Arctic Char"            # with an English common name
$ npx @kamataryo/inat-convex "Salvelinus leucomaenis" # with a scientific name
```

It is convenient to pipe to any tool which supports standard input.

```shell
$ npx @kamataryo/inat-convex "セトウチマイマイ" | npx @geolonia/view-geojson
```

### samples

|||
|---|---|
|<span class="italic" style="font-style:italic">Euhadra quaesita</span> (ヒダリマキマイマイ)|<span class="italic" style="font-style:italic">Euhadra subnimbosa</span> (セトウチマイマイ)|
|![](./images/ヒダリマキマイマイ.png)|![](./images/セトウチマイマイ.png)|
|`$ npx @kamataryo/inat-convex "ヒダリマキマイマイ" \| npx @geolonia/view-geojson` | `$ npx @kamataryo/inat-convex "セトウチマイマイ" \| npx @geolonia/view-geojson`|
|Arctic Char (ホッキョクイワナ)|Char (イワナ)|
|![](./images/arctic%20char.png)|![](./images/salvelinus%20leucomaenis.png)|
|`$ npx @kamataryo/inat-convex "Arctic Char" \| npx @geolonia/view-geojson`|`$ npx @kamataryo/inat-convex "salvelinus leucomaenis" \| npx @geolonia/view-geojson`|

## Acknowledgments

This tool wraps [iNaturalist API](https://www.inaturalist.org/pages/api+reference).
I would like to thanks to all iNaturalist users and the great platform.
