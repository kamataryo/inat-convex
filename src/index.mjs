const base = 'https://www.inaturalist.org/'

export const main = async (taxa, { fetch, turf, stdoutCallback, stderrCallback, exit }) => {
  if(!taxa) {
    stderrCallback(`[Error] Invalid taxa: ${taxa}`)
    exit(1)
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
    if(total < 3) {
      break
    }

    await new Promise(resolve => setTimeout(resolve, 1000))

  } while (!isEnd);

  const convexFeature = turf.convex({ type: 'FeatureCollection', features })
  const result = {
    type: 'FeatureCollection',
    features: [convexFeature]
  }

  if(!convexFeature || features.length < 3) {
    stderrCallback(`[Error] Unknown taxa "${taxa}" or too few observations (n = ${features.length}) found.`)
    exit(2)
  } else {
    result.features[0].geometry.coordinates[0].reverse()
    result.features[0].properties = {
      totalObservations: total,
      scannedObservations: features.length,
      urls,
      title: taxa,
    }
    stdoutCallback(JSON.stringify(result) + '\n')
    exit(0)
  }
}
