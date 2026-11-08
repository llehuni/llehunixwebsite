import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));

const routes = new Map([
  ['/', '/index.html'],
  ['/project', '/projects.html']
]);

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.ico', 'image/x-icon']
]);

function getFilePath(requestPath) {
  const routePath = routes.get(requestPath);

  if (!routePath && path.extname(requestPath).toLowerCase() === '.html') {
    return null;
  }

  const filePathValue = routePath || requestPath;
  const relativePath = filePathValue.replace(/^[/\\]+/, '');
  const filePath = path.resolve(ROOT_DIR, relativePath);

  if (filePath !== ROOT_DIR && !filePath.startsWith(`${ROOT_DIR}${path.sep}`)) {
    return null;
  }

  return filePath;
}

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  response.end(message);
}

async function handleRequest(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    sendText(response, 405, 'Method Not Allowed');
    return;
  }

  let requestPath;
  try {
    requestPath = new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname;
  } catch {
    sendText(response, 400, 'Bad Request');
    return;
  }

  if (!routes.has(requestPath) && path.extname(requestPath).toLowerCase() === '.html') {
    sendText(response, 404, 'Not Found');
    return;
  }

  let filePath;
  try {
    filePath = getFilePath(decodeURIComponent(requestPath));
  } catch {
    sendText(response, 400, 'Bad Request');
    return;
  }

  if (!filePath) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = contentTypes.get(path.extname(filePath).toLowerCase())
      || 'application/octet-stream';

    response.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': file.byteLength
    });

    if (request.method === 'HEAD') {
      response.end();
    } else {
      response.end(file);
    }
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      sendText(response, 404, 'Not Found');
      return;
    }

    console.error('Unable to serve request:', error);
    sendText(response, 500, 'Internal Server Error');
  }
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Unhandled request error:', error);
    if (!response.headersSent) {
      sendText(response, 500, 'Internal Server Error');
    } else {
      response.destroy();
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Website server running at http://${HOST}:${PORT}`);
});
