const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("auth_token="))?.split("=").slice(1).join("=") ?? "";

export function fetchStaffList() {
  return fetch(`https://isosofts.com/api/account/staff?isActive=1&token=${getToken()}`)
    .then(r => (r.ok ? r.json() : []))
    .then(data =>
      Array.isArray(data)
        ? data
            .filter(s => s.isActive)
            .map(s => ({ id: s.id, value: `${s.name ?? ""} ${s.surname ?? ""}`.trim() }))
        : []
    )
    .catch(() => []);
}
