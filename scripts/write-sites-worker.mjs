import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = "dist";
const textTypes = new Set([".html", ".css", ".js", ".json", ".svg", ".txt"]);
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"],
]);

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "server") {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await collectFiles(distDir);
const assets = {};
const assetVersion = Date.now().toString(36);

for (const file of files) {
  const route = `/${path.relative(distDir, file).replaceAll(path.sep, "/")}`;
  const extension = path.extname(file);
  const contentType = contentTypes.get(extension) || "application/octet-stream";
  const body = textTypes.has(extension) ? await readFile(file, "utf8") : await readFile(file);
  const versionedBody = extension === ".html"
    ? body.replaceAll(/((?:\.\/)?assets\/[^"']+\.(?:js|css))/g, `$1?v=${assetVersion}`)
    : body;

  assets[route] = textTypes.has(extension)
    ? { contentType, encoding: "text", body: versionedBody }
    : { contentType, encoding: "base64", body: versionedBody.toString("base64") };
}

const worker = `const ASSETS = ${JSON.stringify(assets)};

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function responseFor(asset) {
  const body = asset.encoding === "base64" ? decodeBase64(asset.body) : asset.body;
  const cacheControl = asset.contentType.startsWith("text/html")
    ? "no-cache"
    : "public, max-age=31536000, immutable";

  return new Response(body, {
    headers: {
      "content-type": asset.contentType,
      "cache-control": cacheControl,
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const asset = ASSETS[url.pathname] || (url.pathname === "/" ? ASSETS["/index.html"] : null);

    if (asset) {
      return responseFor(asset);
    }

    return new Response("Not found", { status: 404 });
  },
};
`;

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", worker);
