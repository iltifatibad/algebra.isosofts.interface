let cache = null;
let pending = null;

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

export function fetchStaffList() {
  if (cache) return Promise.resolve(cache);
  if (pending) return pending;
  pending = fetch(`/api/account/staff?isActive=1&token=${getToken()}`)
    .then(r => (r.ok ? r.json() : []))
    .then(data => {
      cache = Array.isArray(data)
        ? data
            .filter(s => s.isActive)
            .map(s => ({ id: s.id, value: `${s.name ?? ""} ${s.surname ?? ""}`.trim() }))
        : [];
      pending = null;
      return cache;
    })
    .catch(() => { pending = null; return []; });
  return pending;
}
