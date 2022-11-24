const base = 'https://www.inaturalist.org/'

export const main = async (taxa, { fetch, turf, stdoutCallback, stderrCallback }) => {

  let currentPage = 1
  let isEnd = false
  let total
  let maxPage
  const urls = []
  const features = []

  do {
    const url = base + `observations.json?q=${taxa}&page=${currentPage}&per_page=200`
    stderrCallback(`[Request] ${currentPage}/${maxPage ? Math.min(5, maxPage) : 'n'}\n`)

    urls.push(url)
    const resp = await fetch(url)

    const observations = await resp.json()
    features.push(
      ...observations.map(observation => {
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
      }),
    )

    // Pagination: first 5 pages and it's 1000 observations should be enough.
    const headers = resp.headers
    total = parseInt(headers.get('x-total-entries'), 10)
    const perPage = parseInt(headers.get('x-per-page'), 10)
    maxPage = Math.ceil(total / perPage)
    isEnd = currentPage === maxPage || currentPage === 5
    currentPage++

    await new Promise(resolve => setTimeout(resolve, 1000))

  } while (!isEnd);

  const validFeatures = features.filter(x => !!x)

  const result = turf.featureCollection([
    turf.concave(
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
  stdoutCallback(JSON.stringify(result) + '\n')
}
