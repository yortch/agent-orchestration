# Image Assets

This directory is reserved for image files and sprite sheets, though the game currently uses Canvas API for procedural rendering.

## Current Implementation

All game graphics are drawn procedurally using HTML5 Canvas drawing commands:
- **Hearts**: Rendered using bezier curves and arcs
- **Player (Cupid's Cloud)**: Drawn with circles and gradients
- **Arrows**: Simple triangles and rectangles
- **Shields (Love Letters)**: Composite shapes with envelope design
- **Particles**: Small geometric shapes with animated properties

## Adding Custom Graphics

If you wish to use sprite sheets or images:
1. Place `.png` or `.svg` files in this directory
2. Modify `src/render/sprites.js` to load and cache images
3. Update drawing functions in `src/render/draw.js` to use images instead of procedural shapes
4. Maintain fallback to procedural rendering if images fail to load
