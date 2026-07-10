import { formsApi, responsesApi } from '../services/api';
import type { Form } from '../types';
import { db, type LocalForm } from './db';
import {
  getLocalResponse,
  upsertLocalResponse,
  getUserResponses,
} from './responsesStore';
import { isOnline, isNetworkError } from './network';
import { syncPending, refreshPendingCount } from './sync';

function toLocalForm(form: Form): LocalForm {
  return {
    formNumber: form.formNumber,
    id: form.id,
    title: form.title,
    description: form.description,
    isActive: form.isActive,
    orderIndex: form.orderIndex,
  };
}

/** Lista de formularios: red primero (y cachea), fallback a IndexedDB. */
export async function loadForms(): Promise<LocalForm[]> {
  if (isOnline()) {
    try {
      const forms = await formsApi.getAll();
      const locals = forms.map(toLocalForm);
      await db.forms.bulkPut(locals);
      return locals.sort((a, b) => a.formNumber - b.formNumber);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
    }
  }
  return db.forms.orderBy('formNumber').toArray();
}

/** Un formulario por número: red primero (cachea), fallback a IndexedDB. */
export async function loadForm(formNumber: number): Promise<LocalForm | undefined> {
  if (isOnline()) {
    try {
      const form = await formsApi.getByFormNumber(formNumber);
      const local = toLocalForm(form);
      await db.forms.put(local);
      return local;
    } catch (error) {
      if (!isNetworkError(error)) throw error;
    }
  }
  return db.forms.get(formNumber);
}

/**
 * Respuesta de un formulario: si existe local la usa (fuente de verdad en campo).
 * Si no hay local y hay conexión, la trae del servidor y la cachea como sincronizada.
 */
export async function loadResponse(
  userId: string,
  formNumber: number,
): Promise<{ formData: Record<string, any>; status: string } | null> {
  const local = await getLocalResponse(userId, formNumber);
  if (local) {
    return { formData: local.formData, status: local.status };
  }

  if (isOnline()) {
    try {
      const remote = await responsesApi.getByForm(userId, formNumber);
      if (remote) {
        const formData = (remote as any).formData ?? {};
        await upsertLocalResponse({
          userId,
          formId: (remote as any).formId ?? (remote as any).form_id,
          formNumber,
          formData,
          status: remote.status,
          serverId: remote.id,
          version: remote.version,
          syncStatus: 'synced',
        });
        return { formData, status: remote.status };
      }
    } catch (error) {
      if (!isNetworkError(error)) throw error;
    }
  }

  return null;
}

/** Guarda SIEMPRE en local primero; luego intenta sincronizar si hay red. */
export async function saveResponse(params: {
  userId: string;
  formId: number;
  formNumber: number;
  formData: Record<string, any>;
  status: 'draft' | 'submitted' | 'completed';
}): Promise<void> {
  await upsertLocalResponse({ ...params, syncStatus: 'pending' });
  await refreshPendingCount();
  if (isOnline()) {
    void syncPending();
  }
}

/** Progreso calculado desde lo guardado localmente (funciona offline). */
export async function loadLocalProgress(
  userId: string,
): Promise<{ completed: number; total: number }> {
  const responses = await getUserResponses(userId);
  const completed = responses.filter((r) => r.status === 'completed').length;
  return { completed, total: 15 };
}
