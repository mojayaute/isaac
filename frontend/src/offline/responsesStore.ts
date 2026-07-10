import { db, type LocalResponse } from './db';

function makeLocalId(userId: string, formNumber: number): string {
  return `${userId}:${formNumber}`;
}

export async function getLocalResponse(
  userId: string,
  formNumber: number,
): Promise<LocalResponse | undefined> {
  return db.responses.get(makeLocalId(userId, formNumber));
}

export async function upsertLocalResponse(params: {
  userId: string;
  formId: number;
  formNumber: number;
  formData: Record<string, any>;
  status: 'draft' | 'submitted' | 'completed';
  serverId?: string;
  version?: number;
  syncStatus?: LocalResponse['syncStatus'];
}): Promise<LocalResponse> {
  const localId = makeLocalId(params.userId, params.formNumber);
  const existing = await db.responses.get(localId);

  const record: LocalResponse = {
    localId,
    serverId: params.serverId ?? existing?.serverId,
    userId: params.userId,
    formId: params.formId,
    formNumber: params.formNumber,
    formData: params.formData,
    status: params.status,
    version: params.version ?? (existing?.version ?? 1),
    syncStatus: params.syncStatus ?? 'pending',
    updatedAt: Date.now(),
    lastError: undefined,
  };

  await db.responses.put(record);
  return record;
}

export async function markSynced(
  localId: string,
  serverId: string,
  version: number,
): Promise<void> {
  const existing = await db.responses.get(localId);
  if (!existing) return;
  await db.responses.put({
    ...existing,
    serverId,
    version,
    syncStatus: 'synced',
    lastError: undefined,
  });
}

export async function markError(localId: string, message: string): Promise<void> {
  const existing = await db.responses.get(localId);
  if (!existing) return;
  await db.responses.put({ ...existing, syncStatus: 'error', lastError: message });
}

export async function getPendingResponses(): Promise<LocalResponse[]> {
  const pending = await db.responses.where('syncStatus').equals('pending').toArray();
  const errored = await db.responses.where('syncStatus').equals('error').toArray();
  return [...pending, ...errored];
}

export async function countPending(): Promise<number> {
  const pending = await db.responses.where('syncStatus').equals('pending').count();
  const errored = await db.responses.where('syncStatus').equals('error').count();
  return pending + errored;
}

export async function getUserResponses(userId: string): Promise<LocalResponse[]> {
  return db.responses.filter((r) => r.userId === userId).toArray();
}
