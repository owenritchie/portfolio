export type GraphNode = {
  id: string;
  label: string;
  kind: 'work' | 'school' | 'project' | 'skill';
  sub: string;
  icon?: string;
};

export type GraphData = { nodes: GraphNode[]; edges: [string, string][] };

type Sim = GraphNode & {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  phase: number;
  img?: HTMLImageElement;
  sx: number;
  sy: number;
  sr: number;
  depth: number;
};

type Hover = { node: GraphNode; x: number; y: number } | null;

const FOCAL = 1100;
const LINK = 170;

export function initGraph(canvas: HTMLCanvasElement, data: GraphData, onHover: (h: Hover) => void) {
  const ctx = canvas.getContext('2d')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodes: Sim[] = data.nodes.map((n, i) => {
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const r = 160 + Math.random() * 80;
    return {
      ...n,
      x: r * Math.sin(b) * Math.cos(a),
      y: r * Math.sin(b) * Math.sin(a),
      z: r * Math.cos(b),
      vx: 0,
      vy: 0,
      vz: 0,
      phase: i * 1.7,
      sx: 0,
      sy: 0,
      sr: 0,
      depth: 0,
    };
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const links = data.edges.map(([a, b]) => [byId.get(a)!, byId.get(b)!] as const);
  const neighbours = new Map<string, Set<string>>(nodes.map((n) => [n.id, new Set([n.id])]));
  data.edges.forEach(([a, b]) => {
    neighbours.get(a)!.add(b);
    neighbours.get(b)!.add(a);
  });

  nodes.forEach((n) => {
    if (n.icon) {
      n.img = new Image();
      n.img.src = n.icon;
    }
  });

  for (let step = 0; step < 420; step++) {
    const alpha = 1 - step / 420;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let dz = a.z - b.z;
        const d2 = dx * dx + dy * dy + dz * dz + 40;
        const f = (42000 / d2) * alpha;
        const d = Math.sqrt(d2);
        dx /= d;
        dy /= d;
        dz /= d;
        a.vx += dx * f;
        a.vy += dy * f;
        a.vz += dz * f;
        b.vx -= dx * f;
        b.vy -= dy * f;
        b.vz -= dz * f;
      }
    }
    links.forEach(([a, b]) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
      const f = (d - LINK) * 0.03 * alpha;
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      a.vz += (dz / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
      b.vz -= (dz / d) * f;
    });
    nodes.forEach((n) => {
      n.vx -= n.x * 0.0035 * alpha;
      n.vy -= n.y * 0.0035 * alpha;
      n.vz -= n.z * 0.0035 * alpha;
      n.vx *= 0.82;
      n.vy *= 0.82;
      n.vz *= 0.82;
      n.x += n.vx;
      n.y += n.vy;
      n.z += n.vz;
    });
  }

  const radius = Math.max(...nodes.map((n) => Math.hypot(n.x, n.y, n.z)));

  let yaw = 0.6;
  let pitch = -0.25;
  let spinY = reduce ? 0 : 0.0022;
  let spinX = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let hovered: Sim | null = null;
  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  let colors = readColors();

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const get = (v: string) => s.getPropertyValue(v).trim();
    return {
      accent: get('--accent'),
      accent2: get('--accent-2'),
      ink: get('--heading-ink'),
      line: get('--dash-color'),
      bg: get('--bg'),
      text: get('--text'),
    };
  }

  const kindColor = (k: Sim['kind']) =>
    k === 'work' ? colors.accent : k === 'school' ? colors.accent2 : k === 'project' ? colors.ink : colors.line;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }

  function project(t: number) {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cx = Math.cos(pitch);
    const sx = Math.sin(pitch);
    const fit = Math.min(w, h) / (radius * 1.7);
    const motion = reduce ? 0 : 1;
    nodes.forEach((n) => {
      const bob = Math.sin(t / 1400 + n.phase) * 4 * motion;
      const x = n.x + bob;
      const y = n.y + Math.cos(t / 1700 + n.phase) * 4 * motion;
      const x1 = x * cy + n.z * sy;
      const z1 = -x * sy + n.z * cy;
      const y2 = y * cx - z1 * sx;
      const z2 = y * sx + z1 * cx;
      const s = FOCAL / (FOCAL + z2 + radius);
      n.sx = w / 2 + x1 * s * fit;
      n.sy = h / 2 + y2 * s * fit;
      n.depth = z2;
      const base = n.kind === 'skill' ? 17 : 10;
      n.sr = base * s * Math.max(fit * 1.6, 0.7) * 1.15;
    });
  }

  function draw(t: number) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    project(t);

    const lit = hovered ? neighbours.get(hovered.id)! : null;
    const fade = (z: number) => 0.4 + 0.6 * (1 - (z + radius) / (radius * 2));

    ctx.lineWidth = 1;
    links.forEach(([a, b]) => {
      const on = !lit || (lit.has(a.id) && lit.has(b.id) && (a === hovered || b === hovered));
      ctx.globalAlpha = (on ? 0.9 : 0.12) * fade((a.depth + b.depth) / 2);
      ctx.strokeStyle = on && lit ? colors.accent : colors.line;
      ctx.lineWidth = on && lit ? 1.6 : 1;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    });

    const order = [...nodes].sort((a, b) => b.depth - a.depth);
    order.forEach((n) => {
      const on = !lit || lit.has(n.id);
      ctx.globalAlpha = (on ? 1 : 0.18) * fade(n.depth);
      if (n.kind === 'skill') {
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, n.sr, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.strokeStyle = n === hovered ? colors.accent : colors.line;
        ctx.lineWidth = n === hovered ? 2.5 : 1.5;
        ctx.stroke();
        if (n.img && n.img.complete && n.img.naturalWidth) {
          const s = n.sr * 1.15;
          ctx.drawImage(n.img, n.sx - s / 2, n.sy - s / 2, s, s);
        }
      } else {
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, n.sr * (n === hovered ? 1.35 : 1), 0, Math.PI * 2);
        ctx.fillStyle = kindColor(n.kind);
        ctx.fill();
      }
    });
    order.forEach((n) => {
      if (n.kind === 'skill') return;
      const on = !lit || lit.has(n.id);
      ctx.globalAlpha = on ? 0.5 + 0.5 * fade(n.depth) : 0.25;
      const size = Math.max(12, n.sr * 1.45);
      ctx.font = `600 ${size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = colors.bg;
      ctx.fillStyle = colors.text;
      ctx.strokeText(n.label, n.sx, n.sy + n.sr + 5);
      ctx.fillText(n.label, n.sx, n.sy + n.sr + 5);
    });
    ctx.globalAlpha = 1;
  }

  function frame(t: number) {
    if (!dragging) {
      if (spinX !== 0 || spinY !== 0) {
        yaw += spinY;
        pitch += spinX;
        spinX *= 0.95;
        if (Math.abs(spinX) < 0.00005) spinX = 0;
      }
      const base = reduce || (hovered && !dragging) ? 0 : 0.0022;
      spinY += (base - spinY) * 0.02;
    }
    pitch = Math.max(-1.3, Math.min(1.3, pitch));
    draw(t);
    raf = requestAnimationFrame(frame);
  }

  function pick(px: number, py: number) {
    let best: Sim | null = null;
    nodes.forEach((n) => {
      if (Math.hypot(n.sx - px, n.sy - py) <= n.sr + 5 && (!best || n.depth < best.depth)) best = n;
    });
    return best as Sim | null;
  }

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-dragging');
    onHover(null);
  });

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx * 0.008;
      if (e.pointerType !== 'touch') pitch += dy * 0.008;
      spinY = dx * 0.008;
      spinX = e.pointerType !== 'touch' ? dy * 0.008 : 0;
      return;
    }
    const n = pick(e.clientX - rect.left, e.clientY - rect.top);
    hovered = n;
    onHover(n ? { node: n, x: e.clientX, y: e.clientY } : null);
  });

  const release = () => {
    dragging = false;
    canvas.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('pointerleave', () => {
    hovered = null;
    onHover(null);
  });

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const themeWatch = new MutationObserver(() => (colors = readColors()));
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  raf = requestAnimationFrame(frame);

  return {
    refreshColors: () => (colors = readColors()),
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeWatch.disconnect();
    },
    pause() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    resume() {
      if (!raf) raf = requestAnimationFrame(frame);
    },
  };
}
