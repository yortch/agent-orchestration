function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createAudioManager({ initialVolume = 0.7 } = {}) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const state = {
    context: null,
    masterGain: null,
    unlocked: false,
    muted: false,
    volume: clamp(initialVolume, 0, 1),
  };

  function ensureContext() {
    if (!AudioContextClass) {
      return null;
    }

    if (state.context) {
      return state.context;
    }

    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = state.volume;
    masterGain.connect(context.destination);

    state.context = context;
    state.masterGain = masterGain;

    return context;
  }

  function applyVolume() {
    if (!state.context || !state.masterGain) {
      return;
    }

    const now = state.context.currentTime;
    const target = state.muted ? 0 : state.volume;
    state.masterGain.gain.cancelScheduledValues(now);
    state.masterGain.gain.setTargetAtTime(target, now, 0.01);
  }

  async function unlock() {
    const context = ensureContext();

    if (!context) {
      return false;
    }

    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch {
        return false;
      }
    }

    state.unlocked = context.state === "running";
    applyVolume();
    return state.unlocked;
  }

  function canPlay() {
    return Boolean(state.context && state.masterGain && state.unlocked && !state.muted);
  }

  function scheduleTone({
    when,
    frequency,
    duration,
    waveform = "sine",
    gain = 0.18,
    endFrequency = frequency,
  }) {
    if (!canPlay()) {
      return;
    }

    const context = state.context;
    const oscillator = context.createOscillator();
    const toneGain = context.createGain();

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), when + duration);

    toneGain.gain.setValueAtTime(0.0001, when);
    toneGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), when + 0.01);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(toneGain);
    toneGain.connect(state.masterGain);

    oscillator.start(when);
    oscillator.stop(when + duration + 0.01);
  }

  function scheduleNoisePop({ when, duration = 0.05, gain = 0.08 }) {
    if (!canPlay()) {
      return;
    }

    const context = state.context;
    const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const channelData = noiseBuffer.getChannelData(0);

    for (let index = 0; index < bufferSize; index += 1) {
      channelData[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
    }

    const source = context.createBufferSource();
    const noiseGain = context.createGain();

    source.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(gain, when);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    source.connect(noiseGain);
    noiseGain.connect(state.masterGain);

    source.start(when);
    source.stop(when + duration + 0.01);
  }

  function playShoot() {
    if (!canPlay()) {
      return;
    }

    const now = state.context.currentTime;
    scheduleTone({
      when: now,
      frequency: 620,
      endFrequency: 980,
      duration: 0.12,
      waveform: "triangle",
      gain: 0.14,
    });
  }

  function playHit() {
    if (!canPlay()) {
      return;
    }

    const now = state.context.currentTime;
    scheduleTone({
      when: now,
      frequency: 420,
      endFrequency: 300,
      duration: 0.1,
      waveform: "square",
      gain: 0.13,
    });
    scheduleNoisePop({ when: now + 0.005, duration: 0.05, gain: 0.07 });
  }

  function playPlayerHit() {
    if (!canPlay()) {
      return;
    }

    const now = state.context.currentTime;
    scheduleTone({
      when: now,
      frequency: 520,
      endFrequency: 240,
      duration: 0.22,
      waveform: "sawtooth",
      gain: 0.18,
    });
  }

  function playGameOver() {
    if (!canPlay()) {
      return;
    }

    const now = state.context.currentTime;
    const step = 0.13;

    scheduleTone({ when: now + step * 0, frequency: 370, endFrequency: 330, duration: 0.11, waveform: "triangle", gain: 0.14 });
    scheduleTone({ when: now + step * 1, frequency: 294, endFrequency: 260, duration: 0.11, waveform: "triangle", gain: 0.14 });
    scheduleTone({ when: now + step * 2, frequency: 220, endFrequency: 180, duration: 0.12, waveform: "triangle", gain: 0.14 });
  }

  function playWaveClear() {
    if (!canPlay()) {
      return;
    }

    const now = state.context.currentTime;
    const step = 0.11;

    scheduleTone({ when: now + step * 0, frequency: 392, endFrequency: 430, duration: 0.09, waveform: "sine", gain: 0.15 });
    scheduleTone({ when: now + step * 1, frequency: 494, endFrequency: 530, duration: 0.09, waveform: "sine", gain: 0.15 });
    scheduleTone({ when: now + step * 2, frequency: 587, endFrequency: 640, duration: 0.09, waveform: "sine", gain: 0.15 });
    scheduleTone({ when: now + step * 3, frequency: 784, endFrequency: 840, duration: 0.09, waveform: "sine", gain: 0.13 });
  }

  function toggleMute() {
    state.muted = !state.muted;
    applyVolume();
    return state.muted;
  }

  function setMuted(nextMuted) {
    state.muted = Boolean(nextMuted);
    applyVolume();
  }

  function isMuted() {
    return state.muted;
  }

  function setVolume(nextVolume) {
    state.volume = clamp(nextVolume, 0, 1);
    applyVolume();
  }

  function getVolume() {
    return state.volume;
  }

  return {
    unlock,
    playShoot,
    playHit,
    playPlayerHit,
    playGameOver,
    playWaveClear,
    toggleMute,
    setMuted,
    isMuted,
    setVolume,
    getVolume,
  };
}
