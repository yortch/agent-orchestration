/**
 * Audio Manager for Valentine's Space Invaders
 * Generates all sounds programmatically using Web Audio API — no files needed
 */

const audioManager = (() => {
  let masterVolume = config.audio.volume || 0.5;
  let audioCtx = null;
  let audioEnabled = false;

  /**
   * Lazily create or resume the AudioContext (must happen after user gesture)
   */
  function ensureContext() {
    if (audioCtx && audioCtx.state === 'running') return true;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      audioEnabled = true;
      return true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
      audioEnabled = false;
      return false;
    }
  }

  // ── Synth helpers ──────────────────────────────────────────────

  function playTone(freq, duration, type, vol, ramp) {
    if (!ensureContext()) return;
    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(vol * masterVolume, now);
    if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playSweep(startFreq, endFreq, duration, type, vol) {
    if (!ensureContext()) return;
    const now = audioCtx.currentTime;
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(vol * masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playNoise(duration, vol) {
    if (!ensureContext()) return;
    const now = audioCtx.currentTime;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(vol * masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(now);
    source.stop(now + duration);
  }

  // ── Public sound effects ───────────────────────────────────────

  /** Short bright pew — player fires a heart bullet */
  function playShoot() {
    playSweep(880, 1760, 0.08, 'square', 0.15);
  }

  /** Soft thud — player takes a hit */
  function playHit() {
    playSweep(300, 100, 0.2, 'sawtooth', 0.25);
    playNoise(0.15, 0.12);
  }

  /** Bright pop — enemy destroyed */
  function playEnemyDestroyed() {
    playSweep(600, 1200, 0.1, 'square', 0.18);
    playTone(1200, 0.08, 'sine', 0.12, true);
  }

  /** Descending wah — game over */
  function playGameOver() {
    const now = audioCtx ? audioCtx.currentTime : 0;
    playSweep(600, 100, 0.6, 'sawtooth', 0.3);
    setTimeout(() => playSweep(400, 80, 0.5, 'square', 0.2), 300);
    setTimeout(() => playTone(80, 0.4, 'triangle', 0.25, true), 600);
  }

  /** No-op stubs for background music (no file needed) */
  function enableBackgroundMusic() {}

  function setVolume(volume) {
    masterVolume = Math.max(0, Math.min(1, volume));
  }

  function getVolume() {
    return masterVolume;
  }

  function stopAll() {
    if (audioCtx) {
      audioCtx.close().catch(() => {});
      audioCtx = null;
      audioEnabled = false;
    }
  }

  function isAudioEnabled() {
    return audioEnabled;
  }

  function init() {
    // Context is created lazily on first user interaction
    // Attempt an early unlock via common gestures
    const unlock = () => {
      ensureContext();
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
  }

  return {
    init,
    playSound: () => {},
    enableBackgroundMusic,
    setVolume,
    getVolume,
    stopAll,
    playShoot,
    playHit,
    playEnemyDestroyed,
    playGameOver,
    isAudioEnabled,
  };
})();
