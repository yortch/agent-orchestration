# Coordinate System Implementation

## Overview
This document describes the dual coordinate system implemented in Love Invaders to support HiDPI displays and consistent gameplay across all devices.

## Coordinate Systems

### 1. Logical Coordinates (800×600)
- **Purpose**: All game logic, rendering, and collision detection
- **Access**: `getGameDimensions()` from `canvas/resize.js`
- **Consistency**: Always returns `{width: 800, height: 600}` regardless of display
- **Usage**: Use these coordinates for ALL game code

### 2. Physical/Backing Buffer Coordinates
- **Purpose**: Internal browser rendering for crisp HiDPI displays
- **Size**: Scaled by `devicePixelRatio` (e.g., 1600×1200 on 2x displays)
- **Access**: `canvas.width` and `canvas.height`
- **Usage**: ⚠️ **NEVER use in game logic** - only for internal canvas setup

## Implementation Details

### Transform Matrix
`ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`
- Resets any previous transformations (non-cumulative)
- Maps logical coordinates → physical pixels automatically
- Drawing at logical (400, 300) renders at physical (800, 600) on 2x displays

### Key Benefits
1. **HiDPI Support**: Crisp rendering on Retina/4K displays
2. **Consistency**: Same gameplay experience regardless of screen resolution
3. **Simplicity**: Game code uses simple 800×600 coordinates
4. **No Cumulative Scaling**: Using `setTransform` instead of `scale` prevents scaling bugs

## Usage Examples

### ✅ Correct Usage
```javascript
import { getGameDimensions } from './canvas/resize.js';

const dimensions = getGameDimensions();

// Bounds checking
if (player.x < 0 || player.x > dimensions.width) { }

// Rendering
ctx.fillRect(0, 0, dimensions.width, dimensions.height);

// Text centering
ctx.fillText('Game Over', dimensions.width / 2, dimensions.height / 2);
```

### ❌ Incorrect Usage (DO NOT DO THIS)
```javascript
// DON'T: Using physical canvas dimensions
if (player.x > canvas.width) { }  // Wrong! Uses backing buffer size

// DON'T: Using ctx.scale (causes cumulative scaling)
ctx.scale(dpr, dpr);  // Wrong! Accumulates on each resize

// DON'T: Checking backing buffer directly
if (canvas.width === 800) { }  // Wrong! May be 1600 on 2x display
```

## Files Modified

### src/canvas/resize.js
- **Change**: `ctx.scale(dpr, dpr)` → `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)`
- **Reason**: Prevent cumulative scaling on window resize
- **Added**: Comprehensive documentation explaining coordinate systems

### src/main.js
- **Changes**: 
  - Import `getGameDimensions`
  - Replace all `canvas.width/height` with `dimensions.width/height`
  - Pass logical dimensions to all game systems
- **Functions Updated**:
  - `init()`: Pass logical width to `initEnemies()`
  - `updateGameEntities()`: Pass logical width to `updatePlayer()` and `updateEnemies()`
  - `render()`: Pass logical dimensions to `drawBackground()`
  - `renderStartScreen()`: Use logical dimensions for text positioning
  - `renderUI()`: Use logical dimensions for UI layout
  - `renderPauseOverlay()`: Use logical dimensions for overlay
  - `renderGameOverScreen()`: Use logical dimensions for text positioning

### src/render/draw.js
- **Change**: `drawBackground()` signature updated
- **Before**: `drawBackground(ctx, canvas, time)`
- **After**: `drawBackground(ctx, gameWidth, gameHeight, time)`
- **Reason**: Use logical dimensions instead of canvas element

### src/game/player.js
- **Documentation Update**: Clarified `canvasWidth` parameter refers to logical width
- **No Code Changes**: Already uses `getGameDimensions()` internally

### src/game/enemies.js
- **Documentation Updates**: Clarified `canvasWidth` parameter refers to logical width
- **No Code Changes**: Receives logical width from caller

## Testing

### Manual Testing Checklist
- [ ] Game renders correctly on 1x displays (1920×1080)
- [ ] Game renders crisply on 2x displays (MacBook Retina)
- [ ] Game renders crisply on 3x displays (4K/5K monitors)
- [ ] Resizing window doesn't cause visual artifacts
- [ ] Player movement respects logical boundaries
- [ ] Enemy formation stays within logical bounds
- [ ] Text and UI elements are properly positioned
- [ ] No cumulative scaling when resizing multiple times

### Debug Verification
Check console output on resize:
```
📐 Canvas resized: 800x600 logical pixels (1600x1200 actual pixels, DPR: 2)
```
- Logical pixels should always be 800×600
- Actual pixels should be logical × DPR
- DPR should match system's devicePixelRatio

## Future Considerations

### When Adding New Features
1. Always use `getGameDimensions()` for bounds/positioning
2. Never reference `canvas.width` or `canvas.height` in game logic
3. All coordinates in entity properties should be logical
4. Collision detection should use logical coordinates

### Performance Notes
- The transform matrix is very efficient (GPU-accelerated)
- No performance penalty compared to manual scaling
- Actually faster than repeated `ctx.scale()` calls

## Related Documentation
- See comprehensive documentation in [src/canvas/resize.js](../src/canvas/resize.js)
- Theme guidelines: [docs/theme.md](theme.md)
- Game specification: [docs/spec.md](spec.md)
