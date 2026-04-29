import React, { useState, useEffect } from "react";
import { subscribeToast } from "./toast.js";

const ICONS = {
  success: { icon: "fa-circle-check", bg: "bg-emerald-50", border: "border-emerald-200", icon_color: "text-emerald-500", text: "text-emerald-800" },
  error:   { icon: "fa-circle-xmark", bg: "bg-red-50",     border: "border-red-200",     icon_color: "text-red-500",     text: "text-red-800"     },
  warning: { icon: "fa-triangle-exclamation", bg: "bg-amber-50", border: "border-amber-200", icon_color: "text-amber-500", text: "text-amber-800" },
  info:    { icon: "fa-circle-info",  bg: "bg-blue-50",    border: "border-blue-200",    icon_color: "text-blue-500",    text: "text-blue-800"    },
};

const DURATION = 3500;

function ToastItem({ id, type, message, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300);
    }, DURATION);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [id, onClose]);

  const s = ICONS[type] || ICONS.info;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-sm
        ${s.bg} ${s.border} transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
    >
      <i className={`fas ${s.icon} mt-0.5 text-base ${s.icon_color} flex-shrink-0`} />
      <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onClose(id), 300); }}
        className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
      >
        <i className="fas fa-xmark text-xs" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToast((t) => setToasts((prev) => [...prev, t]));
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onClose={remove} />
        </div>
      ))}
    </div>
  );
}
