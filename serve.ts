// serve.ts — a tiny static file server for trying the guide locally.
// Serves app/ at http://localhost:8080 with no dependencies:
//   node serve.ts
// The guide needs no server features beyond files: no build step, no API,
// and it makes no request that leaves this machine.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = Number(process.env.PORT ?? 8080);

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    const path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    const file = join(root, path === "/" ? "index.html" : path);
    if (!file.startsWith(root)) throw new Error("outside app/");
    const body = await readFile(file);
    response.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("not found");
  }
}).listen(port, () => {
  console.log(`Leonida Platinum at http://localhost:${port}`);
});
