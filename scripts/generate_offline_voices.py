#!/usr/bin/env python3
"""
Pre-generates all offline Persian (fa-IR-DilaraNeural) and Kid English (en-US-AnaNeural)
neural voice MP3s using edge-tts >= 7.3.1 (Sec-MS-GEC v2) into public/voices/<key>.mp3!
"""
import asyncio
import pathlib
import re
import sys
import edge_tts

FA_VOICE = "fa-IR-DilaraNeural"
EN_VOICE = "en-US-AnaNeural"
EN_FALLBACK_VOICE = "en-US-EmmaMultilingualNeural"

ROOT = pathlib.Path(__file__).resolve().parent.parent
TS_FILE = ROOT / "src" / "utils" / "kidExplanations.ts"
OUT_DIR = ROOT / "public" / "voices"


def extract_block(content: str, const_name: str) -> dict[str, str]:
    block_match = re.search(
        rf"export const {const_name}:\s*Record<string,\s*string>\s*=\s*\{{(.*?)\n\}};",
        content,
        re.DOTALL,
    )
    if not block_match:
        raise RuntimeError(f"Could not find {const_name} in kidExplanations.ts")
    body = block_match.group(1)
    pairs = re.findall(r"(\w+):\s*\n?\s*'([^']+)'", body)
    return dict(pairs)


def extract_all_clips(ts_path: pathlib.Path) -> tuple[dict[str, str], dict[str, str]]:
    content = ts_path.read_text(encoding="utf-8").replace("\r\n", "\n")
    fa_clips = extract_block(content, "OFFLINE_VOICE_CLIPS")
    en_clips = extract_block(content, "OFFLINE_ENGLISH_VOICE_CLIPS")
    return fa_clips, en_clips


async def synth_one(sem: asyncio.Semaphore, key: str, text: str, is_english: bool) -> None:
    out_file = OUT_DIR / f"{key}.mp3"
    if out_file.exists() and out_file.stat().st_size > 400:
        return
    async with sem:
        for attempt in range(4):
            voice = (
                (EN_VOICE if attempt < 2 else EN_FALLBACK_VOICE)
                if is_english
                else FA_VOICE
            )
            rate = "-6%" if is_english else "-4%"
            pitch = "+2Hz" if is_english else "+4Hz"
            try:
                comm = edge_tts.Communicate(text=text, voice=voice, rate=rate, pitch=pitch)
                await comm.save(str(out_file))
                if out_file.exists() and out_file.stat().st_size > 400:
                    print(f"[OK] {key}.mp3 ({out_file.stat().st_size} bytes)", flush=True)
                    return
            except Exception as err:
                print(f"[RETRY {attempt + 1}] {key} ({voice}): {err}", flush=True)
                await asyncio.sleep(1.2 * (attempt + 1))


async def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    fa_clips, en_clips = extract_all_clips(TS_FILE)
    total_expected = len(fa_clips) + len(en_clips)
    print(
        f"Synthesizing {len(fa_clips)} Persian + {len(en_clips)} English = {total_expected} clips...",
        flush=True,
    )
    sem = asyncio.Semaphore(4)
    tasks = [synth_one(sem, k, v, False) for k, v in fa_clips.items()] + [
        synth_one(sem, k, v, True) for k, v in en_clips.items()
    ]
    await asyncio.gather(*tasks)
    generated = [p for p in OUT_DIR.glob("*.mp3") if p.stat().st_size > 400]
    print(f"Completed! {len(generated)}/{total_expected} MP3 files ready in {OUT_DIR}", flush=True)
    if len(generated) < total_expected:
        sys.exit(f"ERROR: Expected {total_expected} MP3 files, got {len(generated)}")


if __name__ == "__main__":
    asyncio.run(main())
