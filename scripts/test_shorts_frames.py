#!/usr/bin/env python3
"""Free diagnostic: test public YouTube clients for storyboard metadata."""
import json
import subprocess
import sys
from pathlib import Path

URLS = [
    "https://www.youtube.com/shorts/cP1lmemI0fk",
    "https://www.youtube.com/shorts/sSt88cW5Bw8",
]
CLIENTS = ["default", "tv_embedded", "mweb", "ios"]
OUT = Path("shorts-frame-test")
OUT.mkdir(exist_ok=True)
report = {
    "note": "Metadata/storyboard access only. Thumbnail images are not counted as scene frames.",
    "videos": [],
}

def walk_storyboard(value, path=""):
    found = []
    if isinstance(value, dict):
        for k, v in value.items():
            p = f"{path}.{k}" if path else k
            found.extend(walk_storyboard(v, p))
    elif isinstance(value, list):
        for i, v in enumerate(value):
            found.extend(walk_storyboard(v, f"{path}[{i}]"))
    elif isinstance(value, str) and value.startswith("http") and ("storyboard" in path.lower() or "/sb/" in value):
        found.append({"path": path, "url": value})
    return found

for url in URLS:
    video_id = url.rstrip("/").split("/")[-1]
    item = {"video_id": video_id, "url": url, "status": "started", "attempts": []}
    info = None
    for client in CLIENTS:
        cmd = ["yt-dlp", "--dump-single-json", "--skip-download", "--no-warnings"]
        if client != "default":
            cmd += ["--extractor-args", f"youtube:player_client={client}"]
        cmd.append(url)
        try:
            raw = subprocess.check_output(
                cmd, stderr=subprocess.STDOUT, timeout=45, text=True
            )
            info = json.loads(raw)
            item["attempts"].append({"client": client, "status": "ok"})
            item["working_client"] = client
            break
        except subprocess.CalledProcessError as e:
            detail = (e.output or str(e)).strip()
            item["attempts"].append({"client": client, "status": "failed", "error": detail[-900:]})
        except subprocess.TimeoutExpired:
            item["attempts"].append({"client": client, "status": "timeout"})
        except Exception as e:
            item["attempts"].append({"client": client, "status": "error", "error": str(e)[:500]})
    if info:
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
    else:
        item["status"] = "failed_all_clients"
    (OUT / f"{video_id}.json").write_text(json.dumps(item, indent=2, ensure_ascii=False), encoding="utf-8")
    report["videos"].append(item)

(OUT / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
if any(v.get("status") != "metadata_ok" for v in report["videos"]):
    sys.exit(1)
