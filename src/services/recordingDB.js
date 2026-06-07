// Local recording store. Real video blobs in IndexedDB — no cloud, no mock.
const DB = "promptdrop", STORE = "recordings", VERSION = 1;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    const out = fn(store);
    t.oncomplete = () => resolve(out);
    t.onerror = () => reject(t.error);
  });
}

export const recordingDB = {
  async save(rec) { await tx("readwrite", (s) => s.put(rec)); return rec.id; },
  async list() {
    const db = await open();
    return new Promise((resolve, reject) => {
      const out = [];
      const cur = db.transaction(STORE, "readonly").objectStore(STORE).openCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (c) { const { blob, ...meta } = c.value; out.push(meta); c.continue(); }
        else resolve(out.sort((a, b) => b.createdAt - a.createdAt));
      };
      cur.onerror = () => reject(cur.error);
    });
  },
  async get(id) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const r = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    });
  },
  async remove(id) { await tx("readwrite", (s) => s.delete(id)); },
};
