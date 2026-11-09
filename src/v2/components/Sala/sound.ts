const KEY = 'v2.sound';

// Música de fondo ("Last Hour - FKJ"): pendiente de licencia, sin pista por ahora.
export const TRACK: string | null = null;

let ctx: AudioContext | undefined;

/** null = sin preferencia guardada (hay que preguntar). */
export function soundPref(): boolean | null {
  try {
    const v = sessionStorage.getItem(KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

let on = soundPref() === true;

export function setSound(v: boolean) {
  on = v;
  try {
    sessionStorage.setItem(KEY, v ? '1' : '0');
  } catch {
    /* sin persistencia: no pasa nada */
  }
}

// Mismo timbre que el animatic: triángulo + dos parciales senoidales, paso bajo y caída de 2,2 s.
export function note(hz: number) {
  if (!on) return;
  ctx ??= new AudioContext();
  void ctx.resume();
  const t = ctx.currentTime;
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2200;
  g.connect(lp).connect(ctx.destination);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.18, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
  for (const [m, type, v] of [
    [1, 'triangle', 1],
    [2, 'sine', 0.35],
    [3, 'sine', 0.12],
  ] as const) {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.type = type;
    o.frequency.value = hz * m;
    og.gain.value = v;
    o.connect(og).connect(g);
    o.start(t);
    o.stop(t + 2.3);
  }
}
