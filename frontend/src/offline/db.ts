import Dexie, { type Table } from 'dexie';

export type SyncStatus = 'pending' | 'synced' | 'error';

export interface LocalResponse {
  localId: string;
  serverId?: string;
  userId: string;
  formId: number;
  formNumber: number;
  formData: Record<string, any>;
  status: 'draft' | 'submitted' | 'completed';
  version: number;
  syncStatus: SyncStatus;
  updatedAt: number;
  lastError?: string;
}

export interface LocalForm {
  formNumber: number;
  id: number;
  title: string;
  description?: string;
  isActive?: boolean;
  orderIndex?: number;
}

export interface CacheEntry {
  key: string;
  value: any;
}

class OfflineDB extends Dexie {
  responses!: Table<LocalResponse, string>;
  forms!: Table<LocalForm, number>;
  cache!: Table<CacheEntry, string>;

  constructor() {
    super('iph-offline');
    this.version(1).stores({
      responses: 'localId, [userId+formNumber], syncStatus, serverId',
      forms: 'formNumber, id',
      cache: 'key',
    });
  }
}

export const db = new OfflineDB();

export async function setCache(key: string, value: any): Promise<void> {
  await db.cache.put({ key, value });
}

export async function getCache<T = any>(key: string): Promise<T | undefined> {
  const entry = await db.cache.get(key);
  return entry?.value as T | undefined;
}
