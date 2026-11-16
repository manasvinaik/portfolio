// What a sampled point is made of. Shape functions write an Ink; the pen turns it into cells.
export const INK_SCALE = 0;   // ordinary
export const INK_DARK = 1;    // veins, margins
export const INK_SPOT = 2;    // small bright dots
export const INK_SHIMMER = 3; // iridescent: brightness rolls as the wings move
export const INK_BODY = 6;    // body
export const newInk = () => ({ r: 0, g: 0, b: 0, kind: INK_SCALE });
export function ink(out, r, g, b, kind = INK_SCALE) {
  out.r = r; out.g = g; out.b = b; out.kind = kind;
  return true;
}
