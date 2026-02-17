const ACTION_KEY_CODES = {
  left: ["ArrowLeft"],
  right: ["ArrowRight"],
  shoot: ["Space"],
  start: ["Enter", "NumpadEnter", "Space"],
  mute: ["KeyM"],
  debug: ["KeyD"],
};

function createInitialState() {
  return {
    left: false,
    right: false,
    shoot: false,
    start: false,
    mute: false,
    debug: false,
  };
}

export function createInputManager({ target = window } = {}) {
  const down = createInitialState();
  const pressed = createInitialState();

  function findActionForCode(code) {
    return Object.keys(ACTION_KEY_CODES).find((action) => ACTION_KEY_CODES[action].includes(code));
  }

  function setActionState(action, isDown) {
    if (!action) {
      return;
    }

    if (isDown && !down[action]) {
      pressed[action] = true;
    }

    down[action] = isDown;
  }

  function handleKeyDown(event) {
    if (event.isComposing) {
      return;
    }

    const action = findActionForCode(event.code);

    if (!action) {
      return;
    }

    if (event.repeat) {
      event.preventDefault();
      return;
    }

    setActionState(action, true);
    event.preventDefault();
  }

  function handleKeyUp(event) {
    if (event.isComposing) {
      return;
    }

    const action = findActionForCode(event.code);

    if (!action) {
      return;
    }

    setActionState(action, false);
    event.preventDefault();
  }

  function reset() {
    Object.keys(down).forEach((action) => {
      down[action] = false;
      pressed[action] = false;
    });
  }

  function consumePressed(action) {
    const wasPressed = Boolean(pressed[action]);
    pressed[action] = false;
    return wasPressed;
  }

  function isDown(action) {
    return Boolean(down[action]);
  }

  function getSnapshot() {
    return {
      down: { ...down },
      pressed: { ...pressed },
    };
  }

  function handleBlur() {
    reset();
  }

  function handleFocus() {
    reset();
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      reset();
    }
  }

  function handlePageHide() {
    reset();
  }

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("pagehide", handlePageHide);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  function destroy() {
    target.removeEventListener("keydown", handleKeyDown);
    target.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("pagehide", handlePageHide);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    reset();
  }

  return {
    isDown,
    consumePressed,
    getSnapshot,
    reset,
    destroy,
  };
}
