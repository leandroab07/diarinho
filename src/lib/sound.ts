"use client";

let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

/**
 * Plays a soft cute three-note chime (G5 → B5 → D6).
 * No external audio assets needed — synthesized on the fly.
 */
export function playReminderChime(volume = 0.18) {
  const audio = ensureCtx();
  if (!audio) return;

  const notes = [
    { freq: 783.99, start: 0, dur: 0.22 },   // G5
    { freq: 987.77, start: 0.18, dur: 0.22 }, // B5
    { freq: 1174.66, start: 0.36, dur: 0.32 }, // D6
  ];

  const master = audio.createGain();
  master.gain.value = volume;
  master.connect(audio.destination);

  const now = audio.currentTime;
  for (const n of notes) {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = "sine";
    osc.frequency.value = n.freq;
    g.gain.setValueAtTime(0, now + n.start);
    g.gain.linearRampToValueAtTime(1, now + n.start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + n.start + n.dur);
    osc.connect(g).connect(master);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.dur + 0.05);
  }
}

/** Unlocks audio after first user gesture (browsers require this). */
export function primeAudio() {
  ensureCtx();
}
