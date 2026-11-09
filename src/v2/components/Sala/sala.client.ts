import type { Block, Option, Script, Step } from '../../data/types';
import { resolve, type State } from './engine';
import { note, setSound, soundPref } from './sound';

// Tiempos únicos del runtime (ms), tomados del animatic. Con movimiento reducido, todo a 0:
// los `hold` de cada paso siguen aplicando, así que el texto sigue siendo legible y completable.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = reduced
  ? { cam: 0, line: 0, fade: 0, choose: 0, turn: 0 }
  : { cam: 1600, line: 1200, fade: 600, choose: 1200, turn: 2000 };
const KEY = 'v2.state';

type Saved = State & { sos?: Step['sospecha'] | null };

const script: Script = JSON.parse(document.getElementById('v2-script')!.textContent!);
const $ = <E extends HTMLElement>(sel: string) => document.querySelector<E>(sel)!;
const tpl = (id: string) =>
  (document.getElementById(id) as HTMLTemplateElement).content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;

const cam = $('#cam');
const box = $('#text');
const layers = [...document.querySelectorAll<HTMLElement>('[data-pose]')];
const postit = $('[data-postit]');
const plaque = $('[data-plaque]');
const shortcut = $('[data-shortcut]');
const exits = $('[data-exits]');
const sosBox = $('[data-sospecha]');

let state: Saved = { step: script.start };
let lastK = 1;
let timers: number[] = [];
let options: HTMLButtonElement[] = [];
let advance: (() => void) | null = null; // salta el `hold` del paso actual

const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
const stop = () => {
  timers.forEach(clearTimeout);
  timers = [];
  options = [];
  advance = null;
};

function load(): Saved {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    if (s && script.steps[s.step]) return s;
  } catch {
    /* sessionStorage bloqueado o JSON roto: empezar de cero */
  }
  return { step: script.start };
}

// Se guarda en cada paso: el atajo a proyectos ya lleva el estado vigente.
function save() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin persistencia: no pasa nada */
  }
}

// Desktop: escenario 1440x900 con fit() y cámara con translate (mismo cálculo que el animatic).
// <1024: fluido, solo scale con origen en la estatua y cámara 115/110/106 %.
const wide = matchMedia('(min-width:1024px)');
const tablet = matchMedia('(min-width:768px)');
const stage = $('[data-stage]');

function fit() {
  const s = wide.matches ? Math.min(innerWidth / 1440, innerHeight / 900) : '';
  stage.style.setProperty('--fit', String(s));
}

function setCamera(k: number, instant: boolean) {
  const e = 1 + (k - 1) * (wide.matches ? 1 : tablet.matches ? 10 / 15 : 6 / 15);
  if (instant) cam.style.transition = 'none';
  // Translate en % para que escale con el escenario (12,5 % = 180 px, 47,78 % = 430 px).
  const move = wide.matches ? `translate(${-(e - 1) * 12.5}%, ${-(e - 1) * 47.78}%) ` : '';
  cam.style.transform = `${move}scale(${e})`;
  if (instant) {
    void cam.offsetWidth;
    cam.style.transition = '';
  }
}

function renderSospecha() {
  sosBox.replaceChildren();
  const s = state.sos;
  if (!s) return;
  const el = tpl('t-sospecha');
  const [eyebrow, text] = el.querySelectorAll('p');
  eyebrow.textContent = s.eyebrow;
  text.textContent = s.text;
  sosBox.append(el);
}

function renderBlocks(blocks: Block[]) {
  const wrap = document.createElement('div');
  for (const b of blocks) {
    const el = tpl('t-block');
    el.children[0].textContent = b.eyebrow;
    el.children[1].textContent = b.title;
    if (b.body) el.children[2].textContent = b.body;
    else el.children[2].remove();
    wrap.append(el);
  }
  return wrap;
}

function pick(o: Option, btn: HTMLElement) {
  if (box.dataset.chosen) return;
  box.dataset.chosen = '1';
  btn.dataset.pick = '';
  options = [];
  if (o.note) note(o.note);
  Object.assign(state, o.set);
  later(() => enter(resolve(o.to, state)), T.choose);
}

