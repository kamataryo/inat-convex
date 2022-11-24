#! /usr/bin/env node

import fetch from 'node-fetch'
import * as turf from '@turf/turf'

import { main } from '../index.mjs'
const taxa = process.argv[2]

main(taxa, {
  fetch,
  turf,
  stdoutCallback: (text) => process.stdout.write(text),
  stderrCallback: (text) => process.stderr.write(text),
})

