#! /usr/bin/env node

import fetch from 'node-fetch'
import convex from '@turf/convex'

import { main } from '../index.mjs'
const taxa = process.argv[2]

main(taxa, {
  fetch,
  turf: { convex },
  stdoutCallback: (text) => process.stdout.write(text),
  stderrCallback: (text) => process.stderr.write(text),
  exit: process.exit,
})

