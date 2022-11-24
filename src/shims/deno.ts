
import * as turf from 'npm:@turf/turf@^6';
import { main } from '../index.mjs'

const taxa = Deno.args[2]

main(taxa, {
  fetch,
  turf,
  stdoutCallback: (result: string) => {
    const encoder = new TextEncoder();
  	return Deno.stdout.write(encoder.encode(result))
  }
})
