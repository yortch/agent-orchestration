# Creative Direction: Valentine's "Love Invaders"

## 1. Core Concept
A playful, romantic twist on the classic arcade shooter. Instead of defending Earth from alien invaders, **Cupid** is spreading love to a descending grid of **Hearts**. The atmosphere should be warm, inviting, and satisfyingly "cute" without being overly saccharine. The goal is to "capture" hearts, not destroy enemies.

## 2. Entity Mapping & Visual Metaphors

| Classic Element | Valentine's Replacement | Visual Description |
| :--- | :--- | :--- |
| **Player Ship** | **Cupid's Cloud** | A fluffy white cloud with a golden bow protruding from the top. Moving creates a small trail of sparkles. |
| **Aliens** | **Floating Hearts** | Rows of pulsing hearts. Different rows can be different shades (Red, Pink, Purple) or have slightly different shapes (winged hearts, broken hearts that mend when hit). |
| **Player Projectiles** | **Love Arrows** | Golden shafts with pink fletching and heart-shaped tips. They leave a faint trail of "dust" (pixels). |
| **Enemy Projectiles** | **Kisses / Drops** | Instead of lasers, the hearts drop "kisses" (lip shapes) or small jagged "heartbreak" bolts downward. |
| **Bunkers/Shields** | **Love Letters** | Large, sealed envelopes. As they take damage, the paper tears, eventually disintegrating into confetti. |
| **UFO (Bonus)** | **Golden Ring / Box of Chocolates** | A special high-value item that floats across the top periodically. |

## 3. Color Palette

The aesthetic relies on high contrast between the neon-bright game elements and the deep background.

**✅ Implemented Colors:**

| Usage | Color Name | Hex Code | Implementation |
| :--- | :--- | :--- | :--- |
| **Background** | **Midnight Romance** | `#2D0036` | Canvas background, rendered in `draw.js` |
| **Primary Accent** | **Passion Red** | `#FF4D6D` | Bottom row hearts (red enemy type) |
| **Secondary Accent** | **Sweet Pink** | `#FF8FA3` | Middle row hearts (pink enemy type) |
| **Highlight** | **Blush Pink** | `#FFC4D6` | Top row hearts (purple enemy type), sparkle particles |
| **Player/Projectiles**| **Cupid Gold** | `#FFD700` | Player character and love arrows |
| **Shields** | **Paper White** | `#F0F0F0` | Clean white/cream for envelope shields |

**Additional Rendering Colors:**
- **Bonus Items**: Golden/yellow tones for rings, chocolates, love letters
- **Particles**: Mix of pink shades and gold for sparkles and hearts
- **Enemy Projectiles**: Hot pink (`#FF69B4`) for falling kisses
- **Text/HUD**: White with gold accents for scores and UI elements

**Color Usage Notes:**
- All colors defined in rendering functions for consistency
- No color constants exported (colors chosen per entity type)
- High contrast ensures visibility on dark background
- Warm palette supports romantic Valentine's theme

## 4. Visual Style & Art Approach

**Constraint:** No sprite assets. All visuals must be drawn procedurally using the HTML5 Canvas API.

**✅ Implemented Approach:**

*   **Geometry over Pixels:** Use smooth drawing commands (`arc`, `bezierCurveTo`, `moveTo`, `lineTo`) to create vector-like shapes.
*   **Pulsing Animation:** Hearts scale up/down slightly (±15%) using a sine wave synchronized with grid movement, creating a "heartbeat" effect. Implementation uses `Math.sin(time * PULSE_SPEED) * PULSE_AMOUNT`.
*   **Particle Effects:** When hearts are hit, they burst into 8-15 smaller particles (mini hearts and sparkles) that float upward/outward with physics (velocity, gravity, friction) and fade out over 0.4-0.9 seconds.
*   **Visual Feedback:** 
  - Shields show progressive cracks/tears at 30%, 60%, and 90% damage
  - Score popups briefly display bonus values when bonus enemies are hit
  - All animations use deltaTime for frame-rate independence
*   **Fonts:** The game uses system fonts for HUD text. Consider using a rounded, bubbly Google Font (e.g., *Varela Round* or *Fredoka One*) for enhanced visual appeal.

**Rendering Implementation:**
- All drawing code in `src/render/draw.js`
- Shape primitives in `src/render/sprites.js`:
  - `drawHeart()` - Creates hearts using bezier curves
  - `drawCloud()` - Player rendered as fluffy cloud
  - `drawArrow()` - Simple triangle and rectangle composition
  - `drawEnvelope()` - Shield drawn as paper envelope with flap
  - Particle rendering with type-specific shapes

**No External Assets Required:**
- Zero image files needed
- No sprite sheets to load
- Instant startup with no asset loading delay
- Entire game renders at 60 FPS using Canvas 2D API

## 5. Tone & Game Feel

**✅ Implemented:**
*   **Playful:** Sound effects are synthesized to be bouncy and pleasant (not harsh). Particle effects burst upward in a positive way rather than exploding violently.
*   **Positive:** We are not "killing" enemies; we are "winning hearts." Console logs and visual feedback reinforce this positive framing.
*   **Arcade:** Despite the cute theme, gameplay remains snappy and responsive with precise controls, tight collision detection, and immediate feedback.

**Performance & Responsiveness:**
- Targets 60 FPS with requestAnimationFrame game loop
- Delta time calculations ensure consistent gameplay across frame rates
- Canvas automatically scales to window size while maintaining game proportions
- Minimal input latency with direct keyboard event handling
- Particle system capped at 200 particles for performance

**Accessibility Considerations:**
- High contrast colors ensure visibility
- Multiple key options for each action (arrows/WASD, space/W/up)
- Clear visual feedback for all interactions
- Pause functionality allows breaks
- Audio can be muted through browser if needed

**Future Enhancements:**
- Background twinkling stars for depth
- Screen shake on player hit for impact
- Victory animations for level completion
- Power-ups or special weapons
- Mobile touch controls
