/**
 * audio.js
 * Web Audio API-based sound system with synthesized arcade SFX
 * Provides a singleton AudioContext with master gain control
 */

// Singleton AudioContext (created on first use)
let audioContext = null;
let masterGain = null;

// Master volume level (0.0 to 1.0)
const MASTER_VOLUME = 0.3;

// Track if audio is initialized and resumed
let isInitialized = false;

/**
 * Get or create the singleton AudioContext
 * @returns {AudioContext} The shared audio context
 */
function getAudioContext() {
    if (!audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
            console.warn('⚠️ Web Audio API not supported');
            return null;
        }
        
        audioContext = new AudioContext();
        
        // Create master gain node
        masterGain = audioContext.createGain();
        masterGain.gain.value = MASTER_VOLUME;
        masterGain.connect(audioContext.destination);
        
        console.log('🔊 AudioContext created');
    }
    
    return audioContext;
}

/**
 * Resume the AudioContext after user gesture
 * Required by browsers to prevent auto-playing audio
 */
export function resumeAudioContext() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
            isInitialized = true;
            console.log('🔊 AudioContext resumed - audio ready');
        }).catch(err => {
            console.warn('⚠️ Could not resume audio:', err);
        });
    } else {
        isInitialized = true;
        console.log('🔊 AudioContext ready');
    }
}

/**
 * Check if audio is ready to play
 * @returns {boolean} True if audio context is initialized and running
 */
export function isAudioReady() {
    return isInitialized && audioContext && audioContext.state === 'running';
}

/**
 * Play player shoot sound - Triangle wave with pitch drop "pew"
 * Spec: "High pitched 'Pew' (Triangle wave with rapid pitch drop)"
 */
export function playSfxShoot() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create triangle oscillator for classic arcade "pew" sound
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    
    // Create gain envelope for volume shaping
    const gain = ctx.createGain();
    
    // Pitch: Start high (800Hz) and drop rapidly to low (200Hz)
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
    
    // Volume envelope: Quick attack, moderate decay
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc.start(now);
    osc.stop(now + 0.15);
}

/**
 * Play enemy hit sound - Pleasant "ding" or "pop"
 * Spec: "Pleasant 'Ding' or 'Pop' (Sine wave)"
 */
export function playSfxEnemyHit() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create sine oscillator for smooth, pleasant tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Pitch: Short high-pitched "ding" (1200Hz -> 800Hz)
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    
    // Volume envelope: Very sharp attack and decay for "pop" effect
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc.start(now);
    osc.stop(now + 0.1);
}

/**
 * Play player hit sound - Dissonant "buzz" or "crash"
 * Spec: "Dissonant low 'Buzz' or 'Crash'"
 */
export function playSfxPlayerHit() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create two sawtooth oscillators for harsh, buzzy crash sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Dissonant frequencies that clash (low range for "crash")
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    
    osc2.frequency.setValueAtTime(135, now); // Slightly detuned for dissonance
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.3);
    
    // Volume envelope: Sharp attack, sustained decay
    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    // Connect both oscillators to same gain
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
}

/**
 * Play enemy step sound - Low rhythmic heartbeat "thrum"
 * Spec: "Low rhythmic thrum (simulating a heartbeat) on every enemy step"
 */
export function playSfxEnemyStep() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create sine oscillator for deep, thumping heartbeat
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Deep bass frequency for heartbeat "thump" (60Hz -> 30Hz)
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
    
    // Volume envelope: Quick thump with sharp decay
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc.start(now);
    osc.stop(now + 0.15);
}

/**
 * Play bonus hit sound - Magical "reward" chime
 * Valentine-themed sparkle/bell sound for bonus enemy hits
 */
