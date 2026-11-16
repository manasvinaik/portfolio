/**
 * The shared world: a population crossing the screen along one course, re-entering upstream
 * once it leaves downstream. Size stands in for distance (depth 0 far → 1 near): depth scales
 * size and speed (parallax). The list stays sorted far → near so near ones draw over far ones.
 * (Trimmed to what the butterflies use; the pointer lure is an addition for the hero.)
 */
import { angleDiff, clamp, rand } from './math.js';

export const SHARED_TUNING = {
  density: 1,
  corner: false,   // cross bottom-left → top-right whatever the screen shape
  direction: 49,   // course in degrees when not corner: 0 → right, 90 → up
  speed: 1,
  sway: 0.04,      // how far the whole stream sways off course, radians
  spread: 0.06,    // how far each individual's course can differ from the stream's
  size: 1,
  farthest: 0.45,  // depth of the farthest individuals
  farBias: 1.6,    // >1 puts more of the population far away
  grip: 2,         // how tightly individuals hold their course
  separation: 300, // push between neighbours at the same depth
  trail: 1,
  trailFade: 1.3,
};

const STARTLE_RADIUS = 560; // click scatters everything within this many px
const REFERENCE_SIZE = 160; // nearest individual on a laptop-sized screen, px

export class Flock {
  constructor(animal, tuning, count) {
    this.animal = animal;
    this.tuning = tuning;
    this.count = count;
    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.creatures = [];
    this.base = 120;
    this.acc = { x: 0, y: 0 };
    this.pointer = { x: 0, y: 0, on: false };
    this.nextId = 1;
  }

  resize(width, height) {
    const first = this.width === 0;
    this.width = width;
    this.height = height;
    this.base = clamp(Math.min(width, height) * 0.2, 80, 190) * this.animal.scale;
    if (first) this.populate(true);
  }

  get course() {
    const k = this.tuning;
    return k.corner ? Math.atan2(-this.height, this.width) : (-k.direction * Math.PI) / 180;
  }

  get heading() {
    const t = this.time;
    return this.course + this.tuning.sway * (Math.sin(t * 0.13) + 0.5 * Math.sin(t * 0.31 + 1.7));
  }

  get target() {
    const { width: W, height: H, animal } = this;
    const shrink = (this.base / animal.scale / REFERENCE_SIZE) ** 2;
    return this.count ?? clamp(Math.round(((W * H) / (animal.area * shrink)) * this.tuning.density), 1, animal.max ?? 200);
  }

  depthOf(roll) {
    const k = this.tuning;
    return k.farthest + (1 - k.farthest) * Math.pow(roll, k.farBias);
  }

  cruise(c) {
    return this.animal.speed * (0.55 + 0.45 * c.depth) * this.tuning.speed;
  }

  startle(x, y) {
    for (const c of this.creatures) {
      const dx = c.x - x, dy = c.y - y, d = Math.hypot(dx, dy) || 1;
      if (d > STARTLE_RADIUS) continue;
      this.animal.startle(c, dx / d, dy / d, Math.max(0.25, 1 - d / STARTLE_RADIUS), this);
    }
  }

  step(dt) {
    this.time += dt;
    this.populate(false);
    for (const c of this.creatures) {
      c.depth = this.depthOf(c.roll);
      c.span = this.base * c.depth * this.tuning.size;
    }
    for (const c of this.creatures) this.animal.update(c, this, dt);
  }

  populate(scatter) {
    const target = this.target;
    while (this.creatures.length > target) this.creatures.splice(Math.floor(Math.random() * this.creatures.length), 1);
    while (this.creatures.length < target) {
      const c = this.spawn();
      if (scatter || Math.random() < 0.5) {
        c.x = rand(0, this.width);
        c.y = rand(0, this.height);
        this.animal.enter?.(c, this);
      }
      this.insert(c);
    }
  }

