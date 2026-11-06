#!/usr/bin/env python3
"""
Pre-generates all offline Persian neural voice MP3s (fa-IR-DilaraNeural)
into public/voices/<key>.mp3 before building the Windows .exe & Offline Web ZIP!
"""
import asyncio
import os
import re
import pathlib
import edge_tts

VOICE = "fa-IR-DilaraNeural"
RATE = "-4%"
PITCH = "+4Hz"

ROOT = pathlib.Path(__file__).resolve().parent.parent
TS_FILE = ROOT / "src" / "utils" / "kidExplanations.ts"
OUT_DIR = ROOT / "public" / "voices"


def extract_clips_from_ts(ts_path: pathlib.Path) -> dict[str, str]:
    content = ts_path.read_text(encoding="utf-8")
    # Match key: 'value' pairs inside OFFLINE_VOICE_CLIPS
    block_match = re.search(
        r"export const OFFLINE_VOICE_CLIPS:\s*Record<string,\s*string>\s*=\s*\{(.*?)\n\};",
        content,
        re.DOTALL,
    )
    if not block_match:
        raise RuntimeError("Could not find OFFLINE_VOICE_CLIPS in kidExplanations.ts")
    body = block_match.group(1)
    pairs = re.findall(r"(\w+):\s*\n?\s*'([^']+)'", body)
    return dict(pairs)


async def synth_one(sem: asyncio.Semaphore, key: str, text: str) -> None:
    out_file = OUT_DIR / f"{key}.mp3"
    if out_file.exists() and out_file.stat().st_size > 500:
        return
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text=text, voice=VOICE, rate=RATE, pitch=PITCH)
                await comm.save(str(out_file))
                print(f"[OK] {key}.mp3 ({out_file.stat().st_size} bytes)")
                return
            except Exception as err:
                print(f"[RETRY {attempt + 1}] {key}: {err}")
                await asyncio.sleep(1.2 * (attempt + 1))


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    clips = extract_clips_from_ts(TS_FILE)
    print(f"Generating {len(clips)} Persian voice MP3s with {VOICE}...")
    sem = asyncio.Semaphore(5)
    await asyncio.gather(*(synth_one(sem, k, v) for k, v in clips.items()))
    generated = list(OUT_DIR.glob("*.mp3"))
    print(f"Completed! {len(generated)}/{len(clips)} MP3 files ready in {OUT_DIR}")


if __name__ == "__main__":
    asyncio.run(main())
