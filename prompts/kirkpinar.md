# Arena round 5, game 3: Kırkpınar (physics oil-wrestling) — built by Claude Sonnet 5.5

```text
Build a single-file browser game (one index.html with inline CSS and JS) using Three.js r170 loaded as an ES
module from https://cdn.jsdelivr.net/npm/three@0.170.0/ (import map; addons from examples/jsm/).
A 3D physics sports game called "Kırkpınar" about traditional Turkish oil wrestling (yağlı güreş). Do not ask
questions, build it end to end.

WORLD: a grass field (er meydanı) under a summer afternoon sky near Edirne, crowds on wooden stands, flags, the
cazgır (announcer) in the middle, drum and zurna players at the side, oil jugs. Two wrestlers (pehlivan) in
leather trousers (kıspet), shiny oiled skin. Stylised low-poly but with readable poses; one accent colour
(#C2410C kıspet brown) plus each wrestler's colour band.

CORE MECHANIC: active-ragdoll-like physics written by you (no physics library needed: a simple rigid-segment
skeleton with joint targets, balance from centre of mass over the feet, or a robust simplified model). Oil makes
grips slip: grip strength drops the longer you hold and with sweat/oil level. Moves: grab (left / right arm,
waist, kıspet hold), pull, push, lift, trip, and the classic finishing moves (paça kazık, çaprast, kündeye
almak) as context moves when the right grip and balance state are met. A wrestler loses when the back (both
shoulders) touches the ground or he is lifted and carried three steps. Stamina bar; balance indicator under
each wrestler.

MODES: career (climb from "deste" to "başpehlivan" through 5 weight classes, each with 3-4 opponents with
different styles: strong, fast, defensive, tricky), quick match, and local 2-player on one keyboard
(player 1 WASD + F G H, player 2 arrows + K L ;). Matches have a time limit; if nobody wins, a short golden-score
round. The AI must use the same moves and rules as a player.

INTERACTION: move, three action buttons (grab/release, pull, push/lift), a context-move button that lights up
when available; touch: virtual stick and buttons; gamepad optional. Camera follows the pair from the side,
slow-motion replay of the winning throw.

HUD: top bar (logo, class, round, timer, pause, sound, language), stamina and balance bars, move prompts,
toasts, title, career ladder with the golden belt (altın kemer) at the top, match result, ending ceremony.

EXTRAS: the cazgır's chant shown as subtitled lines (TR / EN), drum and zurna peşrev loop, crowd cheer, oil
splash particles, all synthesised (CC0 one-shots from asset-forge allowed).
```

The shared rules in `_sablonlar/arena-round5-common.md` are appended to this prompt.
