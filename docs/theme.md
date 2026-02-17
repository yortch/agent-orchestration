# Valentine's Day Space Invaders: Theme Design

## 1. Core Concept & Motif Mappings

We are reimagining the classic cold, mechanical Space Invaders aesthetic into a warm, playful, and affectionate "Love Invaders" theme. The goal is to spread love, not war!

| Classic Element | Valentine's Motif | Design Notes |
|-----------------|-------------------|--------------|
| **Player Ship** | **The Love Launcher** | A stylized, mechanical heart-shaped cannon. It shouldn't look militaristic; think "cupid's tank." |
| **Player Bullets**| **Cupid's Arrows** | Swift, golden arrows with heart-shaped tips, or small fluttering pink hearts leaving a sparkle trail. |
| **Enemies** | **The Heartbreakers** | <br>• **Row 1 (Bottom):** Broken Hearts (jagged crack down the middle).<br>• **Row 2:** Grumpy cloud emojis or storm clouds.<br>• **Row 3:** Anti-Love symbols (circles with a slash through a heart).<br>• **UFO:** A giant "Friend Zone" sign or a flying letter of rejection. |
| **Enemy Bullets** | **Tears / Heartbreak** | Blue tear-drops or jagged lightning bolts representing heartbreak. |
| **Explosions** | **Love Bursts** | Instead of fire and smoke, enemies burst into a cloud of tiny hearts, confetti, and "XOXO" text particles. |
| **Bunkers** | **Chocolate Blocks** | Defensive barriers made of chocolate bars that "bite" away when hit. |

## 2. Color Palette

The palette focuses on warm, inviting tones associated with romance, contrasted with cooler tones for the antagonists to ensure visual clarity.

### Primary Colors (Player & UI)
- **Deep Red:** `#FF004D` (Core player elements, UI highlights)
- **Hot Pink:** `#FF69B4` (Bullets, active states)
- **Soft Pink:** `#FFB6C1` (Background elements, trails)
- **Gold:** `#FFD700` (Score, arrow tips, power-ups)

### Antagonist Colors (The Heartbreakers)
- **Icy Blue:** `#E0FFFF` (Tears, enemy projectiles - high contrast against pink/red)
- **Slate Grey:** `#708090` (Storm clouds, mechanical anti-love devices)
- **Purple:** `#800080` (Boss/UFO elements)

### Background
- **Deep Void with Glow:** `#2C001E` (Dark purple/burgundy void to make the bright pinks pop).
- **Stars:** Soft pulsating white and pale yellow dots.

## 3. Art Approach: Procedural Canvas Drawing

To maximize iteration speed and ensure a crisp, scalable look on all screens, we will strictly use **Procedural Canvas API Drawing**.

*   **No Bitmaps:** We will not import `.png` or `.jpg` sprites.
*   **Vector Style:** All game objects will be drawn using `ctx.beginPath()`, `ctx.arc()`, `ctx.lineTo()`, etc.
*   **Advantages:**
    *   Infinite resolution scaling.
    *   Easy to tweak colors programmatically (e.g., enemies pulsing different shades of red).
    *   Animation through code (e.g., a heart "beating" by changing scale).

## 4. Visual Style & UX Guidelines

*   **Vibe:** Cute, bubbly, and hyper-casual. It should feel like a sticky-sweet arcade game.
*   **Animation:** Everything should bounce or pulse. The player ship shouldn't just slide; it should have a subtle "squish" when moving.
*   **Feedback:**
    *   **Hit Reactions:** Enemies should flash white and "shudder" before bursting.
    *   **Sound Visualization:** Visual cues for sound effects (e.g., screen shake on player death, ripple effect on shooting).
*   **Typography:** Use a rounded, soft font for text (e.g., "Varela Round" or "Fredoka One" if available, otherwise fallback to system sans-serif with rounded corners).

## 5. Detailed Drawing Specifications

This section defines the procedural drawing logic for each game entity. Measurements are relative to a standardized `gridSize` (e.g., 20px) or entity `width/height` to ensure scalability.

### 5.1 Player Ship: "The Love Launcher"
A mechanical, yet cute, cannon shaped like a heart.

