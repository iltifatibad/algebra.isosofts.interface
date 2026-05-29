import { useState, useEffect } from "react";
import { fetchStaffName } from "./staffCache.js";

export default function StaffName({ id }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchStaffName(id).then(setName);
  }, [id]);

  if (!name) return null;
  return (
    <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-black text-xs font-medium whitespace-normal break-words">
      {name}
    </span>
  );
}
