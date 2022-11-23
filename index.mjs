#! /usr/bin/env node

import * as turf from '@turf/turf'
const base = 'https://www.inaturalist.org/'

const main = async () => {
  const taxa = process.argv[2]

  let currentPage = 1
  let isEnd = false
  let total
  const urls = []

  const features = []
  do {
    const url = base + `observations.json?q=${taxa}&page=${currentPage}&per_page=200`
    urls.push(url)
    const resp = await fetch(url)

    const observations = await resp.json()
    features.push(
      ...observations.map(
        observation => {
          const lng = parseFloat(observation.longitude)
          const lat = parseFloat(observation.latitude)
          if(
            Number.isNaN(lat) ||
            Number.isNaN(lng) ||
            observation.quality_grade !== 'research' ||
            observation.captive
          ) {
            return false
          } else {
            return turf.point([lng, lat])
          }
        },
      ),
    )

    const headers = resp.headers
    total = parseInt(headers.get('x-total-entries'), 10)
    const perPage = parseInt(headers.get('x-per-page'), 10)
    const maxPage = Math.ceil(total / perPage)
    isEnd = currentPage === maxPage || currentPage === 5
    currentPage++

    await new Promise(resolve => setTimeout(resolve, 500))

  } while (!isEnd);

  const validFeatures = features.filter(x => !!x)

  const result = turf.featureCollection([
    turf.convex(
      {
        type: 'FeatureCollection',
        features: validFeatures,
      },
  )])

  if(result.features.some(feature => !feature)) {
    console.error(`Unknown taxa "${taxa}" or too few observations (n = ${validFeatures.length}) found.`)

  }

  result.features[0].geometry.coordinates[0].reverse()
  result.features[0].properties = {
    totalObservation: total,
    scannedObservation: validFeatures.length,
    urls,
    title: taxa,
    description: `Scanned: ${validFeatures.length}/${total} Observation${validFeatures.length.length === 1 ? '' : 's'}`
  }
  process.stdout.write(JSON.stringify(result) + '\n')
}
main()