*   **Dimensions:** ~2.5x `gridSize` wide, ~2x `gridSize` high.
*   **Base Shape:** Standard Heart shape.
    *   Move to top-center indentation.
    *   Bezier curve to right lobe top.
    *   Bezier curve to bottom point.
    *   Mirror for left side.
*   **Colors:**
    *   *Body:* Gradient from `#FF004D` (bottom) to `#FF69B4` (top) to give volume.
    *   *Highlight:* Small white oval opacity (0.4) on the upper-left lobe.
*   **Decorative Elements:**
    *   *Turret:* A small, darker cylinder or rectangle protruding slightly from the top indentation of the heart where bullets spawn.
    *   *Tracks/Wheels (Optional):* Two small gray round-rects at the bottom for "tank" treads.

```javascript
// Pseudo-code for Heart Path
ctx.beginPath();
ctx.moveTo(0, -height/4); 
ctx.bezierCurveTo(width/2, -height/2, width, 0, 0, height/2); // Right side
ctx.moveTo(0, -height/4);
ctx.bezierCurveTo(-width/2, -height/2, -width, 0, 0, height/2); // Left side
ctx.fill();
```

### 5.2 Player Projectile: "Cupid's Arrow"
A swift, piercing projectile.

*   **Dimensions:** Thin and tall. Width ~4px, Height ~16px.
*   **Shape Components:**
    *   *Shaft:* 1px wide line, gold color.
    *   *Head:* A small solid heart or diamond at the top tip.
    *   *Fletching:* Two small "V" shapes at the bottom tail angled away.
*   **Colors:**
    *   *Shaft:* `#FFD700` (Gold)
    *   *Head/Fletching:* `#FF69B4` (Hot Pink) or White.

### 5.3 Enemy Types (The Heartbreakers)
We use 3 distinct silhouettes to distinguish rows.

#### Type 1: "The Naughty Cherub" (Rows 3-4)
Small winged creatures.
*   **Body:** Central circle (face).
*   **Wings:** 3 overlapping small circles or an arc on each side of the body.
*   **Detail:** Two small dots for eyes, simple curved line for a mischievous frown.
*   **Color:** `#E6E6FA` (Lavender) body with `#87CEEB` (Sky Blue) wings.

#### Type 2: "The Broken Heart" (Rows 1-2)
A heart that has lost its love.
*   **Shape:** Similar to player heart, but wider.
*   **The Crack:** A zig-zag "lightning bolt" path of *clear* pixels (using `globalCompositeOperation = 'destination-out'` or simply drawing a background-colored line) cutting through the center vertically.
*   **Animation:** The two halves could slightly wobble apart.
*   **Color:** `#708090` (Slate Grey) or desaturated Purple.

#### Type 3: "The Anti-Love Badge" (Top Row)
A symbol of rejection (The "No" Sign).
*   **Shape:** A thick ring (donut shape).
*   **Slash:** A diagonal bar from top-left to bottom-right (45 degrees).
*   **Center:** A small heart mostly obscured by the slash.
*   **Color:** `#B22222` (Firebrick) ring/slash, dark interior.

### 5.4 Enemy Projectile: "Heartbreak Drop"
Sadness in physical form.

*   **Shape:** Teardrop.
    *   Pointed top, rounded bottom.
*   **Dimensions:** ~6px wide, ~10px tall.
*   **Drawing Logic:**
    *   Arc for the bottom semi-circle.
    *   Lines connecting the widest point to a single point at the top center.
*   **Color:** `#E0FFFF` (Icy Blue) with a slight white glint.
*   **Effect:** Leave a faint blue trail (store previous positions) that fades quickly.

### 5.5 Particle Effects: "Love Burst"
Used when enemies are defeated.

*   **Count:** Spawn 6-10 particles per explosion.
*   **Shape:** Tiny hearts and circles.
*   **Movement:** Radial spread with random velocity. Apply gravity/drag.
*   **Color Sequence:**
    *   Mix of `#FF004D`, `#FFD700`, and `#FFFFFF`.
*   **Animation:**
    *   Start scale: 1.0.
    *   End scale: 0.
    *   Lifetime: ~0.5 - 0.8 seconds.

---
*Design Document approved by Lead Designer.*
