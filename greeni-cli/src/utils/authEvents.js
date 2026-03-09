const listeners = new Set();

export function addLogoutListener(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitLogout() {
  listeners.forEach((fn) => fn());
}