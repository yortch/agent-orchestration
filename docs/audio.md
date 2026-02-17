# Audio System Design: Valentine's Invaders

## Sonic Identity
The soundscape for *Valentine's Invaders* must strictly adhere to the charming, lighthearted, and "bubbly" aesthetic of the visual design. We are avoiding harsh, aggressive 8-bit explosions in favor of soft, magical, or "popping" sounds that evoke love and affection. The audio should feel like a romantic arcade cabinet experienced through rose-colored glasses.

## 1. Audio Approach
*   **Mechanism**: Utilize standard `HTMLAudioElement` (`new Audio()`) for maximum compatibility and simplicity.
    *   *Constraint*: While Web Audio API offers more control, simple HTML5 Audio is sufficient for this scope unless procedural sound is required.
*   **User Interaction & Autoplay**:
    *   Browser policies block autoplay. Audio context must resume or sounds must be triggered only **after** the first user interaction (e.g., clicking "Start Game" or pressing a key on the title screen).
*   **Controls**:
    *   **Mute Toggle**: Essential for user experience. Bind to the `M` key. Visual feedback (icon) for mute state is required on the HUD.

## 2. Required Sound Effects (SFX) Specifications

| Event | Concept / Description | Duration | Priority |
| :--- | :--- | :--- | :--- |
| **Player Shoot** | **"Cupid's Release"**: A soft *thwip* or harp-string pluck sound. High-pitched, quick, and airy. Not a laser zap. | < 0.3s | High |
| **Invader Hit** | **"Heart Pop"**: A satisfying bubble popping sound or a light magical chime. Think "glitter" or "sparkle" sounds. | < 0.5s | High |
| **Player Hit** | **"Heartbreak"**: A comedic "womp-womp" or a shattering glass sound, but not too jarring. A clearly negative but playful feedback. | < 1.0s | High |
| **Wave Clear** | **"Love Triumph"**: A short, triumphant fanfare. A major chord arpeggio (harp or synth-flute). | ~2.0s | Medium |
| **Game Over** | **"Lost Love"**: A slow, fading melody. Melancholic but sweet. Maybe a slowed-down version of the theme. | ~3.0s | Medium |
| **BGM (Loop)** | **"Romance Arcade"**: An upbeat, chiptune-influenced track but with a softer instrument palette (flutes, bells, soft squares) rather than harsh saws. | Loop | Low |

## 3. Sound Design Guidelines
*   **Duration**: Keep gameplay SFX extremely short (< 0.5s) to prevent muddiness during rapid-fire sequences.
*   **Theme Integration**:
    *   Use "Musical" SFX where possible (e.g., collecting items plays notes in a scale).
    *   Avoid: Realistic gunshots, heavy explosions, metallic crunches.
    *   Embrace: Harps, chimes, bells, bubbles, pops, gentle synths.
*   **Volume Balancing**:
    *   BGM: 40-50% operational volume (should not overpower SFX).
    *   Shoot/Hit SFX: 80% volume (frequent, shouldn't be ear-piercing).
    *   Alerts (Game Over/Level Up): 100% volume.
*   **Procedural Alternative**: If assets cannot be sourced, use `AudioContext` oscillators:
    *   *Shoot*: Sine wave frequency sweep (High -> Low).
    *   *Hit*: Triangle wave short decay.

## 4. Implementation Strategy
*   **Sourcing**:
    *   Open Game Art / Freesound (search: "magical", "cute", "harp", "bubble").
    *   *Procedural Generation*: Creating a `SoundManager` class that generates simple beeps and boops using the Web Audio API is a lightweight alternative to loading files.
*   **Formats**:
    *   Primary: **.MP3** (good compression/quality balance for web).
    *   Alternative: **.WAV** (for very short SFX if latency is an issue, though bigger file size).
*   **File Structure**:
    *   `/assets/sounds/shoot.mp3`
    *   `/assets/sounds/hit.mp3`
    *   `/assets/sounds/explosion.mp3`
*   **Fallback**:
    *   Wrap audio calls in `try/catch` or silence errors if files fail to load. The game **must** remain playable without audio.
