const cache = {};

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

export async function fetchStaffName(id) {
  if (!id) return "";
  if (cache[id] !== undefined) return cache[id];
  try {
    const token = getToken();
    const res = await fetch(`/api/account/staff/${id}?token=${token}`);
    if (!res.ok) { cache[id] = ""; return ""; }
    const data = await res.json();
    const name = `${data.name ?? ""} ${data.surname ?? ""}`.trim();
    cache[id] = name;
    return name;
  } catch {
    cache[id] = "";
    return "";
  }
}
