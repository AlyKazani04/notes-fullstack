const API_BASE = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // automatically sends cookies
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
}

export default request;