  insert(c) {
    const at = this.creatures.findIndex((o) => o.roll > c.roll);
    this.creatures.splice(at < 0 ? this.creatures.length : at, 0, c);
  }

  spawn() {
    const base = { id: this.nextId++, roll: Math.random(), depth: 1, span: 0, x: 0, y: 0, vx: 0, vy: 0, heading: 0, bias: 0, startledUntil: 0 };
    base.depth = this.depthOf(base.roll);
    base.span = this.base * base.depth * this.tuning.size;
    const c = this.animal.create(base, this);
    this.reenter(c);
    return c;
  }

  reenter(c) {
    const { width: W, height: H, course } = this;
    const m = c.span * 0.6, cos = Math.cos(course), sin = Math.sin(course);
    const sideways = H * Math.abs(cos), vertical = W * Math.abs(sin);
    if (Math.random() * (sideways + vertical) < sideways) {
      c.x = cos >= 0 ? -m : W + m;
      c.y = rand(0, H);
    } else {
      c.x = rand(0, W);
      c.y = sin <= 0 ? H + m : -m;
    }
    const cruise = this.cruise(c);
    c.heading = course;
    c.vx = cos * cruise;
    c.vy = sin * cruise;
    c.bias = rand(-1, 1);
    this.animal.enter?.(c, this);
  }

  passed(c, margin = c.span) {
    const { width: W, height: H, course } = this;
    const cos = Math.cos(course), sin = Math.sin(course);
    const out = (cos > 0.05 && c.x > W + margin) || (cos < -0.05 && c.x < -margin) || (sin < -0.05 && c.y < -margin) || (sin > 0.05 && c.y > H + margin);
    const lost = c.x < -3 * margin || c.x > W + 3 * margin || c.y < -3 * margin || c.y > H + 3 * margin;
    return out || lost;
  }

  // ── steering helpers: each adds into this.acc ──
  begin() { this.acc.x = 0; this.acc.y = 0; return this.acc; }

  steer(c, dir, speed, grip) {
    const scared = this.time < c.startledUntil; // a scattered butterfly ignores the course and the cursor for a moment
    if (scared) { grip *= 0.15; speed *= 1.6; }
    this.acc.x += (Math.cos(dir) * speed - c.vx) * grip;
    this.acc.y += (Math.sin(dir) * speed - c.vy) * grip;
    const p = this.pointer; // lure: drift toward the cursor, circle it when close
    if (p.on && !scared) {
      const dx = p.x - c.x, dy = p.y - c.y, d = Math.hypot(dx, dy);
      if (d > 1 && d < 360) {
        const k = speed * grip * 0.9 * (1 - d / 360);
        this.acc.x += (dx / d) * k;
        this.acc.y += (dy / d) * k;
        if (d < 90) { this.acc.x += (-dy / d) * k; this.acc.y += (dx / d) * k; }
      }
    }
  }

  separate(c, strength = this.tuning.separation, range = 0.42) {
    if (strength <= 0) return;
    for (const o of this.creatures) {
      if (o === c || Math.abs(o.depth - c.depth) > 0.18) continue;
      const ox = c.x - o.x, oy = c.y - o.y, d = Math.hypot(ox, oy), r = (c.span + o.span) * range;
      if (d < r && d > 1e-3) {
        const w = (1 - d / r) * strength;
        this.acc.x += (ox / d) * w;
        this.acc.y += (oy / d) * w;
      }
    }
  }

  move(c, dt, max) {
    c.vx += this.acc.x * dt;
    c.vy += this.acc.y * dt;
    let speed = Math.hypot(c.vx, c.vy);
    const cap = max + (this.time < c.startledUntil ? 700 : 0);
    if (speed > cap) { c.vx *= cap / speed; c.vy *= cap / speed; speed = cap; }
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    return speed;
  }

  face(c, dt, rate = 7, angle = Math.atan2(c.vy, c.vx)) {
    const turn = rate * dt;
    c.heading += clamp(angleDiff(c.heading, angle), -turn, turn);
  }
}
