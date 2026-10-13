#!/usr/bin/env python3
"""Diagnostic only: test unauthenticated public routes for Shorts metadata/storyboard access."""
import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

URLS = [
    "https://www.youtube.com/shorts/cP1lmemI0fk",
    "https://www.youtube.com/shorts/sSt88cW5Bw8",
]
CLIENTS = [
    "default", "web", "web_embedded", "web_safari", "tv_embedded",
    "mweb", "ios", "android", "android_vr", "tv",
]
OUT = Path("shorts-frame-test")
OUT.mkdir(exist_ok=True)
report = {
    "note": "Unauthenticated diagnostics only. oEmbed/HTML reachability is not visual access; thumbnails are never counted as scene frames.",
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

def probe(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            body = response.read(200000).decode("utf-8", "replace")
            return {"status": "ok", "http_status": response.status, "bytes_sampled": len(body), "contains_storyboard": "storyboard" in body.lower(), "contains_bot_check": "not a bot" in body.lower() or "unusual traffic" in body.lower()}
    except urllib.error.HTTPError as e:
        return {"status": "http_error", "http_status": e.code}
    except Exception as e:
        return {"status": "error", "error": str(e)[:300]}

for url in URLS:
    video_id = url.rstrip("/").split("/")[-1]
    item = {"video_id": video_id, "url": url, "attempts": [], "public_endpoint_probes": {}}
    info = None
    for client in CLIENTS:
        cmd = ["yt-dlp", "--dump-single-json", "--skip-download", "--no-warnings", "--no-check-formats"]
        if client != "default":
            cmd += ["--extractor-args", f"youtube:player_client={client}"]
        cmd.append(url)
        try:
            raw = subprocess.check_output(cmd, stderr=subprocess.STDOUT, timeout=35, text=True)
            info = json.loads(raw)
            item["attempts"].append({"client": client, "status": "ok"})
            item["working_client"] = client
            break
        except subprocess.CalledProcessError as e:
            detail = (e.output or str(e)).strip()
            item["attempts"].append({"client": client, "status": "failed", "error": detail[-500:]})
        except subprocess.TimeoutExpired:
            item["attempts"].append({"client": client, "status": "timeout"})
        except Exception as e:
            item["attempts"].append({"client": client, "status": "error", "error": str(e)[:300]})
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
        item["status"] = "yt_dlp_clients_failed"
    item["public_endpoint_probes"]["oembed"] = probe("https://www.youtube.com/oembed?url=" + urllib.request.quote(url, safe="") + "&format=json")
    item["public_endpoint_probes"]["embed_html"] = probe("https://www.youtube.com/embed/" + video_id)
    item["public_endpoint_probes"]["youtube_nocookie_embed"] = probe("https://www.youtube-nocookie.com/embed/" + video_id)
    item["visual_access_confirmed"] = bool(info and item.get("storyboard_url_count", 0) > 0)
    item["status"] = "storyboard_candidates_found" if item["visual_access_confirmed"] else item["status"]
    (OUT / f"{video_id}.json").write_text(json.dumps(item, indent=2, ensure_ascii=False), encoding="utf-8")
    report["videos"].append(item)

(OUT / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
if any(not v.get("visual_access_confirmed") for v in report["videos"]):
    sys.exit(1)
