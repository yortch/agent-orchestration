export function createLivesManager({ startingLives = 3, invulnerabilitySeconds = 1.2 } = {}) {
  let lives = startingLives;
  let invulnerabilityRemaining = 0;

  function reset() {
    lives = startingLives;
    invulnerabilityRemaining = 0;
  }

  function update(deltaSeconds) {
    invulnerabilityRemaining = Math.max(0, invulnerabilityRemaining - deltaSeconds);
  }

  function isInvulnerable() {
    return invulnerabilityRemaining > 0;
  }

  function getLives() {
    return lives;
  }

  function registerHit() {
    if (lives <= 0) {
      return {
        lostLife: false,
        gameOver: true,
        livesRemaining: 0,
        ignored: true,
      };
    }

    if (isInvulnerable()) {
      return {
        lostLife: false,
        gameOver: false,
        livesRemaining: lives,
        ignored: true,
      };
    }

    lives -= 1;

    if (lives > 0) {
      invulnerabilityRemaining = invulnerabilitySeconds;
    }

    return {
      lostLife: true,
      gameOver: lives <= 0,
      livesRemaining: lives,
      ignored: false,
    };
  }

  return {
    reset,
    update,
    isInvulnerable,
    getLives,
    registerHit,
  };
}