export function playSfxBonusHit() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create two oscillators for a magical bell/chime sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc3.type = 'sine';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Magical ascending arpeggio (C-E-G major chord ascending)
    osc1.frequency.setValueAtTime(523, now); // C5
    osc2.frequency.setValueAtTime(659, now); // E5
    osc3.frequency.setValueAtTime(784, now); // G5
    
    // All sweep upward slightly for sparkle effect
    osc1.frequency.exponentialRampToValueAtTime(1046, now + 0.3); // C6
    osc2.frequency.exponentialRampToValueAtTime(1318, now + 0.3); // E6
    osc3.frequency.exponentialRampToValueAtTime(1568, now + 0.3); // G6
    
    // Volume envelope: Quick bright attack, gentle decay
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    // Connect all oscillators to same gain
    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);
    gain.connect(masterGain);
    
    // Play sound with slight offset for sparkle effect
    osc1.start(now);
    osc2.start(now + 0.02);
    osc3.start(now + 0.04);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.42);
    osc3.stop(now + 0.44);
}

/**
 * Play enemy shoot sound - Lower "broken heart" sound
 * Spec: "Lower broken heart sound - dissonant downward sweep"
 */
export function playSfxEnemyShoot() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create square wave for harsh broken heart sound
    const osc = ctx.createOscillator();
    osc.type = 'square';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Lower pitch with downward sweep (400Hz -> 150Hz)
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
    
    // Volume envelope: Sharp attack, decay
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc.start(now);
    osc.stop(now + 0.2);
}

/**
 * Play shield hit sound - Deflection sound
 * Spec: "Soft deflection 'boing' or 'tink'"
 */
export function playSfxShieldHit() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create sine oscillator for soft tink sound
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Mid-high pitch with slight bend (700Hz -> 600Hz)
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    
    // Volume envelope: Very quick decay for "tink" effect
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play sound
    osc.start(now);
    osc.stop(now + 0.08);
}

/**
 * Play level complete sound - Victory jingle
 * Spec: "Romantic ascending melody with multiple notes"
 */
export function playSfxLevelComplete() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create sine oscillator for sweet melodic tones
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    
    // Create gain envelope
    const gain = ctx.createGain();
    
    // Melodic ascending arpeggio: C -> E -> G -> C (romantic major chord)
    // 523Hz (C5) -> 659Hz (E5) -> 784Hz (G5) -> 1047Hz (C6)
    const notes = [523, 659, 784, 1047];
    const noteDuration = 0.15;
    
    notes.forEach((freq, index) => {
        const startTime = now + index * noteDuration;
        osc.frequency.setValueAtTime(freq, startTime);
        
        // Volume envelope for each note
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
        gain.gain.setValueAtTime(0.4, startTime + 0.001); // Reset for next note
    });
    
    // Connect: oscillator -> gain -> master -> destination
    osc.connect(gain);
    gain.connect(masterGain);
    
    // Play full sequence
    osc.start(now);
    osc.stop(now + notes.length * noteDuration);
}

/**
 * Play game over sound - Sad/dramatic descending sound
 * Spec: "Dramatic descending minor melody"
 */
export function playSfxGameOver() {
    if (!isAudioReady()) return;
    
    const ctx = audioContext;
    const now = ctx.currentTime;
    
    // Create two oscillators for richer sad sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    // Create gain nodes
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const masterGainNode = ctx.createGain();
    
    // Descending minor melody: A -> F -> D -> A (one octave down)
    // Creates a sad, dramatic effect
    const notes = [440, 349, 293, 220];
    const noteDuration = 0.25;
    
    notes.forEach((freq, index) => {
        const startTime = now + index * noteDuration;
        osc1.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 1.01, startTime); // Slight detune for richness
        
        // Volume envelope for each note
        gain1.gain.setValueAtTime(0.3, startTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
        gain1.gain.setValueAtTime(0.3, startTime + 0.001);
        
        gain2.gain.setValueAtTime(0.2, startTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);
        gain2.gain.setValueAtTime(0.2, startTime + 0.001);
    });
    
    // Connect: oscillators -> individual gains -> master gain -> audio master
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(masterGainNode);
    gain2.connect(masterGainNode);
    masterGainNode.connect(masterGain);
    
    // Play full sequence
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + notes.length * noteDuration);
    osc2.stop(now + notes.length * noteDuration);
}

// Background music state
let backgroundMusicOscillators = null;
let backgroundMusicGain = null;
let isMusicPlaying = false;

