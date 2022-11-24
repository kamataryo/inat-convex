const base = 'https://www.inaturalist.org/'

export const main = async (taxa, { fetch, turf, stdoutCallback, stderrCallback }) => {
  if(!taxa) {
    throw new Error(`Invalid taxa: ${taxa}`)
  }

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
      ...observations.reduce((prev, observation) => {
        const lng = parseFloat(observation.longitude)
        const lat = parseFloat(observation.latitude)
        if(
          !Number.isNaN(lat) &&
          !Number.isNaN(lng) &&
          observation.quality_grade === 'research' &&
          !observation.captive
        ) {
          prev.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lng, lat] }
          })
        }
        return prev
      }, []),
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


  const result = {
    type: 'FeatureCollection',
    features: [turf.convex({ type: 'FeatureCollection', features })]
  }

  if(result.features.some(feature => !feature)) {
    console.error(`Unknown taxa "${taxa}" or too few observations (n = ${validFeatures.length}) found.`)
  }

  result.features[0].geometry.coordinates[0].reverse()
  result.features[0].properties = {
    totalObservations: total,
    scannedObservations: features.length,
    urls,
    title: taxa,
  }

  stdoutCallback(JSON.stringify(result) + '\n')
}
