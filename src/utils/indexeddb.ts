let dbPromise: Promise<IDBDatabase> | null = null;

export function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
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
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}