/**
 * Start background music - Subtle romantic melody loop
 * Spec: "Optional, subtle romantic melody using oscillators"
 */
export function startBackgroundMusic() {
    if (!isAudioReady() || isMusicPlaying) return;
    
    const ctx = audioContext;
    
    // Create gain node for music with lower volume
    backgroundMusicGain = ctx.createGain();
    backgroundMusicGain.gain.value = 0.08; // Very subtle
    backgroundMusicGain.connect(masterGain);
    
    // Create two oscillators for harmony
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    // Romantic frequencies - soft major chord (C and E)
    osc1.frequency.value = 261.63; // C4
    osc2.frequency.value = 329.63; // E4
    
    // Connect oscillators to music gain
    osc1.connect(backgroundMusicGain);
    osc2.connect(backgroundMusicGain);
    
    // Start playing
    osc1.start();
    osc2.start();
    
    backgroundMusicOscillators = { osc1, osc2 };
    isMusicPlaying = true;
    
    console.log('🎵 Background music started');
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {
    if (!isMusicPlaying || !backgroundMusicOscillators) return;
    
    try {
        backgroundMusicOscillators.osc1.stop();
        backgroundMusicOscillators.osc2.stop();
    } catch (e) {
        // Oscillators may already be stopped
    }
    
    backgroundMusicOscillators = null;
    backgroundMusicGain = null;
    isMusicPlaying = false;
    
    console.log('🎵 Background music stopped');
}

/**
 * Check if background music is playing
 * @returns {boolean} True if music is playing
 */
export function isMusicActive() {
    return isMusicPlaying;
}

// Mute state
let isMuted = false;
let volumeBeforeMute = MASTER_VOLUME;

/**
 * Toggle mute on/off
 * @returns {boolean} New mute state
 */
export function toggleMute() {
    isMuted = !isMuted;
    
    if (isMuted) {
        // Store current volume and mute
        volumeBeforeMute = getMasterVolume();
        setMasterVolume(0);
        console.log('🔇 Audio muted');
    } else {
        // Restore previous volume
        setMasterVolume(volumeBeforeMute);
        console.log('🔊 Audio unmuted');
    }
    
    // Save mute state to localStorage
    saveAudioSettings();
    
    return isMuted;
}

/**
 * Get current mute state
 * @returns {boolean} True if audio is muted
 */
export function isMutedState() {
    return isMuted;
}

/**
 * Set master volume level
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export function setMasterVolume(volume) {
    if (masterGain) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        masterGain.gain.value = clampedVolume;
        
        // Update volumeBeforeMute if not currently muted
        if (!isMuted) {
            volumeBeforeMute = clampedVolume;
        }
        
        // Save to localStorage
        saveAudioSettings();
    }
}

/**
 * Get current master volume
 * @returns {number} Current volume level (0.0 to 1.0)
 */
export function getMasterVolume() {
    return masterGain ? masterGain.gain.value : MASTER_VOLUME;
}

/**
 * Initialize audio system - Load settings from localStorage
 */
export function initAudio() {
    getAudioContext(); // Ensure context is created
    loadAudioSettings();
    console.log('🎵 Audio system initialized');
}

/**
 * Save audio settings to localStorage
 */
function saveAudioSettings() {
    try {
        const settings = {
            volume: volumeBeforeMute,
            muted: isMuted
        };
        localStorage.setItem('loveInvadersAudio', JSON.stringify(settings));
    } catch (e) {
        console.warn('⚠️ Could not save audio settings:', e);
    }
}

/**
 * Load audio settings from localStorage
 */
function loadAudioSettings() {
    try {
        const saved = localStorage.getItem('loveInvadersAudio');
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Restore volume
            if (typeof settings.volume === 'number') {
                volumeBeforeMute = settings.volume;
                if (!settings.muted) {
                    setMasterVolume(settings.volume);
                }
            }
            
            // Restore mute state
            if (settings.muted) {
                isMuted = true;
                setMasterVolume(0);
            }
            
            console.log('🔊 Audio settings loaded from storage');
        }
    } catch (e) {
        console.warn('⚠️ Could not load audio settings:', e);
    }
}
