import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { errorPages } from './src/data/translations.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || 'localhost';
const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(ROOT_DIR, 'src');

const routes = new Map([
  ['/', '/index.html'],
  ['/project', '/pages/projects.html']
]);
const errorCodes = new Set(Object.keys(errorPages));

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
  const filePath = path.resolve(SRC_DIR, relativePath);

  if (filePath !== SRC_DIR && !filePath.startsWith(`${SRC_DIR}${path.sep}`)) {
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

async function sendErrorPage(response, statusCode, requestMethod) {
  const templatePath = path.join(SRC_DIR, 'pages/error.html');
  const template = await fs.readFile(templatePath, 'utf8');
  const page = template.replaceAll('__ERROR_CODE__', String(statusCode));

  response.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(page)
  });

  if (requestMethod === 'HEAD') {
    response.end();
  } else {
    response.end(page);
  }
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
    await sendErrorPage(response, 400, request.method);
    return;
  }

  const errorRouteMatch = requestPath.match(/^\/error-(\d+)$/);
  if (errorRouteMatch) {
    const errorCode = errorRouteMatch[1];
    if (!errorCodes.has(errorCode)) {
      await sendErrorPage(response, 404, request.method);
      return;
    }

    await sendErrorPage(response, Number(errorCode), request.method);
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
    await sendErrorPage(response, 400, request.method);
    return;
  }

  if (!filePath) {
    await sendErrorPage(response, 403, request.method);
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
      await sendErrorPage(response, 404, request.method);
      return;
    }

    console.error('Unable to serve request:', error);
    await sendErrorPage(response, 500, request.method);
  }
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Unhandled request error:', error);
    if (!response.headersSent) {
      sendErrorPage(response, 500, request.method).catch((pageError) => {
        console.error('Unable to serve error page:', pageError);
        response.end();
      });
    } else {
      response.destroy();
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Website server running at http://${HOST}:${PORT}`);
});