function enter(id: string, instant = false) {
  stop();
  const step = script.steps[id];
  const t = (ms: number) => (instant ? 0 : ms);
  state.step = id;
  if (step.sospecha) state.sos = step.sospecha;
  if (state.mode === 'elegancia') state.sos = null;
  document.documentElement.dataset.mode = state.mode ?? '';
  save();

  // Cámara primero; el texto espera a que termine.
  const wait = step.camera !== lastK ? t(T.cam) : 0;
  setCamera(step.camera, instant);
  lastK = step.camera;

  // Estatua: crossfade, inclinación/espejo y giro único (squash).
  const turning =
    step.pose === 'giro' && !layers.some((l) => l.dataset.pose === 'giro' && l.dataset.on);
  const tf = `rotate(${step.tilt ?? 0}deg)${step.flip ? ' scaleX(-1)' : ''}`;
  for (const l of layers) {
    const on = l.dataset.pose === step.pose;
    if (on) l.dataset.on = '';
    else delete l.dataset.on;
    if (on && turning && !instant) {
      delete l.dataset.turn;
      void l.offsetWidth;
      l.dataset.turn = '';
    }
    l.style.transform = tf;
  }

  // Cortes secos: post-it, placa, luz, atajo, salidas, sospecha.
  postit.hidden = !step.postit;
  postit.textContent = step.postit ?? '';
  plaque.hidden = !step.plaque;
  plaque.textContent = step.plaque ?? '';
  cam.dataset.light = step.light ? '1' : '';
  shortcut.hidden = !step.ui?.exit;
  exits.hidden = !step.ui?.exits;
  renderSospecha();

  // Texto: líneas una a una, luego opciones o bloques.
  box.replaceChildren();
  delete box.dataset.chosen;
  box.style.setProperty('--top', `${((step.top ?? 330) / 900) * 100}%`);
  let at = wait;
  const lines = (step.lines ?? []).map((txt) => {
    const p = tpl('t-line');
    p.textContent = txt;
    box.append(p);
    return p;
  });
  lines.forEach((p, j) => {
    later(() => {
      if (step.dim && j > 0) lines[j - 1].dataset.dim = '';
      p.dataset.in = '';
    }, at);
    at += t(j < lines.length - 1 ? T.line : T.fade);
  });

  if (step.options) {
    const list = document.createElement('div');
    step.options.forEach((o, i) => {
      const b = tpl('t-option') as HTMLButtonElement;
      b.textContent = o.label;
      b.onclick = () => pick(o, b);
      options[i] = b;
      list.append(b);
    });
    box.append(list);
    later(() => {
      list.dataset.in = '';
      // No robar el foco si el usuario ya está en otro sitio.
      const a = document.activeElement;
      if (!a || a === document.body || box.contains(a)) options[0]?.focus();
    }, at);
    return; // la elección avanza el paso
  }

  if (step.blocks) {
    const wrap = renderBlocks(step.blocks);
    box.append(wrap);
    later(() => (wrap.dataset.in = ''), at);
    at += t(T.fade);
  }
  if (step.next) {
    const next = step.next;
    advance = () => go(next);
    later(() => go(next), at + t(step.hold ?? 0));
  }
}

function go(next: NonNullable<Step['next']>) {
  try {
    enter(resolve(next, state));
  } catch {
    // Estado guardado incoherente (p. ej. sin modo): reiniciar.
    state = { step: script.start };
    enter(script.start, true);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const i = Number(e.key) - 1;
  if (options[i]) options[i].click();
  else if (advance && (e.key === 'ArrowRight' || (e.key === 'Enter' && e.target === document.body)))
    advance();
});

addEventListener('resize', () => {
  fit();
  setCamera(lastK, true);
});
fit();
state = load();
const resumed = state.step !== script.start;

// Portada de sonido solo en una visita nueva y sin preferencia; una sesión retomada la salta.
const gate = $('[data-gate]');
if (!resumed && soundPref() === null) {
  gate.hidden = false;
  gate.querySelector('button')!.focus();
  gate.querySelectorAll<HTMLButtonElement>('button').forEach(
    (b) =>
      (b.onclick = () => {
        setSound(b.dataset.sound === '1');
        gate.hidden = true;
        if (b.dataset.sound === '1') note(392);
        enter(state.step, true);
      }),
  );
} else enter(state.step, true);
