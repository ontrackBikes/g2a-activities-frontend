const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "http://localhost:3000/api/v1";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Request failed");
  }

  return json.data;
}

export function getProduct(slug) {
  return request(`/products/app/products-list/${slug}`);
}