import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EdgeTTS } from 'edge-tts-universal';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TS_FILE = path.join(ROOT, 'src', 'utils', 'kidExplanations.ts');
const OUT_DIR = path.join(ROOT, 'public', 'voices');

function extractClips() {
  const raw = fs.readFileSync(TS_FILE, 'utf-8');
  const blockMatch = raw.match(
    /export const OFFLINE_VOICE_CLIPS:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*?)\n\};/
  );
  if (!blockMatch) {
    throw new Error('Could not find OFFLINE_VOICE_CLIPS in kidExplanations.ts');
  }
  const body = blockMatch[1];
  const regex = /(\w+):\s*\n?\s*'([^']+)'/g;
  const entries = [];
  let m;
  while ((m = regex.exec(body)) !== null) {
    entries.push([m[1], m[2]]);
  }
  return entries;
}

async function synthClip(key, text) {
  const outFile = path.join(OUT_DIR, `${key}.mp3`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 500) {
    return true;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const tts = new EdgeTTS(text, 'fa-IR-DilaraNeural', {
        rate: '-4%',
        pitch: '+4Hz',
      });
      const res = await tts.synthesize();
      const ab = await res.audio.arrayBuffer();
      const buf = Buffer.from(ab);
      if (buf.length > 500) {
        fs.writeFileSync(outFile, buf);
        console.log(`[OK] ${key}.mp3 (${buf.length} bytes)`);
        return true;
      }
    } catch (err) {
      console.warn(`[RETRY ${attempt}] ${key}: ${err?.message || err}`);
      await new Promise((r) => setTimeout(r, 900 * attempt));
    }
  }
  return false;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const entries = extractClips();
  console.log(`Parsed ${entries.length} Persian voice clips from kidExplanations.ts`);
  if (process.argv.includes('--dry-run')) return;

  const CONCURRENCY = 4;
  let idx = 0;
  async function worker() {
    while (idx < entries.length) {
      const current = entries[idx++];
      await synthClip(current[0], current[1]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  const totalReady = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.mp3')).length;
  console.log(`Done! ${totalReady}/${entries.length} Persian MP3 files in public/voices/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
