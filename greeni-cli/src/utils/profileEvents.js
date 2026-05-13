const listeners = new Set();

export function addProfileInvalidListener(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function emitProfileInvalid() {
  listeners.forEach(listener => {
    try {
      listener();
    } catch (e) {
      console.log("PROFILE INVALID LISTENER FAIL:", e);
    }
  });
}
