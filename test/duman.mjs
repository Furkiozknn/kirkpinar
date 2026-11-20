// Kırkpınar duman testi. Yerel sunucuda index.html'yi gerçek tarayıcıda açar:
//   1. sayfa açılıyor, konsol hatası ve 4xx/5xx yok
//   2. oyun başlıyor, bir tuş etkileşimi sonrası oyun durumu değişiyor
//   3. eski kayıtla (arena.kirkpinar.save) açılış bozulmuyor
//   4. telefon görünümünde (390x844) yatay taşma yok
//   5. v2.1: sürüm etiketi, Yenilikler/Rozetler penceresi, rozet kaydı, 404 sayfası
// Kullanım:  node test/duman.mjs [kök-klasör]      (varsayılan: deponun kökü)
// Ortam:     PW_MODULE=<playwright-core giriş dosyası ya da paket adı>   (varsayılan: playwright-core, sonra playwright)
//            BROWSER_PATH=<chrome/edge çalıştırılabilir dosyası>        (verilmezse Playwright'ın kendi tarayıcısı)
// Bağımlılık depoya eklenmez. Three.js CDN'den gelir (ağ gerekir). Çıkış kodu: hata varsa 1.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, extname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(process.argv[2] || join(here, '..'));
let pw;
for (const m of [process.env.PW_MODULE, 'playwright-core', 'playwright'].filter(Boolean)) {
  try { pw = await import(m.includes('/') || m.includes('\\') ? pathToFileURL(m).href : m); break; } catch (e) { /* sıradakini dene */ }
}
if (!pw) { console.log('FAIL playwright bulunamadı (PW_MODULE ayarla)'); process.exit(1); }
const chromium = pw.chromium || pw.default.chromium;

