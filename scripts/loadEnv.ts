// Load env vars from .env.local without a dotenv dependency. Reads lines
// formatted as KEY=VALUE, ignoring blanks and comments. Existing
// process.env values win so CI / Vercel-style envs are not overridden.
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const CANDIDATES = ['.env.local', '.env'];

for (const filename of CANDIDATES) {
  const file = resolve(process.cwd(), filename);
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}
