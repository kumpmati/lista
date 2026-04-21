# Sync server

This is essentially a copy of the [automerge-repo-sync-server](https://github.com/automerge/automerge-repo-sync-server) repo converted to work inside Cloudflare Durable Objects with Durable Object SQL storage and using hibernatable WebSockets.

Durable Objects are grouped by the value of the `?doc=` URL parameter in the incoming WebSocket upgrade request.
This should improve performance, since when used correctly every document gets its own Durable Object.
If no URL parameter is found, it falls back to a single shared Durable Object (`global`).

## Getting started

Install dependencies using pnpm: `pnpm i`

Run the server in development mode: `pnpm run dev`

Deploy the server: `pnpm run deploy`

If you update the CF bindings or environment variables, run `pnpm run cf-typegen` to update the generated types.
