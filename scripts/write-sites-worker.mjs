import { mkdir, writeFile } from "node:fs/promises";

const worker = `const INDEX_PATH = "/index.html";

function withUrlPath(request, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  url.search = "";
  return new Request(url, request);
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const accept = request.headers.get("accept") || "";
    if (request.method === "GET" && accept.includes("text/html")) {
      return env.ASSETS.fetch(withUrlPath(request, INDEX_PATH));
    }

    return response;
  },
};
`;

await mkdir("dist/server", { recursive: true });
await writeFile("dist/server/index.js", worker);
