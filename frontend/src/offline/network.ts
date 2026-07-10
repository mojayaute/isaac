type Listener = (online: boolean) => void;

const listeners = new Set<Listener>();

export function isOnline(): boolean {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function onNetworkChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit(online: boolean) {
  listeners.forEach((l) => l(online));
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => emit(true));
  window.addEventListener('offline', () => emit(false));
}

/**
 * Distingue un error "de red" (sin conexión) de un error HTTP real del servidor.
 * axios pone `response` cuando el servidor sí respondió (4xx/5xx).
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  if (error.response) return false; // hubo respuesta del servidor => no es fallo de red
  return true;
}
