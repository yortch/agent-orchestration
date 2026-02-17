export const GameState = Object.freeze({
  START: "START",
  PLAYING: "PLAYING",
  GAME_OVER: "GAME_OVER",
});

export function consumeMenuConfirm(input) {
  if (!input) {
    return false;
  }

  return input.consumePressed("start") || input.consumePressed("shoot");
}

const ALLOWED_TRANSITIONS = {
  [GameState.START]: [GameState.PLAYING],
  [GameState.PLAYING]: [GameState.GAME_OVER],
  [GameState.GAME_OVER]: [GameState.START],
};

export function createGameStateMachine(initialState = GameState.START, { onGameOver } = {}) {
  if (!Object.values(GameState).includes(initialState)) {
    throw new Error(`Invalid initial game state: ${initialState}`);
  }

  let currentState = initialState;
  const listeners = new Set();

  function getState() {
    return currentState;
  }

  function canTransition(nextState) {
    const allowed = ALLOWED_TRANSITIONS[currentState] || [];
    return allowed.includes(nextState);
  }

  function transitionTo(nextState) {
    if (!Object.values(GameState).includes(nextState)) {
      throw new Error(`Invalid game state transition target: ${nextState}`);
    }

    if (nextState === currentState) {
      return currentState;
    }

    if (!canTransition(nextState)) {
      throw new Error(`Invalid game state transition: ${currentState} -> ${nextState}`);
    }

    const previousState = currentState;
    currentState = nextState;

    if (currentState === GameState.GAME_OVER && previousState !== GameState.GAME_OVER) {
      onGameOver?.(currentState, previousState);
    }

    listeners.forEach((listener) => listener(currentState, previousState));
    return currentState;
  }

  function startPlaying() {
    return transitionTo(GameState.PLAYING);
  }

  function endWithGameOver() {
    return transitionTo(GameState.GAME_OVER);
  }

  function returnToStart() {
    return transitionTo(GameState.START);
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("State listener must be a function.");
    }

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  return {
    getState,
    canTransition,
    transitionTo,
    startPlaying,
    endWithGameOver,
    returnToStart,
    subscribe,
  };
}
