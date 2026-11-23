# Credits

## 3D chibi art (`assets/3d/`, stil-3d, 24.11.2026)

The game's look follows its song video (stylised 3D chibi, warm golden-hour light, clay/toy material). All images
below were generated with the **Gemini app (Nano Banana)** from our own text prompts (no reference uploads), then cut
from their item sheets and converted to WebP locally (`atolye/oyun-stil/kirkpinar/kes.py`: white background keyed out
by flood fill, cropped, resized).

| File | Source sheet (Gemini) | Use |
|---|---|---|
| `yuz-0.webp` … `yuz-8.webp` | 3x3 sheet of wrestler heads | camera-facing chibi heads of the wrestlers (player = `yuz-0`), versus card faces |
| `figur-pehlivan.webp`, `figur-acemi.webp`, `figur-kemer.webp`, `figur-kayan.webp` | 2x2 character sheet (başpehlivan and rookie) | title screen, result card, ending |
| `npc-cazgir.webp`, `npc-cazgir-cagri.webp`, `npc-hakem.webp`, `npc-davul.webp`, `npc-davul2.webp`, `npc-zurna.webp`, `npc-kamera.webp`, `npc-aga.webp`, `npc-cocuk.webp`, `cazgir-yuz.webp` | 3x3 festival sheet | in-game cazgır, referee, davul-zurna band, cameramen, ağa and oil boy; cazgır face in the speech and fact cards |
| `seyirci.webp` | 3x3 spectator sheet (atlas, 128x160 cells) | the crowd in the stands (row 0 calm, rows 1-2 cheering) |
| `gokyuzu.webp` | panoramic golden-hour sky | sky dome |

Everything else (wrestler bodies, arena, sounds) is still generated in code.
