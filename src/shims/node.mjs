#! /usr/bin/env node

import fetch from 'node-fetch'
import * as turf from '@turf/turf'

import { main } from '../index.mjs'
const taxa = process.argv[2]

main(taxa, {
  fetch,
  turf,
  stdoutCallback: (result) => process.stdout.write(result),
})

