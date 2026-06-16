const API_BASE = '/api'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('zb-token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('zb-token')
    // Don't throw, just return the error response
  }

  const data = await res.json()
  if (!res.ok) throw { status: res.status, ...data }
  return data
}

export const api = {
  get: (path) => apiFetch(path),
  post: (path, body) => apiFetch(path, { method: 'POST', body: JSON.stringify(body) }),
  del: (path) => apiFetch(path, { method: 'DELETE' }),
}
