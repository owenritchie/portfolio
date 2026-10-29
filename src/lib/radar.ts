export type Skill = { name: string; icon: string; level: number; note: string };
export type Group = { name: string; skills: Skill[] };

const MAX = 10;
const W = 1300;
const H = 920;
const CX = W / 2;
const CY = H / 2;
const R = 310;
const RINGS = 5;

const fmt = (n: number) => n.toFixed(1);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function buildRadar(groups: Group[], active: number | null): string {
  const single = active !== null;
  const skills = single ? groups[active].skills : groups.flatMap((g) => g.skills);
  const owner = single ? [] : groups.flatMap((g, gi) => g.skills.map(() => gi));
  const N = skills.length;
  const step = (Math.PI * 2) / N;
  const angle = (i: number) => -Math.PI / 2 + i * step;
  const at = (i: number, r: number) => [CX + Math.cos(angle(i)) * r, CY + Math.sin(angle(i)) * r];

  const iconR = R + (single ? 80 : 62);
  const disc = single ? 38 : 29;
  const icon = single ? 44 : 36;

  let out = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Radar chart of tech stack experience">`;

  for (let k = 1; k <= RINGS; k++) {
    out += `<circle class="ring" cx="${CX}" cy="${CY}" r="${(R * k) / RINGS}" />`;
  }

  skills.forEach((_, i) => {
    const [x1, y1] = at(i, 0);
    const [x2, y2] = at(i, iconR - disc);
    out += `<line class="spoke" x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" />`;
  });

  const pts = skills.map((s, i) => at(i, (s.level / MAX) * R));
  out += `<polygon class="area" points="${pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(' ')}" />`;
  pts.forEach(([x, y]) => {
    out += `<circle class="dot" cx="${fmt(x)}" cy="${fmt(y)}" r="5" />`;
  });

  skills.forEach((s, i) => {
    const [x, y] = at(i, iconR);
    out += `<g class="node" tabindex="0"${single ? '' : ` data-group="${owner[i]}"`} data-name="${esc(s.name)}" data-note="${esc(s.note)}"><circle class="disc" cx="${fmt(x)}" cy="${fmt(y)}" r="${disc}" />`;
    out += `<image href="${esc(s.icon)}" x="${fmt(x - icon / 2)}" y="${fmt(y - icon / 2)}" width="${icon}" height="${icon}" preserveAspectRatio="xMidYMid meet" />`;
    if (single) {
      const cos = Math.cos(angle(i));
      const sin = Math.sin(angle(i));
      const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
      const lx = x + (anchor === 'start' ? disc + 14 : anchor === 'end' ? -disc - 14 : 0);
      const ly = anchor === 'middle' ? y + (sin < 0 ? -disc - 14 : disc + 28) : y + 7;
      out += `<text class="skill-label" x="${fmt(lx)}" y="${fmt(ly)}" text-anchor="${anchor}">${esc(s.name)}</text>`;
    }
    out += `</g>`;
  });

  if (!single) {
    const labelR = iconR + disc + 28;
    let cursor = 0;
    groups.forEach((g, gi) => {
      const first = cursor;
      const last = cursor + g.skills.length - 1;
      cursor += g.skills.length;

      const mid = (angle(first) + angle(last)) / 2;
      const cos = Math.cos(mid);
      const sin = Math.sin(mid);
      const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
      const lx = CX + cos * labelR;
      const ly = CY + sin * labelR + (sin < -0.7 ? -4 : sin > 0.7 ? 16 : 6);
      out += `<text class="group-label" data-group="${gi}" role="button" tabindex="0" x="${fmt(lx)}" y="${fmt(ly)}" text-anchor="${anchor}">${esc(g.name)}</text>`;
    });
  }

  return out + `</svg>`;
}
