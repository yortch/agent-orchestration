const DEFAULT_MAX_DELTA_SECONDS = 0.1;

export function createGameLoop({
  update,
  render,
  maxDeltaSeconds = DEFAULT_MAX_DELTA_SECONDS,
  autoPauseOnHidden = true,
  autoPauseOnBlur = true,
} = {}) {
  if (typeof update !== "function") {
    throw new Error("createGameLoop requires an update(deltaSeconds) function.");
  }

  if (typeof render !== "function") {
    throw new Error("createGameLoop requires a render() function.");
  }

  let running = false;
  let paused = false;
  let pausedByVisibility = false;
  let pausedByBlur = false;
  let frameRequestId = null;
  let lastTimestamp = null;

  function syncPausedState() {
    paused = pausedByVisibility || pausedByBlur;

    if (!paused) {
      lastTimestamp = null;
    }
  }

  function onVisibilityChange() {
    pausedByVisibility = autoPauseOnHidden ? document.hidden : false;
    syncPausedState();
  }

  function onWindowBlur() {
    pausedByBlur = autoPauseOnBlur;
    syncPausedState();
  }

  function onWindowFocus() {
    pausedByBlur = false;
    syncPausedState();
  }

  function frame(now) {
    if (!running) {
      return;
    }

    frameRequestId = window.requestAnimationFrame(frame);

    if (lastTimestamp === null) {
      lastTimestamp = now;
      render({
        deltaSeconds: 0,
        rawDeltaSeconds: 0,
        isDeltaClamped: false,
      });
      return;
    }

    const rawDeltaMilliseconds = now - lastTimestamp;
    lastTimestamp = now;

    if (paused) {
      return;
    }

    const normalizedRawDeltaSeconds = Number.isFinite(rawDeltaMilliseconds)
      ? Math.max(0, rawDeltaMilliseconds / 1000)
      : 0;
    const safeMaxDeltaSeconds = Number.isFinite(maxDeltaSeconds) && maxDeltaSeconds > 0
      ? maxDeltaSeconds
      : DEFAULT_MAX_DELTA_SECONDS;
    const deltaSeconds = Math.min(normalizedRawDeltaSeconds, safeMaxDeltaSeconds);

    update(deltaSeconds);
    render({
      deltaSeconds,
      rawDeltaSeconds: normalizedRawDeltaSeconds,
      isDeltaClamped: normalizedRawDeltaSeconds > deltaSeconds,
    });
  }

  function start() {
    if (running) {
      return;
    }

    running = true;
    pausedByVisibility = autoPauseOnHidden ? document.hidden : false;
    pausedByBlur = autoPauseOnBlur ? !document.hasFocus() : false;
    paused = pausedByVisibility || pausedByBlur;
    lastTimestamp = null;

    if (autoPauseOnHidden) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    if (autoPauseOnBlur) {
      window.addEventListener("blur", onWindowBlur);
      window.addEventListener("focus", onWindowFocus);
    }

    frameRequestId = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (!running) {
      return;
    }

    running = false;

    if (frameRequestId !== null) {
      window.cancelAnimationFrame(frameRequestId);
      frameRequestId = null;
    }

    if (autoPauseOnHidden) {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }

    if (autoPauseOnBlur) {
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("focus", onWindowFocus);
    }
  }

  function setPaused(nextPaused) {
    const shouldPause = Boolean(nextPaused);
    pausedByVisibility = false;
    pausedByBlur = shouldPause;
    syncPausedState();
  }

  function isRunning() {
    return running;
  }

  return {
    start,
    stop,
    setPaused,
    isRunning,
  };
}
