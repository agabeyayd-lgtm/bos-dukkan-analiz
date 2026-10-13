#!/usr/bin/env python3
"""Free diagnostic: try to extract storyboard frames from public YouTube Shorts."""
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

URLS = [
    "https://www.youtube.com/shorts/cP1lmemI0fk",
    "https://www.youtube.com/shorts/sSt88cW5Bw8",
]
OUT = Path("shorts-frame-test")
OUT.mkdir(exist_ok=True)
report = {"note": "Diagnostic only. Thumbnail images are not counted as scene frames.", "videos": []}

def walk_storyboard(value, path=""):
    found = []
    if isinstance(value, dict):
        for k, v in value.items():
            p = f"{path}.{k}" if path else k
            if "storyboard" in k.lower() or "storyboard" in path.lower():
                found.extend(walk_storyboard(v, p))
            else:
                found.extend(walk_storyboard(v, p))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            found.extend(walk_storyboard(v, f"{path}[{i}]"))
    elif isinstance(value, str) and value.startswith("http") and ("storyboard" in path.lower() or "sb/" in value):
        found.append({"path": path, "url": value})
    return found

for url in URLS:
    video_id = url.rstrip("/").split("/")[-1]
    item = {"video_id": video_id, "url": url, "status": "started"}
    try:
        raw = subprocess.check_output(
            ["yt-dlp", "--dump-single-json", "--skip-download", "--no-warnings", url],
            stderr=subprocess.STDOUT, timeout=90, text=True
        )
        info = json.loads(raw)
        storyboards = info.get("storyboards")
        storyboard_urls = walk_storyboard(storyboards if storyboards is not None else {})
        item.update({
            "title": info.get("title"),
            "duration_seconds": info.get("duration"),
            "storyboards_field_present": storyboards is not None,
            "storyboard_url_count": len(storyboard_urls),
            "storyboard_candidates": storyboard_urls[:20],
            "thumbnail_count_not_frames": len(info.get("thumbnails") or []),
            "status": "metadata_ok"
        })
        # Save a sanitized metadata subset, never cookies or request headers.
        (OUT / f"{video_id}.json").write_text(json.dumps(item, indent=2), encoding="utf-8")
    except Exception as e:
        item.update({"status": "failed", "error": str(e)[:700]})
    report["videos"].append(item)

(OUT / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
