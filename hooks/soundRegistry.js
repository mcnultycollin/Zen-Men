// soundRegistry.js
let playInhale = null;
let playExhale = null;

export function setSoundFns(fns) {
  playInhale = fns.playInhale;
  playExhale = fns.playExhale;
}

export function getSoundFns() {
  return { playInhale, playExhale };
}
