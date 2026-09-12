
const env = import.meta.env as unknown as Record<string, string | undefined>;
const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
  .process?.env;

const key =
  env.carto_key ??
  env.CARTO_KEY ??
  env.PUBLIC_CARTO_KEY ??
  processEnv?.carto_key ??
  processEnv?.CARTO_KEY ??
  '';

export type CartoStyle = 'light_all' | 'dark_all';

export function cartoTiles(style: CartoStyle): string {
  const url = `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;
  return key ? `${url}?key=${encodeURIComponent(key)}` : url;
}
