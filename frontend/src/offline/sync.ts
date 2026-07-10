import api from '../services/api';
import { getPendingResponses, markSynced, markError, countPending } from './responsesStore';
import { isOnline, onNetworkChange, isNetworkError } from './network';

type SyncState = {
  syncing: boolean;
  pending: number;
  lastSyncAt: number | null;
};

type SyncListener = (state: SyncState) => void;

const state: SyncState = {
  syncing: false,
  pending: 0,
  lastSyncAt: null,
};

const listeners = new Set<SyncListener>();
let inFlight = false;

function emit() {
  listeners.forEach((l) => l({ ...state }));
}

export function onSyncChange(listener: SyncListener): () => void {
  listener({ ...state });
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function refreshPendingCount(): Promise<void> {
  state.pending = await countPending();
  emit();
}

/**
 * Envía al servidor todas las respuestas pendientes/erroneas.
 * Se detiene silenciosamente si no hay conexión.
 */
export async function syncPending(): Promise<void> {
  if (inFlight) return;
  if (!isOnline()) {
    await refreshPendingCount();
    return;
  }

  inFlight = true;
  state.syncing = true;
  emit();

  try {
    const pending = await getPendingResponses();

    for (const item of pending) {
      try {
        if (item.serverId) {
          const res = await api.put(`/responses/${item.serverId}`, {
            form_data: item.formData,
            status: item.status,
          });
          await markSynced(item.localId, res.data.id, res.data.version ?? item.version);
        } else {
          const res = await api.post('/responses', {
            form_number: item.formNumber,
            form_data: item.formData,
            status: item.status,
          });
          await markSynced(item.localId, res.data.id, res.data.version ?? item.version);
        }
      } catch (error: any) {
        if (isNetworkError(error)) {
          // Se cayó la conexión a mitad de la sincronización: reintentar luego.
          break;
        }
        await markError(item.localId, error?.response?.data?.message || 'Error al sincronizar');
      }
    }

    state.lastSyncAt = Date.now();
  } finally {
    inFlight = false;
    state.syncing = false;
    state.pending = await countPending();
    emit();
  }
}

let initialized = false;

export function initSync(): void {
  if (initialized) return;
  initialized = true;

  onNetworkChange((online) => {
    if (online) {
      void syncPending();
    } else {
      void refreshPendingCount();
    }
  });

  // Reintento periódico mientras la app está abierta.
  setInterval(() => {
    if (isOnline()) void syncPending();
  }, 60000);

  // Primer intento al arrancar.
  void syncPending();
}
