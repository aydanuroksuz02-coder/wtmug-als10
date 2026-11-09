const ID_KEY   = 'als10.pendingId';
const ROLE_KEY = 'als10.pendingRole';
const CHANNEL  = 'als10-bridge';

let bc = null;
try { bc = new BroadcastChannel(CHANNEL); } catch {}

/** QR'dan okunan ID'yi ALŞ09 için sakla */
export function setPendingId(id, role = null) {
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{4,64}$/.test(id)) return false;
  localStorage.setItem(ID_KEY, id);
  if (role) localStorage.setItem(ROLE_KEY, role);
  bc?.postMessage({ type: 'id-set', id, role });
  return true;
}

/** ID'yi silmeden kontrol et */
export function peekPendingId() {
  const id = localStorage.getItem(ID_KEY);
  return id && /^[A-Za-z0-9_-]{4,64}$/.test(id) ? id : null;
}

/** ID'yi oku ve temizle (tek kullanımlık) */
export function consumePendingId() {
  const id = peekPendingId();
  const role = localStorage.getItem(ROLE_KEY);
  localStorage.removeItem(ID_KEY);
  localStorage.removeItem(ROLE_KEY);
  return id ? { id, role } : null;
}

/** Aynı origin'deki diğer sekmelere mesaj gönder */
export function broadcast(msg) {
  bc?.postMessage(msg);
}

/** Mesajları dinle (örn. ALŞ08 sekmesi ALŞ09 sekmesine ID yollar) */
export function onBridgeMessage(handler) {
  bc?.addEventListener('message', e => handler(e.data));
}

/** QR içeriğinden ID çek: "als10://id=ABC123" veya düz "ABC123" */
export function parseIdFromQr(text) {
  if (!text) return null;
  const m = text.match(/(?:id=|als10:\/\/)([A-Za-z0-9_-]{4,64})/);
  if (m) return m[1];
  const t = text.trim();
  return /^[A-Za-z0-9_-]{4,64}$/.test(t) ? t : null;
}