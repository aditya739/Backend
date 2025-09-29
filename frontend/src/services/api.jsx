const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";
console.log('API_BASE:', API_BASE);



async function request(path, { method = "GET", body, token, signal, headers = {} } = {}) {
  const url = API_BASE + path;
  console.log('Making request to:', url);
  const opts = { method, headers: { ...headers }, signal };

  // send cookies (for httpOnly tokens)
  opts.credentials = "include";

  // send Bearer token if present (header-token flow)
  const t = token ?? localStorage.getItem("accessToken");
  if (t) opts.headers["Authorization"] = `Bearer ${t}`;

  if (body && !(body instanceof FormData)) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  } else if (body instanceof FormData) {
    // Let the browser set multipart boundary automatically
    opts.body = body;
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export default {
  get: (p, opts) => request(p, { ...opts, method: "GET" }),
  post: (p, body, opts) => request(p, { ...opts, method: "POST", body }),
  patch: (p, body, opts) => request(p, { ...opts, method: "PATCH", body }),
  put: (p, body, opts) => request(p, { ...opts, method: "PUT", body }),
  del: (p, opts) => request(p, { ...opts, method: "DELETE" }),
};
