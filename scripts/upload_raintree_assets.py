"""
Bulk upload the 4613 Raintree images to the Supabase storage bucket.

Prereqs:
- Python 3.10+
- pip install "supabase>=2.4.0" "httpx>=0.28"
- Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- Optional env: PROJECT_BUCKET (default: project-assets)

What it does:
- Uploads the Raintree hero images and gallery assets from public/images
  to the bucket, preserving the relative paths (no leading slash),
  e.g. public/images/4613-grp-a/02-DFD-2.jpg -> 4613-grp-a/02-DFD-2.jpg.
- Uses HTTP PUT with x-upsert true so reruns are safe.
- Skips existing objects by default (HEAD check); use --no-skip-existing to force.
- Logs each file and prints a summary.

Run:
  python scripts/upload_raintree_assets.py            # real upload
  python scripts/upload_raintree_assets.py --dry-run  # just list
"""

from __future__ import annotations

import argparse
import mimetypes
import os
from pathlib import Path
from typing import Iterable, List, Tuple

import httpx

ROOT = Path(__file__).resolve().parents[1]
IMAGES_DIR = ROOT / "public" / "images"
DEFAULT_BUCKET = os.environ.get("PROJECT_BUCKET", "project-assets")


def find_targets() -> List[Tuple[Path, str]]:
    """
    Gather the specific Raintree assets we need to upload.
    Returns a list of (local_path, bucket_path) tuples.
    """
    patterns = [
        IMAGES_DIR / "4613-grp-a" / "*",
        IMAGES_DIR / "4613-grp-b" / "*",
        IMAGES_DIR / "4613-unit-1-main.webp",
        IMAGES_DIR / "4613-unit-2-main.webp",
    ]

    matches: List[Tuple[Path, str]] = []
    for pattern in patterns:
        if "*" in pattern.name:
            for path in pattern.parent.glob(pattern.name):
                if path.is_file() and not path.name.startswith("."):
                    rel = path.relative_to(IMAGES_DIR)  # bucket path without leading slash
                    matches.append((path, str(rel)))
        else:
            if pattern.is_file() and not pattern.name.startswith("."):
                rel = pattern.relative_to(IMAGES_DIR)
                matches.append((pattern, str(rel)))
    return matches


def require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"Missing required env var: {name}")
    return value


def object_exists(client: httpx.Client, base: str, bucket: str, bucket_path: str, headers: dict) -> bool:
    url = f"{base}/{bucket}/{bucket_path}"
    resp = client.head(url, headers=headers)
    if resp.status_code == 200:
        return True
    if resp.status_code == 404:
        return False
    print(f"[WARN] existence check {bucket_path}: {resp.status_code} {resp.text}")
    return False


def upload_files(
    supabase_url: str,
    service_key: str,
    bucket: str,
    files: Iterable[Tuple[Path, str]],
    dry_run: bool,
    skip_existing: bool,
) -> None:
    base = supabase_url.rstrip("/") + "/storage/v1/object"
    headers = {
        "Authorization": f"Bearer {service_key}",
        "apikey": service_key,
        "x-upsert": "true",
    }

    totals = {"ok": 0, "skipped": 0, "error": 0}

    with httpx.Client(timeout=60.0) as client:
        for local_path, bucket_path in files:
            content_type, _ = mimetypes.guess_type(local_path.name)
            ct = content_type or "application/octet-stream"
            url = f"{base}/{bucket}/{bucket_path}"

            if skip_existing and not dry_run:
                if object_exists(client, base, bucket, bucket_path, headers):
                    print(f"[SKIP] {bucket_path} already exists")
                    totals["skipped"] += 1
                    continue

            if dry_run:
                print(f"[DRY RUN] Would upload {local_path} -> {bucket_path} (content_type={ct})")
                continue

            with local_path.open("rb") as f:
                resp = client.put(url, content=f, headers={**headers, "content-type": ct})

            if resp.status_code >= 300:
                print(f"[ERROR] {bucket_path}: {resp.status_code} {resp.text}")
                totals["error"] += 1
            else:
                print(f"[OK] {bucket_path}")
                totals["ok"] += 1

    if not dry_run:
        print(f"Done. ok={totals['ok']} skipped={totals['skipped']} error={totals['error']}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload 4613 Raintree assets to Supabase storage.")
    parser.add_argument("--bucket", default=DEFAULT_BUCKET, help=f"Bucket name (default: {DEFAULT_BUCKET})")
    parser.add_argument("--dry-run", action="store_true", help="List files without uploading")
    parser.add_argument("--no-skip-existing", action="store_true", help="Force upload even if object already exists")
    args = parser.parse_args()

    files = find_targets()
    if not files:
        raise SystemExit("No matching files found; ensure public/images/4613-* exist.")

    print(f"Found {len(files)} files to upload to bucket '{args.bucket}'.")
    supabase_url = require_env("SUPABASE_URL")
    service_key = require_env("SUPABASE_SERVICE_ROLE_KEY")
    upload_files(
        supabase_url,
        service_key,
        args.bucket,
        files,
        dry_run=args.dry_run,
        skip_existing=not args.no_skip_existing,
    )


if __name__ == "__main__":
    main()
