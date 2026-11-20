# Değişiklik günlüğü

## 2.1 · Kasım 2026

Yenilikler
- **Rozetler:** ilk galibiyet, Şimşek (25 sn ve altında galibiyet), Künde Ustası, Yere Çalan, Üçleme (üst üste 3 galibiyet), Günün Pehlivanı, On Galibiyet, Başpehlivan ve Altın Kemer. Bu cihazda `arena.kirkpinar.ach` anahtarında saklanır; antrenman, iki oyunculu mod ve `?auto` botu rozet kazanmaz. Güreş sonu kartında yeni rozet görünür.
- **Yenilikler · Rozetler penceresi:** başlık ekranındaki yeni düğmeden açılır; sürüm notları, rozetler ve yerel rekorlar (galibiyet, başpehlivanlık, en hızlı galibiyet, üst üste galibiyet) tek yerde. `Esc` ile kapanır.
- **Sürüm etiketi ve merkez sayfa bağlantısı:** başlık ekranının altında "v2.1 · Kasım 2026" ve "Diğer oyunlar" (https://furkiozknn.github.io/).
- **Erişilebilirlik:** azaltılmış hareket açıkken final konfetisi artık çıkmıyor.

Sayfa
- Türkçe `description` ve paylaşım kartı metni (Open Graph ve Twitter), `og:locale`, `theme-color`, simge (SVG).
- `404.html`: oyuna ve merkez sayfaya dönen düğmeler.

Geliştirme
- `test/duman.mjs`: sayfa açılışı, konsol hatası, oyun başlangıcı, tuş etkileşimi, eski kayıtla açılış, telefon taşması, yeni pencere ve 404 sayfası kontrolü.

Değişmeyenler: oyun adresi, dosya yolları, kayıt anahtarları (`arena.kirkpinar.settings`, `arena.kirkpinar.save`), oynanış ve kurallar.
