
import * as turf from 'npm:@turf/turf@^6';
import { main } from '../index.mjs'

const taxa = Deno.args[2]
const encoder = new TextEncoder();

main(taxa, {
  fetch,
  turf,
  stdoutCallback: (text: string) => Deno.stdout.write(encoder.encode(text)),
  stderrCallback: (text: string) => Deno.stderr.write(encoder.encode(text)),
})
