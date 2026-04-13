let dbPromise: Promise<IDBDatabase | null> | null = null;

export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

export function getDB(): Promise<IDBDatabase | null> {
  if (!isIndexedDBSupported()) {
    return Promise.resolve(null);
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve) => {
      const request = indexedDB.open('fileDB', 1);

      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as IDBRequest).result;

        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', {
            keyPath: 'id',
          });
        }
      };

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => resolve(null);
    });
  }

  return dbPromise;
}
