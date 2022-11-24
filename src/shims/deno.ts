
import convex from 'npm:@turf/convex';
import { main } from '../index.mjs'

const taxa = Deno.args[0]
const encoder = new TextEncoder();

main(taxa, {
  fetch,
  turf: { convex },
  stdoutCallback: (text: string) => Deno.stdout.write(encoder.encode(text)),
  stderrCallback: (text: string) => Deno.stderr.write(encoder.encode(text)),
})
