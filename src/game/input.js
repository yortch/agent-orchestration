/**
 * input.js
 * Handles keyboard input for the game
 * Tracks key states, edge-triggered actions, and prevents stuck keys
 */

import { getState, setState, togglePause, onStateChange } from './state.js';

// Input state object - tracks which keys are currently pressed
const input = {
    left: false,
    right: false,
    shoot: false,
    pause: false,
    restart: false,
    mute: false
};

// Previous frame input state for edge detection
const previousInput = {
    pause: false,
    mute: false
};

// Key mappings
const KEY_MAPPINGS = {
    // Move left
    'ArrowLeft': 'left',
    'KeyA': 'left',
    
    // Move right
    'ArrowRight': 'right',
    'KeyD': 'right',
    
    // Shoot
    'Space': 'shoot',
    'KeyW': 'shoot',
    'ArrowUp': 'shoot',
    
    // Pause
    'KeyP': 'pause',
    
    // Mute
    'KeyM': 'mute',
    
    // Restart
    'Enter': 'restart'
};

// Keys that should have their default behavior prevented
const KEYS_TO_PREVENT = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

/**
 * Setup input handlers
 */
export function setupInput() {
    // Handle key down
    window.addEventListener('keydown', handleKeyDown);
    
    // Handle key up
    window.addEventListener('keyup', handleKeyUp);
    
    // Handle window blur - clear all inputs to prevent stuck keys
    window.addEventListener('blur', handleWindowBlur);
    
    // Register state change listener to reset inputs
    onStateChange(handleStateChange);
    
    console.log('⌨️ Input handlers registered');
}

/**
 * Handle key down event
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyDown(event) {
    const action = KEY_MAPPINGS[event.code];
    
    // Prevent default behavior for game keys
    if (KEYS_TO_PREVENT.includes(event.code)) {
        event.preventDefault();
    }
    
    if (!action) return;
    
    const currentState = getState();
    
    // Handle state-specific actions
    if (action === 'shoot' && currentState === 'start') {
        // Start the game when space is pressed on start screen
        setState('playing');
        return;
    }
    
    if (action === 'pause') {
        // Edge-triggered pause - only toggle on press, not while held
        input.pause = true;
        return;
    }
    
    if (action === 'mute') {
        // Edge-triggered mute - only toggle on press, not while held
        input.mute = true;
        return;
    }
    
    if (action === 'restart' && currentState === 'gameover') {
        // Restart game from game over screen
        setState('start');
        return;
    }
    
    // Set input state
    input[action] = true;
}

/**
 * Handle key up event
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyUp(event) {
    const action = KEY_MAPPINGS[event.code];
    
    if (!action) return;
    
    // Clear input state
    input[action] = false;
}

/**
 * Get current input state
 * @returns {Object} Input state
 */
export function getInput() {
    return input;
}

/**
 * Check if a specific action is pressed
 * @param {string} action - Action name ('left', 'right', 'shoot', etc.)
 * @returns {boolean} True if action is pressed
 */
export function isPressed(action) {
    return input[action] || false;
}

/**
 * Reset all input states to false
 * Useful when changing game states
 */
export function resetInput() {
    for (const key in input) {
        input[key] = false;
    }
    // Reset edge detection state
    previousInput.pause = false;
    previousInput.mute = false;
}

/**
 * Update input state each frame (handles edge detection)
 * Call this at the end of each update cycle
 */
export function updateInput() {
    const currentState = getState();
    
    // Handle edge-triggered pause
    if (input.pause && !previousInput.pause) {
        if (currentState === 'playing' || currentState === 'paused') {
            togglePause();
        }
    }
    
    // Handle edge-triggered mute (works in any state)
    if (input.mute && !previousInput.mute) {
        // Import and call toggleMute from audio.js
        import('../audio/audio.js').then(audio => {
            const wasMuted = audio.toggleMute();
            console.log(`🔊 Audio ${wasMuted ? 'muted' : 'unmuted'}`);
        });
    }
    
    // Update previous state for next frame
    previousInput.pause = input.pause;
    previousInput.mute = input.mute;
}

/**
 * Handle window blur event - clear all inputs to prevent stuck keys
 */
function handleWindowBlur() {
    console.log('⚠️ Window lost focus - clearing inputs');
    resetInput();
}

/**
 * Handle state changes - reset inputs on major transitions
 * @param {string} previousState - Previous state
 * @param {string} newState - New state
 */
function handleStateChange(previousState, newState) {
    // Reset inputs on major state transitions
    const majorTransitions = [
        ['start', 'playing'],
        ['playing', 'gameover'],
        ['gameover', 'start'],
        ['levelclear', 'playing']
    ];
    
    const isTransition = majorTransitions.some(
        ([from, to]) => previousState === from && newState === to
    );
    
    if (isTransition) {
        console.log('🔄 Resetting inputs for state transition');
        resetInput();
    }
}
