import { useEffect, useState } from 'react';
import { onSyncChange, syncPending } from '../../offline/sync';
import { isOnline, onNetworkChange } from '../../offline/network';
import './SyncStatus.css';

const SyncStatus = () => {
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const offSync = onSyncChange((state) => {
      setPending(state.pending);
      setSyncing(state.syncing);
    });
    const offNet = onNetworkChange((value) => setOnline(value));
    return () => {
      offSync();
      offNet();
    };
  }, []);

  let label = '';
  let className = 'sync-status';

  if (!online) {
    className += ' offline';
    label = pending > 0 ? `Sin conexión · ${pending} por subir` : 'Sin conexión';
  } else if (syncing) {
    className += ' syncing';
    label = 'Sincronizando...';
  } else if (pending > 0) {
    className += ' pending';
    label = `${pending} por subir`;
  } else {
    className += ' synced';
    label = 'Todo sincronizado';
  }

  const canManualSync = online && !syncing && pending > 0;

  return (
    <button
      type="button"
      className={className}
      onClick={() => canManualSync && syncPending()}
      title={canManualSync ? 'Sincronizar ahora' : label}
      disabled={!canManualSync}
    >
      <span className="sync-dot" />
      <span className="sync-label">{label}</span>
    </button>
  );
};

export default SyncStatus;
