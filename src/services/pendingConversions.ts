interface PendingConversion {
  fileId: string;
  fileName: string;
  fileSize: number | undefined;
  sourceExtension: string;
  userId: string;
  chatId: number;
  messageId: number;
  allTargets: string[];
  createdAt: number;
}

const store = new Map<string, PendingConversion>();
let counter = 0;

export function addPending(
  data: Omit<PendingConversion, "createdAt">
): string {
  const id = (++counter).toString(36);

  // Cleanup old entries every 100 additions
  if (counter % 100 === 0) cleanup();

  store.set(id, { ...data, createdAt: Date.now() });
  return id;
}

export function getPending(id: string): PendingConversion | undefined {
  return store.get(id);
}

export function removePending(id: string) {
  store.delete(id);
}

function cleanup() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [key, val] of store) {
    if (val.createdAt < tenMinutesAgo) store.delete(key);
  }
}
