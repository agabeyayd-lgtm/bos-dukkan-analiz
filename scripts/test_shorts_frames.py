#!/usr/bin/env python3
"""Unauthenticated diagnostic for public Shorts storyboard access; never uses cookies."""
import json
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path
from PIL import Image

URLS = [
    "https://www.youtube.com/shorts/cP1lmemI0fk",
    "https://www.youtube.com/shorts/sSt88cW5Bw8",
]
CLIENTS = [
    "default", "tv,web_safari", "web_safari,tv", "web", "web_embedded",
    "web_safari", "tv_embedded", "mweb", "ios", "android", "android_vr", "tv",
    "tv_downgraded", "web_creator", "tv_simply", "web_music",
    "web,android_vr,tv_downgraded", "tv_downgraded,web_creator,mweb", "default,all",
]
OUT = Path("shorts-frame-test")
OUT.mkdir(exist_ok=True)
report = {
    "note": "Unauthenticated only. No cookies or account credentials. Metadata and thumbnails do not count as scene frames.",
    "videos": [],
}

def probe(url, max_bytes=200000):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"})
    try:
        with urllib.request.urlopen(req, timeout=20) as response:
            body = response.read(max_bytes).decode("utf-8", "replace")
            return {"status": "ok", "http_status": response.status, "bytes_sampled": len(body),
                    "contains_storyboard": "storyboard" in body.lower(),
                    "contains_bot_check": "not a bot" in body.lower() or "unusual traffic" in body.lower()}, body
    except urllib.error.HTTPError as e:
        return {"status": "http_error", "http_status": e.code}, ""
    except Exception as e:
        return {"status": "error", "error": str(e)[:300]}, ""

def player_response(html):
    marker = "ytInitialPlayerResponse"
    pos = html.find(marker)
    decoder = json.JSONDecoder()
    while pos >= 0:
        start = html.find("{", pos + len(marker))
        if start < 0 or start - pos > 1000:
            return None
        try:
            obj, _ = decoder.raw_decode(html[start:])
            if isinstance(obj, dict):
                return obj
        except json.JSONDecodeError:
            pass
        pos = html.find(marker, pos + len(marker))
    return None

def extract_storyboard_spec(html):
    response = player_response(html)
    if not response:
        return None
    sb = response.get("storyboards") or {}
    renderer = sb.get("playerStoryboardSpecRenderer") or {}
    return renderer.get("spec")

def download_storyboard(spec, video_id):
    """Parse YouTube's own signed spec; never guess signatures or bypass auth."""
    parts = spec.split("|")
    if len(parts) < 2:
        return []
    template = parts[0]
    saved = []
    # Part 1 describes L0/default; later parts describe higher-resolution M0 sheets.
    for part_index, entry in enumerate(parts[1:], start=1):
        fields = entry.split("#")
        if len(fields) < 8:
            continue
        try:
            tile_w, tile_h, count, cols, rows, interval = map(int, fields[:6])
        except ValueError:
            continue
        pattern = fields[6]
        signature_field = fields[7]
        if "rs$" not in signature_field:
            continue
        signature = signature_field.split("rs$", 1)[1]
        level = part_index - 1
        sheet_name = pattern.replace("$M", "0")
        path = template.replace("L$L/$N", f"L{level}/{sheet_name}")
        url = path + ("&" if "?" in path else "?") + "sigh=rs%24" + urllib.parse.quote(signature, safe="")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                raw = resp.read(8 * 1024 * 1024)
                content_type = resp.headers.get("Content-Type", "")
            if not content_type.startswith("image/"):
                continue
            image = Image.open(BytesIO(raw)).convert("RGB")
            sheet_path = OUT / f"{video_id}-storyboard-L{level}.jpg"
            image.save(sheet_path, quality=92)
            saved.append({"level": level, "url_status": "image_downloaded", "width": image.width,
                          "height": image.height, "tile_width": tile_w, "tile_height": tile_h,
                          "frame_count_reported": count, "columns": cols, "rows": rows,
                          "interval_ms": interval, "file": str(sheet_path)})
            # Higher-resolution sheet is usually enough; keep testing levels but do not crop/claim
            # semantic analysis here. The saved sprite itself is the visual-access proof.
        except Exception as e:
            saved.append({"level": level, "url_status": "failed", "error": str(e)[:240]})
    return saved


