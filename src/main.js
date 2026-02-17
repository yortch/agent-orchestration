import { createGameCanvas } from "./engine/canvas.js";
import { createGameLoop } from "./engine/loop.js";
import { createInputManager } from "./engine/input.js";
import { consumeMenuConfirm, createGameStateMachine, GameState } from "./game/state.js";
import { createWorld } from "./game/world.js";
import { createRenderer } from "./render/render.js";
import { createAudioManager } from "./audio/audio.js";
import { createDebugOverlay } from "./dev/debug.js";

const canvasElement = document.getElementById("game-canvas");

if (!(canvasElement instanceof HTMLCanvasElement)) {
  throw new Error("Expected #game-canvas to be an HTMLCanvasElement.");
}

const gameCanvas = createGameCanvas(canvasElement, {
  logicalWidth: 900,
  logicalHeight: 600,
});
const context = gameCanvas.context;
const input = createInputManager();
const audio = createAudioManager({
  initialVolume: 0.8,
});
const gameState = createGameStateMachine(GameState.START, {
  onGameOver: () => {
    audio.playGameOver();
  },
});
const world = createWorld({
  width: gameCanvas.width,
  height: gameCanvas.height,
  input,
  gameState,
  audio,
});
const debugOverlay = createDebugOverlay({
  world,
  gameState,
  getDpr: gameCanvas.getDpr,
});
const renderer = createRenderer({
  context,
  width: gameCanvas.width,
  height: gameCanvas.height,
  world,
  gameState,
  debugOverlay,
});

function resetGameData() {
  world.reset();
}

function update(deltaSeconds) {
  if (input.consumePressed("debug")) {
    debugOverlay.toggle();
  }

  if (input.consumePressed("mute")) {
    audio.toggleMute();
  }

  const currentState = gameState.getState();

  if (currentState === GameState.START) {
    if (consumeMenuConfirm(input)) {
      audio.unlock();
      gameState.startPlaying();
    }
    return;
  }

  if (currentState === GameState.PLAYING) {
    world.update(deltaSeconds);
    return;
  }

  if (currentState === GameState.GAME_OVER && consumeMenuConfirm(input)) {
    gameState.returnToStart();
  }
}

function render(frameInfo) {
  renderer.render(frameInfo);
}

gameState.subscribe((nextState) => {
  if (nextState === GameState.START) {
    resetGameData();
  }
});

window.addEventListener("resize", () => {
  gameCanvas.resize();
  renderer.resize(gameCanvas.width, gameCanvas.height);
});

const loop = createGameLoop({
  update,
  render,
  maxDeltaSeconds: 0.1,
  autoPauseOnHidden: true,
});

resetGameData();
loop.start();

window.addEventListener("beforeunload", () => {
  loop.stop();
  input.destroy();
});
