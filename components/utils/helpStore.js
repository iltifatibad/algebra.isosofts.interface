const PREFIX = "helpOverride_";

export const getHelpOverride = (title) => {
  try {
    const raw = localStorage.getItem(PREFIX + title);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveHelpOverride = (title, data) => {
  localStorage.setItem(PREFIX + title, JSON.stringify(data));
};

export const clearHelpOverride = (title) => {
  localStorage.removeItem(PREFIX + title);
};
