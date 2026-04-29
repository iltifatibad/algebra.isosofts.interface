const listeners = new Set();

function emit(toast) {
  const id = Date.now() + Math.random();
  listeners.forEach((fn) => fn({ ...toast, id }));
}

export const toast = {
  success: (message) => emit({ type: "success", message }),
  error: (message) => emit({ type: "error", message }),
  info: (message) => emit({ type: "info", message }),
  warning: (message) => emit({ type: "warning", message }),
};

export function subscribeToast(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
