# Audio Assets

This directory is reserved for audio files, though the game currently uses Web Audio API for procedural sound synthesis.

## Current Implementation

All game sounds are generated in real-time using oscillators and envelopes:
- **Player Shoot**: High-pitched "pew" sound (triangle wave with rapid pitch drop)
- **Enemy Hit**: Pleasant "ding" sound (sine wave with envelope)
- **Player Hit**: Dissonant "buzz" sound (sawtooth wave)
- **Heartbeat**: Low rhythmic thrum that pulses with enemy movement
- **Bonus Spawn**: Rising tone sequence
- **Bonus Hit**: Triumphant chime

## Adding Custom Audio

If you wish to use audio files instead of synthesized sounds:
1. Place `.mp3`, `.ogg`, or `.wav` files in this directory
2. Modify `src/audio/audio.js` to load and play these files
3. Consider fallback to synthesis if files fail to load
