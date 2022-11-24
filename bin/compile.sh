#! /usr/bin/sh

rm -rf out

ALLOW=$(npm run --silent deno:allow)

deno compile $ALLOW \
  --target x86_64-unknown-linux-gnu \
  --output out/x86_64-unknown-linux-gnu/inat-convex \
  ./src/shims/deno.ts

deno compile $ALLOW \
  --target x86_64-pc-windows-msvc \
  --output out/x86_64-pc-windows-msvc/inat-convex \
  ./src/shims/deno.ts

deno compile $ALLOW \
  --target x86_64-apple-darwin \
  --output out/x86_64-apple-darwin/inat-convex \
  ./src/shims/deno.ts

deno compile $ALLOW \
  --target aarch64-apple-darwin \
  --output out/aarch64-apple-darwin/inat-convex \
  ./src/shims/deno.ts

cd out
zip x86_64-unknown-linux-gnu.zip x86_64-unknown-linux-gnu/inat-convex
zip x86_64-pc-windows-msvc.zip x86_64-pc-windows-msvc/inat-convex.exe
zip x86_64-apple-darwin.zip x86_64-apple-darwin/inat-convex
zip aarch64-apple-darwin.zip aarch64-apple-darwin/inat-convex
cd ..
