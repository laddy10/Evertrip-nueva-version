// Local release QA only: serve the real export, including video byte ranges.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("out");
const mime = {
  ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".mp4": "video/mp4",
};
http.createServer((req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end(); return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.pathname.endsWith("/")) {
        res.writeHead(308, { Location: url.pathname + "/" + url.search }).end(); return;
      }
      file = path.join(file, "index.html");
    }
    const exists = fs.existsSync(file);
    if (!exists) file = path.join(root, "404.html");
    const size = fs.statSync(file).size;
    const headers = { "Content-Type": mime[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "Accept-Ranges": "bytes" };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range && exists) {
      const start = Number(range[1]);
      const end = Math.min(range[2] ? Number(range[2]) : size - 1, size - 1);
      if (start > end) { res.writeHead(416, { "Content-Range": `bytes */${size}` }).end(); return; }
      res.writeHead(206, { ...headers, "Content-Length": end - start + 1, "Content-Range": `bytes ${start}-${end}/${size}` });
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(exists ? 200 : 404, { ...headers, "Content-Length": size });
      if (req.method === "HEAD") res.end();
      else fs.createReadStream(file).pipe(res);
    }
  } catch {
    res.writeHead(500).end("Preview error");
  }
}).listen(Number(process.env.PORT || 3001), "127.0.0.1", () => console.log("Static export QA server ready"));
