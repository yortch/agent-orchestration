# Assets Directory

This directory is provided for optional asset storage, though the game currently uses procedural generation for all visuals and sounds.

## Structure

- **audio/** - Optional directory for audio files (currently unused - game uses Web Audio API synthesis)
- **images/** - Optional directory for sprite sheets or images (currently unused - game uses Canvas API procedural rendering)

## Notes

Love Invaders is designed to run without external assets:
- All graphics are drawn procedurally using HTML5 Canvas API
- All sounds are synthesized in real-time using Web Audio API
- This makes the game lightweight and eliminates asset loading delays

If you wish to extend the game with custom assets, you can place them here and modify the rendering/audio modules accordingly.
