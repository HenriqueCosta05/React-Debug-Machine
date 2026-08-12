// src/theme/loadTheme.ts — fetch + validate the active theme JSON, then build it.
import { buildTheme } from './buildTheme';
import { TokensSchema } from './tokens.schema';

export async function loadTheme(name: string) {
  const res = await fetch(`/themes/${name}.json`);
  if (!res.ok) throw new Error(`theme "${name}" failed to load (${res.status})`);
  const tokens = TokensSchema.parse(await res.json()); // throws on malformed JSON
  return buildTheme(tokens);
}