def try_invidious_frames(video_id):
    """Use only public Invidious APIs/stream URLs; no cookies, login, or guessed YouTube signatures."""
    instances = [
        "https://inv.nadeko.net",
        "https://invidious.nerdvpn.de",
        "https://yt.chocolatemoo53.com",
        "https://invidious.tiekoetter.com",
    ]
    attempts = []
    for base in instances:
        try:
            api_url = base + "/api/v1/videos/" + urllib.parse.quote(video_id)
            req = urllib.request.Request(api_url, headers={"User-Agent": "BoşDükkan-Shorts-Diagnostic/1.0", "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read(5 * 1024 * 1024).decode("utf-8", "replace"))
            streams = data.get("formatStreams") or []
            adaptive = data.get("adaptiveFormats") or []
            # Prefer a progressive MP4 with video+audio; otherwise a video-only MP4 is enough for frames.
            candidates = [x for x in streams if x.get("url") and "mp4" in (x.get("type") or "").lower()]
            candidates += [x for x in adaptive if x.get("url") and "video/mp4" in (x.get("type") or "").lower()]
            attempts.append({"instance": base, "api": "ok", "format_streams": len(streams), "adaptive_formats": len(adaptive), "candidates": len(candidates)})
            for n, stream in enumerate(candidates[:3]):
                for stamp in (0.3, 1.5, 3.0):
                    out = OUT / f"{video_id}-invidious-{n}-{str(stamp).replace('.', '_')}.jpg"
                    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-ss", str(stamp),
                           "-i", stream["url"], "-frames:v", "1", "-vf", "scale=640:-2", str(out)]
                    try:
                        subprocess.run(cmd, check=True, timeout=25, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
                        if out.exists() and out.stat().st_size > 1000:
                            with Image.open(out) as im:
                                width, height = im.size
                            return {"success": True, "instance": base, "title": data.get("title"),
                                    "duration_seconds": data.get("lengthSeconds"), "frames": [
                                        {"timestamp_seconds": stamp, "file": str(out), "width": width, "height": height}
                                    ], "attempts": attempts}
                    except Exception as e:
                        attempts.append({"instance": base, "frame_timestamp": stamp, "error": str(e)[:180]})
        except Exception as e:
            attempts.append({"instance": base, "api": "failed", "error": str(e)[:220]})
    return {"success": False, "attempts": attempts}

for url in URLS:
    video_id = url.rstrip("/").split("/")[-1]
    item = {"video_id": video_id, "url": url, "attempts": [], "public_endpoint_probes": {}}
    info = None
    for client in CLIENTS:
        cmd = ["yt-dlp", "--ignore-config", "--js-runtimes", "deno", "--force-ipv4",
               "--dump-single-json", "--skip-download", "--no-warnings",
               "--no-check-formats", "--socket-timeout", "15"]
        if client != "default":
            cmd += ["--extractor-args", f"youtube:player_client={client}"]
        cmd.append(url)
        try:
            raw = subprocess.check_output(cmd, stderr=subprocess.STDOUT, timeout=40, text=True)
            info = json.loads(raw)
            item["attempts"].append({"client": client, "status": "ok"})
            item["working_client"] = client
            break
        except subprocess.CalledProcessError as e:
            item["attempts"].append({"client": client, "status": "failed", "error": (e.output or str(e)).strip()[-500:]})
        except subprocess.TimeoutExpired:
            item["attempts"].append({"client": client, "status": "timeout"})
        except Exception as e:
            item["attempts"].append({"client": client, "status": "error", "error": str(e)[:300]})

    # Important new path: request the public watch page itself and parse its embedded player response.
    watch_url = "https://www.youtube.com/watch?v=" + video_id
    watch_probe, html = probe(watch_url, max_bytes=8 * 1024 * 1024)
    item["public_endpoint_probes"]["watch_page"] = watch_probe
    spec = extract_storyboard_spec(html) if html else None
    if spec:
        item["watch_page_storyboard_spec_found"] = True
        item["watch_page_storyboards"] = download_storyboard(spec, video_id)
    else:
        item["watch_page_storyboard_spec_found"] = False
        item["watch_page_storyboards"] = []

    # Alternate public route: Invidious API exposes stream URLs on some healthy instances.
    # This is a bounded fallback, not an authentication bypass; no cookies or account data are used.
    invidious = {"success": False, "attempts": []}
    if not spec:
        invidious = try_invidious_frames(video_id)
    item["invidious_fallback"] = invidious

    if info:
        storyboards = info.get("storyboards")
        item.update({
            "title": info.get("title"),
            "duration_seconds": info.get("duration"),
            "storyboards_field_present": storyboards is not None,
            "storyboard_url_count": len(storyboards or []),
            "thumbnail_count_not_frames": len(info.get("thumbnails") or []),
        })
    else:
        item["status"] = "yt_dlp_clients_failed"

    for label, endpoint in [
        ("oembed", "https://www.youtube.com/oembed?url=" + urllib.parse.quote(url, safe="") + "&format=json"),
        ("embed_html", "https://www.youtube.com/embed/" + video_id),
        ("youtube_nocookie_embed", "https://www.youtube-nocookie.com/embed/" + video_id),
    ]:
        probe_result, _ = probe(endpoint)
        item["public_endpoint_probes"][label] = probe_result

    item["visual_access_confirmed"] = any(x.get("url_status") == "image_downloaded" for x in item["watch_page_storyboards"])
    item["status"] = "storyboard_image_downloaded" if item["visual_access_confirmed"] else item.get("status", "no_storyboard_image")
    (OUT / f"{video_id}.json").write_text(json.dumps(item, indent=2, ensure_ascii=False), encoding="utf-8")
    report["videos"].append(item)

(OUT / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
if any(not v.get("visual_access_confirmed") for v in report["videos"]):
    sys.exit(1)
