/**
 * state.js
 * Game state machine: 'start' → 'playing' → 'paused'/'levelclear'/'gameover'
 * Handles state transitions, hooks, and audio unlock on first user interaction
 */

import { resumeAudioContext, playSfxLevelComplete, playSfxGameOver } from '../audio/audio.js';

// Valid game states
const VALID_STATES = ['start', 'playing', 'paused', 'levelclear', 'gameover'];

// Current game state
let currentState = 'start';

// Audio context (will be unlocked on first user interaction)
let audioUnlocked = false;

// State change listeners
const stateChangeListeners = [];

// Level clear timer
let levelClearTimer = 0;
const LEVEL_CLEAR_DURATION = 3.0; // seconds

// Game over reason tracking
let gameOverReason = null; // 'lives', 'invasion', or null

/**
 * Get the current game state
 * @returns {string} Current state
 */
export function getState() {
    return currentState;
}

/**
 * Set a new game state
 * @param {string} newState - The new state to transition to
 * @param {string} reason - Optional reason for state change (for gameover: 'lives' or 'invasion')
 */
export function setState(newState, reason = null) {
    if (!VALID_STATES.includes(newState)) {
        console.error(`❌ Invalid state: ${newState}`);
        return;
    }
    
    const previousState = currentState;
    if (previousState === newState) return; // No change
    
    // Exit previous state
    onStateExit(previousState, newState);
    
    currentState = newState;
    
    // Store game over reason if provided
    if (newState === 'gameover' && reason) {
        gameOverReason = reason;
    }
    
    console.log(`🎮 State transition: ${previousState} → ${newState}${reason ? ` (${reason})` : ''}`);
    
    // Enter new state
    onStateEnter(newState, previousState);
    
    // Notify all listeners
    notifyStateChange(previousState, newState);
}

/**
 * Called when exiting a state
 * @param {string} oldState - The state being exited
 * @param {string} newState - The state being entered
 */
function onStateExit(oldState, newState) {
    switch (oldState) {
        case 'playing':
            // Clean up playing state
            break;
        case 'paused':
            // Resume from pause
            break;
        case 'levelclear':
            // Clear level clear timer
            levelClearTimer = 0;
            break;
    }
}

/**
 * Called when entering a new state
 * @param {string} newState - The new state being entered
 * @param {string} previousState - The previous state
 */
function onStateEnter(newState, previousState) {
    switch (newState) {
        case 'start':
            // Reset game when returning to start screen
            gameOverReason = null; // Clear game over reason
            break;
        case 'playing':
            // Unlock audio on first play interaction
            if (!audioUnlocked) {
                unlockAudio();
            }
            break;
        case 'paused':
            // Pause audio (if implemented)
            break;
        case 'levelclear':
            // Start level clear timer
            levelClearTimer = 0;
            // Play victory jingle
            playSfxLevelComplete();
            console.log('🎉 Level cleared!');
            break;
        case 'gameover':
            // Stop all sounds (if implemented)
            // Play game over sound
            playSfxGameOver();
            console.log('💔 Game over!');
            break;
    }
}

/**
 * Unlock Web Audio API on first user interaction
 * Required by browsers to prevent auto-playing audio
 */
function unlockAudio() {
    if (audioUnlocked) return;
    
    // Resume the shared AudioContext from audio.js
    resumeAudioContext();
    audioUnlocked = true;
}

/**
 * Check if audio has been unlocked
 * @returns {boolean} True if audio is unlocked
 */
export function isAudioUnlocked() {
    return audioUnlocked;
}

/**
 * Toggle pause state
 */
export function togglePause() {
    if (currentState === 'playing') {
        setState('paused');
    } else if (currentState === 'paused') {
        setState('playing');
    }
}

/**
 * Update level clear state (called each frame)
 * @param {number} deltaTime - Time elapsed since last frame
 * @returns {boolean} True if level clear duration has elapsed
 */
export function updateLevelClear(deltaTime) {
    if (currentState !== 'levelclear') return false;
    
    levelClearTimer += deltaTime;
    return levelClearTimer >= LEVEL_CLEAR_DURATION;
}

/**
 * Get the game over reason
 * @returns {string|null} Reason for game over ('lives', 'invasion', or null)
 */
export function getGameOverReason() {
    return gameOverReason;
}

/**
 * Register a state change listener
 * @param {Function} callback - Called with (previousState, newState)
 */
export function onStateChange(callback) {
    stateChangeListeners.push(callback);
}

/**
 * Notify all listeners of state change
 * @param {string} previousState - Previous state
 * @param {string} newState - New state
 */
function notifyStateChange(previousState, newState) {
    stateChangeListeners.forEach(listener => {
        try {
            listener(previousState, newState);
        } catch (err) {
            console.error('Error in state change listener:', err);
        }
    });
}
