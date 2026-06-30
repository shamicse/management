const proxyToBackend = async ({ request, env, params }) => {
  const backendOrigin = env.BACKEND_ORIGIN;

  if (!backendOrigin) {
    return Response.json(
      {
        message: 'Backend is not configured. Set BACKEND_ORIGIN in Cloudflare Pages.',
      },
      { status: 503 }
    );
  }

  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(backendOrigin);
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
  targetUrl.pathname = `/uploads/${path}`;
  targetUrl.search = sourceUrl.search;

  const headers = new Headers(request.headers);
  headers.set('host', targetUrl.host);

  return fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });
};

export const onRequest = proxyToBackend;