const MIME = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const srv = createServer((q, s) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = join(root, p);
  if (!existsSync(f) || statSync(f).isDirectory()) { s.writeHead(404, { 'content-type': 'text/plain' }).end('404'); return; }
  s.writeHead(200, { 'content-type': MIME[extname(f)] || 'application/octet-stream' }).end(readFileSync(f));
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const IGN = /gc\.zgo\.at|goatcounter/;
let failed = false;
const ok = (m) => console.log('ok   ' + m);
const bad = (m) => { failed = true; console.log('FAIL ' + m); };
const check = (c, m) => (c ? ok(m) : bad(m));

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.BROWSER_PATH || undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
async function open(vp, mobile, pre, q = '') {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await ctx.route(IGN, r => r.fulfill({ status: 200, body: '' }));
  if (pre) await ctx.addInitScript(pre);
  ctx.setDefaultTimeout(120000);
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push('pageerror ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text()); });
  page.on('response', r => { if (r.status() >= 400 && !IGN.test(r.url())) errs.push(r.status() + ' ' + r.url()); });
  await page.goto(base + q, { waitUntil: 'load' });
  await page.waitForFunction(() => { const b = document.getElementById('bPlay'); return b && !b.hidden && !b.disabled; }, null, { timeout: 120000 });
  return { ctx, page, errs };
}
try {
  // 1-2: masaüstü, yeni kayıt
  {
    const { ctx, page, errs } = await open({ width: 1366, height: 768 }, false, null, '?debug');
    check((await page.title()) === 'Kırkpınar', 'sayfa açılıyor, başlık Kırkpınar');
    await page.click('#bPlay');
    // rakip kartı 2.5 sn sürer, herhangi bir tıklama geçer
    for (let i = 0; i < 40 && (await page.evaluate(() => window.kirkpinar.screen)) !== 'play'; i++) { await page.mouse.click(683, 384); await page.waitForTimeout(500); }
    await page.waitForFunction(() => window.kirkpinar && window.kirkpinar.screen === 'play', null, { timeout: 60000 });
    ok('oyun başladı (ekran=play)');
    const snap = () => page.evaluate(() => JSON.stringify(window.kirkpinar.state));
    const a = await snap();
    // ?debug: kirkpinarSim(sn) benzetimi hızlandırır; yavaş makinede kare hızından bağımsız ve kesin sonuç verir
    await page.keyboard.down('KeyD'); await page.evaluate(() => window.kirkpinarSim(6)); await page.keyboard.up('KeyD');
    const b = await snap();
    check(a !== b, 'tuş etkileşiminden sonra oyun durumu değişti');
    check(errs.length === 0, 'masaüstü: konsol/ağ hatası yok' + (errs.length ? ' -> ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
  // 3: eski kayıt
  {
    const old = JSON.stringify({ run: null, career: null, best: { fastest: 41, titles: 1, wins: 12, points: 30 }, coachDone: true, belt: { streak: 1, kept: false } });
    const { ctx, page, errs } = await open({ width: 1366, height: 768 }, false, `try{localStorage.setItem('arena.kirkpinar.save', ${JSON.stringify(old)})}catch(e){}`);
    const keep = await page.evaluate(() => JSON.parse(localStorage.getItem('arena.kirkpinar.save')).best.wins);
    check(keep === 12 && errs.length === 0, 'eski kayıtla açılış çalışıyor, kayıt korunuyor');
    // 5: v2.1 özellikleri
    const hasNews = await page.$('[data-act="news"]');
    if (!hasNews) bad('v2.1: Yenilikler düğmesi yok');
    else {
      await page.click('[data-act="news"]');
      const txt = await page.evaluate(() => document.getElementById('newsBox').innerText);
      check(/Sürüm 2\.1/.test(txt) && /Rozetler/.test(txt) && /12/.test(txt), 'v2.1: Yenilikler penceresi açılıyor, rozetler ve eski rekor (12 galibiyet) görünüyor');
      await page.keyboard.press('Escape');
      check(await page.evaluate(() => document.getElementById('s-news').hidden), 'v2.1: Esc pencereyi kapatıyor');
    }
    const foot = await page.evaluate(() => (document.querySelector('.foot') || {}).innerText || '');
    check(/v2\.1/.test(foot) && !!(await page.$('.foot a[href="https://furkiozknn.github.io/"]')), 'v2.1: sürüm etiketi ve merkez sayfa bağlantısı var');
    check(errs.length === 0, 'eski kayıtla: konsol/ağ hatası yok' + (errs.length ? ' -> ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }
  // 4: telefon
  {
    const { ctx, page, errs } = await open({ width: 390, height: 844 }, true);
    const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, off: [...document.querySelectorAll('#s-title button, #s-title .btn')].filter(e => e.offsetWidth).filter(e => { const r = e.getBoundingClientRect(); return r.left < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1; }).map(e => e.textContent.trim()) }));
    check(m.sw <= m.iw && m.off.length === 0, 'telefon 390x844: yatay taşma yok, başlık düğmeleri ekranda' + (m.off.length ? ' -> ' + m.off.join(',') : ''));
    if (await page.$('[data-act="news"]')) {
      await page.tap('[data-act="news"]');
      const r = await page.evaluate(() => { const b = document.querySelector('#newsBox'); const p = b.getBoundingClientRect(); return { w: b.scrollWidth <= b.clientWidth + 1, inside: p.left >= 0 && p.right <= innerWidth }; });
      check(r.w && r.inside, 'v2.1: telefonda Yenilikler penceresi taşmıyor');
    }
    check(errs.length === 0, 'telefon: konsol/ağ hatası yok');
    await ctx.close();
  }
  // 404 sayfası
  {
    const ctx = await browser.newContext(); const page = await ctx.newPage();
    const res = await page.request.get(base + 'olmayan-sayfa');
    check(existsSync(join(root, '404.html')), 'v2.1: 404.html depoda var (GitHub Pages bunu 404 için sunar)');
    void res; await ctx.close();
  }
} catch (e) { bad('beklenmeyen: ' + (e && e.message)); }
await browser.close(); srv.close();
console.log(failed ? 'SONUC: BASARISIZ' : 'SONUC: TAMAM');
process.exit(failed ? 1 : 0);
