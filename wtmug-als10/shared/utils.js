export function isMobileDevice() {
  const ua = navigator.userAgent;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(screen.width, screen.height) <= 820;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  return mobileUa && (coarse || small);
}

/** Dosya boyutunu okunabilir biçime çevir */
export function formatBytes(n) {
  if (!Number.isFinite(n)) return '-';
  const u = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
}

/** Sohbete tek satır mesaj ekle */
export function appendMessage(container, text, cls = 'them') {
  const d = document.createElement('div');
  d.className = 'msg ' + cls;
  d.textContent = text;
  container.append(d);
  container.scrollTop = container.scrollHeight;
  return d;
}

/** Sohbete dosya (resim önizlemeli veya indirme linkli) ekle */
export function appendFile(container, blob, name, mime, cls = 'them') {
  const d = document.createElement('div');
  d.className = 'msg ' + cls;
  const url = URL.createObjectURL(blob);
  if (mime && mime.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '80%';
    img.style.borderRadius = '8px';
    d.append(img);
  } else if (mime && mime.startsWith('video/')) {
    const v = document.createElement('video');
    v.src = url; v.controls = true; v.style.maxWidth = '80%';
    d.append(v);
  } else {
    const a = document.createElement('a');
    a.href = url; a.download = name; a.textContent = `⬇️ ${name}`;
    d.append(a);
  }
  container.append(d);
  container.scrollTop = container.scrollHeight;
}