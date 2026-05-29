const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

export async function fetchStaffName(id) {
  if (!id) return "";
  try {
    const token = getToken();
    const res = await fetch(`https://isosofts.com/api/account/staff/${id}?token=${token}`);
    if (!res.ok) return "";
    const data = await res.json();
    return `${data.name ?? ""} ${data.surname ?? ""}`.trim();
  } catch {
    return "";
  }
}
