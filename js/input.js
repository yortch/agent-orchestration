/**
 * InputHandler - Manages keyboard input for the game
 * Tracks arrow keys and spacebar pressed state
 */
const InputHandler = (() => {
  // Private state
  const state = {
    ArrowLeft: false,
    ArrowRight: false,
    Space: false,
    p: false,
    r: false
  };

  // Private handler functions
  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft') {
      state.ArrowLeft = true;
    } else if (key === 'arrowright') {
      state.ArrowRight = true;
    } else if (key === ' ') {
      state.Space = true;
      event.preventDefault(); // Prevent page scroll
    } else if (key === 'p') {
      state.p = true;
    } else if (key === 'r') {
      state.r = true;
    }
  };

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft') {
      state.ArrowLeft = false;
    } else if (key === 'arrowright') {
      state.ArrowRight = false;
    } else if (key === ' ') {
      state.Space = false;
    } else if (key === 'p') {
      state.p = false;
    } else if (key === 'r') {
      state.r = false;
    }
  };

  // Public methods
  return {
    /**
     * Initialize input handler - attach event listeners
     */
    setup() {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    },

    /**
     * Check if left arrow key is pressed
     * @returns {boolean} True if ArrowLeft is pressed
     */
    isMovingLeft() {
      return state.ArrowLeft;
    },

    /**
     * Check if right arrow key is pressed
     * @returns {boolean} True if ArrowRight is pressed
     */
    isMovingRight() {
      return state.ArrowRight;
    },

    /**
     * Check if spacebar is pressed
     * @returns {boolean} True if Space is pressed
     */
    isSpacePressed() {
      return state.Space;
    },

    /**
     * Check if 'P' key is pressed
     * @returns {boolean} True if P is pressed
     */
    isPPressed() {
      return state.p;
    },

    /**
     * Check if 'R' key is pressed
     * @returns {boolean} True if R is pressed
     */
    isRPressed() {
      return state.r;
    },

    /**
     * Remove all event listeners - call on game end
     */
    cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  };
})();
