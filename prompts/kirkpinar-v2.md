# Kırkpınar v2 upgrade brief — for Claude Sonnet 5.5

## What the game is now
Single-file Three.js oil-wrestling physics game. `SIMLIB` (line 245, pure JS): lean/balance, grips decaying with oil and stamina (`GR`, `f.oil`), paça kazık, çaprast, künde, lift, slam; 90 s bouts + 45 s golden score. Career of 5 classes with 3-4 rivals each (`LADDER`, ~275), quick match, 2P. `?auto` career: 26 bouts, 18 wins, belt.
Play -> mode -> Career -> ladder -> versus card -> Enter (`onAct`, ~1931): 5 clicks to the first grip. The sound button lives only in the match HUD (`#bSound`, ~206). Help is a static hint line (`hint1`).
KEEP COUNTS STABLE: 5 classes, rival lists, career length, 90 s for the middle class.

## Upgrade items (priority order)

### 1. One click to the first grip
- why: 5 clicks (`play` ~1935 -> `career` -> `ladderGo` -> `vsGo`).
- build: Play/Continue calls `careerMatch()` for the current rung and starts after a 2.5 s versus card that any click skips; career / quick / 2P move behind a "More modes" button. Update `autoDriver` (~2238) or keep the `data-act` chain it clicks.
- done-when: one click gives `window.kirkpinar.screen === 'play'`; `?auto` and `?auto&mode=quick` still finish.

### 2. Coach for the first bout
- why: a new player meets `F G H R` and a balance bubble at once.
- build: in career bout 1 a 4-step strip that ticks on real input: grab (`F`), pull (`G`) until the rival's bubble reddens, crouch (`S`), strike when the move lights. Until finished, the AI `level` is scaled ~25 % down for that bout (`Brain`, ~803). "Skip tips" is one click; a finished flag is saved in `arena.kirkpinar.save`.
- done-when: the strip stays on step 1 without input; the bot ignores it.

### 3. Mute everywhere
- why: audit flags mute: `#bSound` is inside the hidden-on-menus HUD; `M` toggles music only (~1853).
- build: a fixed 44 px sound button on every screen toggling music and effects, saved as `settings.muted`; list `M` in the how-to; `AU.init()` still runs on the first gesture.
- done-when: visible on title, ladder, versus, pause, result; silences all; persists on reload.

### 4. Bout length grows with the class (real 1975 rule)
- why: every bout is 90 s (`limit: cfg.limit || 90`, `setupMatch` ~1789); the real sport has a limit only since 1975 and the final is the longest (fact 3).
- build: career limit by class: Deste 60 s, Ayak 75, Orta 90 (unchanged), Başaltı 105, Başpehlivan 120, then the existing 45 s golden score. Show it on the versus card and ladder rung with the one-line fact. Oil keeps rising (`f.oil` +0.0035/s, ~370), so late bouts force stamina pacing. Quick match keeps 90 s.
- done-when: `window.kirkpinar.state` shows per-class limits; bot still reaches the belt (report its bouts/wins).

### 5. Golden belt: three years and it is yours (real rule)
- why: the belt is only an ending screen (`showEnding`, ~2092); fact 4 gives a long-term goal.
- build: a belt-hall strip on ladder and ending: a finished career is a year; 3 consecutive finished careers (abandoning a run resets) unlock an engraved permanent belt skin and "belt kept". New `store.belt = { streak, kept }` inside `arena.kirkpinar.save`; show the 1450 g / 14 carat line.
- done-when: finishing a career shows "Year 1 of 3"; streak 3 shows the kept belt; old saves load.

### 6. Oil you can see
- why: oil drives grip and slips but skin material is fixed (`skinM`, roughness 0.34, `makeRig` ~1299).
- build: drive each wrestler's skin roughness 0.55 -> 0.22 from `f.oil`; droplet bursts on every `slip` event (`emitP`, ~1537; `handleEvents`, ~1987); darker grass patches where they stand (one decal texture); an oil tick on the grip bar.
- done-when: screenshots at 5 s and 85 s show clearly glossier skin; draw calls < 60.

### 7. Cazgır tales and facts
- why: the cazgır has 11 call types (`CAZ`, ~1628) but no cultural content.
- build: facts below (data table, URL in comments): a cazgır line before each class's first bout, and a "Did you know" on result and loading.
- done-when: each class's first bout shows a different fact; EN shows English.

## Facts for in-game cards
1. TR: Kırkpınar 2010'da UNESCO Temsili Listesi'ne girdi; açılışta 40 çift davul-zurna çalar, altın kemer şehirde dolaştırılır, pehlivanlar manda ya da sığır derisinden kıspet giyer. EN: Kırkpınar joined UNESCO's Representative List in 2010; the opening has 40 pairs of davul-zurna, the golden belt is paraded through the city, and wrestlers wear kıspet of buffalo or cattle hide. Source: https://ich.unesco.org/en/RL/kirkpinar-oil-wrestling-festival-00386
2. TR: Başlangıç yılı kaynağa göre 1360 ya da 1362; "yaklaşık 660 yıllık" demek güvenlidir. EN: Sources give 1360 or 1362 as the start; "about 660 years old" is the safe way to say it. Source: https://en.wikipedia.org/wiki/Kırkpınar_oil_wrestling and https://medyascope.tv/2025/06/30/664-tarihi-kirkpinar-yagli-guresleri-icin-geri-sayim-basladi/
3. TR: 1975'ten beri süre sınırı var: başpehlivanda 40 dakika, berabere kalırsa 15 dakika puanlı uzatma; öncesinde sınır yoktu. EN: Since 1975 there is a time limit: 40 minutes for the başpehlivan, and a tie goes to 15 minutes of scored extension; before 1975 there was none. Source: https://en.wikipedia.org/wiki/Kırkpınar_oil_wrestling
4. TR: Altın kemer en fazla 1450 g ve 14 ayar altındır; üst üste üç yıl kazanan kemeri kalıcı alır. EN: The golden belt weighs at most 1450 g and is 14 carat; three wins in a row keep it for good. Source: https://en.wikipedia.org/wiki/Kırkpınar_oil_wrestling
5. TR: Ağa, açık artırmayla seçilen hami ya da sponsordur; eskiden maçı durdurabilirdi. EN: The ağa is the patron chosen by auction; he could once stop a match. Source: https://en.wikipedia.org/wiki/Kırkpınar_oil_wrestling
6. TR: Güreşler 1924'ten beri Edirne Sarayiçi'nde yapılıyor. EN: The wrestling has been held at Sarayiçi in Edirne since 1924. Source: https://en.wikipedia.org/wiki/Kırkpınar_oil_wrestling

## Mascot
No. A kitten does not fit the arena naturally.

## Do not break
`window.kirkpinar`, `window.kirkpinarSim`; flags `?auto &fast=N &mode=quick &sim=N ?debug ?low ?lang ?noassets`; keys `arena.kirkpinar.settings|save` (add fields only); `SIMLIB` DOM-free, AI on the same inputs as a player; 2P map, touch stick, gamepad; 5 classes and `LADDER`; 51 draw calls budget; Play first; full TR/EN.

The shared rules in `_sablonlar/arena-upgrade-common.md` (and `_sablonlar/arena-round6-common.md`) are appended to this brief.
