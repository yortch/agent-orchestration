const DEFAULT_LOGICAL_WIDTH = 900;
const DEFAULT_LOGICAL_HEIGHT = 600;

function getDevicePixelRatio() {
  return Math.max(1, window.devicePixelRatio || 1);
}

export function createGameCanvas(
  canvas,
  { logicalWidth = DEFAULT_LOGICAL_WIDTH, logicalHeight = DEFAULT_LOGICAL_HEIGHT } = {},
) {
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Expected a valid HTMLCanvasElement.");
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("2D canvas context is not available in this browser.");
  }

  let dpr = getDevicePixelRatio();

  function applyResolution() {
    dpr = getDevicePixelRatio();

    canvas.width = Math.floor(logicalWidth * dpr);
    canvas.height = Math.floor(logicalHeight * dpr);
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = false;
  }

  function resize() {
    applyResolution();
  }

  applyResolution();

  return {
    canvas,
    context,
    width: logicalWidth,
    height: logicalHeight,
    getDpr: () => dpr,
    resize,
  };
}
