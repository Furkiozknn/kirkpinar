# Kırkpınar

A 3D physics oil-wrestling (yağlı güreş) game inspired by the Kırkpınar tradition near Edirne, Turkey. One `index.html`, Three.js r170 from a CDN, no build step, no other assets: every model, texture and sound is generated in code.

Part of the **Claude Game Arena** series. Built by **Claude Sonnet 5.5** with Claude Code from one prompt: `prompts/kirkpinar.md` (plus the shared round-5 rules).

Play it: open `index.html` through any static server (for example `python -m http.server 8753` in the parent folder, then `http://127.0.0.1:8753/kirkpinar/`). Turkish is the default language; EN / TR can be switched in the game (key `L`).

## How to play

You and your rival are two pehlivans in leather trousers (kıspet) on the grass of the er meydanı. Skin and trousers are oiled, so every hold slowly slips.

1. **Close in and grab** (`F`). The first hand takes the arm, the next the waist; hold **S** (crouch) while grabbing to take the kıspet. The kıspet hold is the most reliable under oil.
2. **Break the balance.** **Pull** (`G`) drags the rival toward you, **Push** (`H`) shoves him away. The bubble under each wrestler is his balance: the dot drifts toward where he is leaning, green, amber, red. Walking away from a hold also drags the rival. Pulling and pushing wear down your own grip and stamina.
3. **Strike when the move button lights up** (`R`). A finishing move needs the right grip and an off-balance rival:
   - **Paça kazık** - kıspet hold, rival off balance.
   - **Çaprast** - cross hold (one arm hold, one waist hold), rival off balance.
   - **Kündeye al** - rival is down on the grass: pin him and win the struggle (mash the move button) to roll him onto his back.
   - **Yere çal** (slam) - while carrying a lifted rival.
4. **Lift.** Hold **Push** with a waist or kıspet hold on an off-balance rival: he is lifted. Carry him three steps to win, or slam him.
5. **Trip.** Crouch + Pull hooks the rival's leg (cooldown) and weakens his balance for a moment.

You lose when your back (both shoulders) touches the ground, or when you are lifted and carried three steps. Falls onto the side or front only score a point for your rival; he can follow up with the künde. Matches last 90 seconds; if nobody wins, the player with more points wins, and a tie goes to a 45 second **golden score** round (first point wins).

### Modes

- **Career**: climb the ladder through five weight classes (Deste, Ayak, Orta, Başaltı, Başpehlivan), each with 3-4 opponents of four styles (strong, fast, defensive, tricky). Win the last bout for the golden belt (altın kemer). The run is saved.
- **Quick match**: choose the rival style, weight class and difficulty.
- **2 players** on one keyboard.

The AI uses exactly the same input record and rules as a player (it presses the same buttons through the same simulation).

### Controls

| Action | Player 1 | Player 2 (2P mode) | Single player |
|---|---|---|---|
| Move | `A` `D` | `←` `→` | `A` `D` or arrows |
| Crouch / stand tall | `S` / `W` | `↓` / `↑` | `S` / `W` or arrows |
| Grab / release | `F` | `K` | `F` or `K` |
| Pull (crouched: leg hook) | `G` | `L` | `G` or `L` |
| Push (hold: lift) | `H` | `;` | `H` or `;` |
| Context move | `R` | `Enter` or `'` | `R`, `Space` or `Enter` |

Global: `P` / `Esc` pause, `M` music, `X` effects, `L` language (not during a 2-player bout, where it is Player 2's pull). Touch: virtual stick (left/right, down to crouch, up to stand tall) and four buttons. A gamepad works too (stick or d-pad, `A` grab, `X` pull, `B` push, `Y` move, Start pause).

Settings (master / music / effects volume, TR / EN, Low / High quality, fullscreen) are saved in `localStorage` under `arena.kirkpinar.settings`; the career run and best results under `arena.kirkpinar.save`.

## URL flags

| Flag | Effect |
|---|---|
| `?lang=en` / `?lang=tr` | start language |
| `?low` | shadows off, fewer particles and spectators |
| `?noassets` | accepted for the arena convention; the game uses no external assets anyway |
| `?debug` | shows fps, draw calls, triangles, fighter states and JS errors; exposes `window.kirkpinarSim(seconds)` |
| `?auto` | a bot plays the whole career by itself (clicks the real menus). `&fast=N` sets the simulation speed (default 6), `&mode=quick` plays one quick match instead, `&sim=N` fast-forwards N seconds at the start of each bout |

`window.kirkpinar` exposes the live state (`state`, `screen`, `fps`, `drawCalls`, `auto`, `assets`, `errors`).

## How it works

- **Simulation** (`SIMLIB`, pure JavaScript, no DOM): each wrestler is a rigid-segment body with a centre-of-mass lean vector over his feet. Leaning past his balance limit makes him step (if he can) or fall; the direction decides back, side or front. Grips have a strength that decays with hold time, oil and sweat, effort and stamina, and slip when overloaded. Pull, push, trip, lift, carry and the finishing moves all act on the lean vectors and grips. Ground work (künde) is a small tug-of-war meter.
- **Pose solver**: joints are computed in code every frame (spine bend, tilt about the feet, two-bone IK for arms to the grip points on the rival and for legs to planted, stepping feet), then low-poly capsule meshes are oriented between the joints. Falls, throws, kneeling, pinning and carrying are the same solver with different parameters.
- **Replay**: the last two seconds of joint arrays are recorded and played back in slow motion from an orbiting camera after a decisive finish.
- **Audio**: Web Audio only: a hicaz-flavoured zurna phrase over a 9/8 davul pattern with a drone, crowd murmur, cheers, slaps, thuds and whistles.
- **Rendering**: MeshLambert / MeshStandard, one directional light with a 1024 shadow map that follows the pair, merged static scenery, instanced spectators, a soft-sprite particle system for oil and dust. No post-processing.

## Files

- `index.html` - the whole game
- `prompts/kirkpinar.md` - the prompt it was built from
- `docs/` - screenshots

## License

MIT, see `LICENSE`. No third-party assets are used (Three.js is loaded from jsDelivr under its MIT license).
