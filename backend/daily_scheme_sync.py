"""
╔══════════════════════════════════════════════════════════════╗
║   MyScheme.gov.in — Daily Scheme Sync Script                ║
║   Government Subsidy & Grant Disbursement Tracking System   ║
║   Infosys Springboard Virtual Internship 7.0                ║
╚══════════════════════════════════════════════════════════════╝

Runs daily (via Windows Task Scheduler / cron) to:
  1. Fetch latest schemes from myscheme.gov.in
  2. Compare with existing schemes_real.json
  3. Add new schemes, mark expired/removed ones inactive
  4. Generate a sync report

Usage:
  python daily_scheme_sync.py              # Normal sync
  python daily_scheme_sync.py --full       # Full re-sync (all pages)
  python daily_scheme_sync.py --dry-run    # Preview changes only
"""

import json
import os
import sys
import time
import hashlib
import logging
import requests
from datetime import datetime, timedelta
from pathlib import Path

# ─── Configuration ───
SCRIPT_DIR = Path(__file__).parent
SCHEMES_FILE = SCRIPT_DIR / "src" / "main" / "resources" / "schemes_real.json"
SYNC_LOG_DIR = SCRIPT_DIR / "sync_logs"
BACKEND_API = "http://127.0.0.1:8080/api/subsidies/sync"

# MyScheme.gov.in search API
MYSCHEME_API = "https://www.myscheme.gov.in/api/search"
MYSCHEME_DETAIL_API = "https://www.myscheme.gov.in/api/schemes"

# Setup logging
SYNC_LOG_DIR.mkdir(exist_ok=True)
log_file = SYNC_LOG_DIR / f"sync_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ],
)
log = logging.getLogger("SchemeSync")

# HTTP session with retry
session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json",
    "Accept-Language": "en-IN,en;q=0.9,hi;q=0.8",
    "Referer": "https://www.myscheme.gov.in/search",
})


def load_existing_schemes():
    """Load existing schemes from JSON file."""
    if not SCHEMES_FILE.exists():
        log.warning(f"Schemes file not found: {SCHEMES_FILE}")
        return []
    
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    log.info(f"Loaded {len(data)} existing schemes from {SCHEMES_FILE.name}")
    return data


def save_schemes(schemes):
    """Save schemes to JSON file with backup."""
    # Create backup
    if SCHEMES_FILE.exists():
        backup = SCHEMES_FILE.with_suffix(f".backup_{datetime.now().strftime('%Y%m%d')}.json")
        if not backup.exists():  # Only one backup per day
            import shutil
            shutil.copy2(SCHEMES_FILE, backup)
            log.info(f"Created backup: {backup.name}")
    
    with open(SCHEMES_FILE, "w", encoding="utf-8") as f:
        json.dump(schemes, f, indent=2, ensure_ascii=False)
    
    log.info(f"Saved {len(schemes)} schemes to {SCHEMES_FILE.name}")


def scheme_fingerprint(scheme):
    """Generate a hash fingerprint for deduplication."""
    key = f"{scheme.get('title', '').strip().lower()}|{scheme.get('ministry', '').strip().lower()}"
    return hashlib.md5(key.encode()).hexdigest()[:12]


def fetch_myscheme_page(page=1, keyword=""):
    """Fetch a page of schemes from myscheme.gov.in search API."""
    try:
        params = {
            "keyword": keyword,
            "page": page,
            "limit": 50,
            "sort": "relevance",
        }
        resp = session.get(MYSCHEME_API, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        return data
    except requests.exceptions.RequestException as e:
        log.error(f"API request failed (page {page}): {e}")
        return None


def fetch_scheme_detail(slug):
    """Fetch detailed info for a specific scheme."""
    try:
        url = f"{MYSCHEME_DETAIL_API}/{slug}"
        resp = session.get(url, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except:
        return None


def scrape_myscheme_search(max_pages=10, keyword=""):
    """
    Scrape schemes from myscheme.gov.in using their search page.
    Falls back to HTML scraping if API is not available.
    """
    log.info(f"Fetching schemes from myscheme.gov.in (max {max_pages} pages)...")
    
    all_schemes = []
    seen_titles = set()
    
    # Method 1: Try the API endpoint
    for page in range(1, max_pages + 1):
        log.info(f"  Fetching page {page}/{max_pages}...")
        data = fetch_myscheme_page(page, keyword)
        
        if data is None:
            log.warning(f"  Page {page} failed. Trying HTML fallback...")
            break
        
        # Parse API response
        schemes_list = data.get("data", data.get("schemes", data.get("results", [])))
        if isinstance(data, list):
            schemes_list = data
        
        if not schemes_list:
            log.info(f"  No more schemes on page {page}. Done.")
            break
        
        for item in schemes_list:
            title = item.get("schemeName", item.get("title", item.get("name", "")))
            if not title or title.lower() in seen_titles:
                continue
            
            seen_titles.add(title.lower())
            
            scheme = {
                "title": title.strip(),
                "description": item.get("briefDescription", item.get("description", "")),
                "ministry": item.get("ministry", item.get("nodalMinistry", "Unknown")),
                "state": item.get("state", item.get("location", "All")),
                "category": item.get("category", item.get("schemeCategory", "General")),
                "schemeStatus": item.get("status", "Active"),
                "applicationDeadline": item.get("deadline", item.get("endDate", "")),
                "startDate": item.get("startDate", item.get("launchDate", "")),
                "eligibilityCriteria": item.get("eligibility", item.get("eligibilityCriteria", "")),
                "benefits": item.get("benefits", ""),
                "applicationProcess": item.get("applicationProcess", item.get("howToApply", "")),
                "documentsRequired": item.get("documentsRequired", []),
                "grantAmount": item.get("amount", item.get("grantAmount", "")),
                "applicationUrl": item.get("url", item.get("applicationUrl", "")),
                "incomeLimit": item.get("incomeLimit", ""),
                "sourceUrl": f"https://www.myscheme.gov.in/schemes/{item.get('slug', '')}",
                "lastSyncedAt": datetime.now().isoformat(),
            }
            
            all_schemes.append(scheme)
        
        time.sleep(1.5)  # Rate limiting — be respectful
    
    # Method 2: HTML scraping fallback
    if not all_schemes:
        log.info("API returned no data. Trying HTML scraping fallback...")
        all_schemes = scrape_html_fallback(max_pages)
    
    log.info(f"Fetched {len(all_schemes)} schemes from myscheme.gov.in")
    return all_schemes


def scrape_html_fallback(max_pages=5):
    """HTML scraping fallback using requests + BeautifulSoup."""
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        log.error("BeautifulSoup not installed. Run: pip install beautifulsoup4")
        return []
    
    schemes = []
    base_url = "https://www.myscheme.gov.in/search"
    
    for page in range(1, max_pages + 1):
        try:
            resp = session.get(f"{base_url}?page={page}", timeout=30)
            soup = BeautifulSoup(resp.text, "html.parser")
            
            # Find scheme cards
            cards = soup.select("[role='article'], .scheme-card, [data-scheme]")
            if not cards:
                # Try generic card patterns
                cards = soup.select("div.card, div.scheme-item, article")
            
            if not cards:
                log.info(f"  No cards found on page {page}")
                break
            
            for card in cards:
                title_el = card.select_one("h2, h3, .scheme-title, .card-title")
                desc_el = card.select_one("p, .description, span[aria-label*='description']")
                ministry_el = card.select_one(".ministry, h2[aria-label*='Filter']")
                
                title = title_el.get_text(strip=True) if title_el else ""
                if not title:
                    continue
                
                link_el = card.select_one("a[href*='/schemes/']")
                href = link_el["href"] if link_el else ""
                
                schemes.append({
                    "title": title,
                    "description": desc_el.get_text(strip=True) if desc_el else "",
                    "ministry": ministry_el.get_text(strip=True) if ministry_el else "Unknown",
                    "state": "All",
                    "category": "General",
                    "schemeStatus": "Active",
                    "applicationUrl": f"https://www.myscheme.gov.in{href}" if href else "",
                    "sourceUrl": f"https://www.myscheme.gov.in{href}" if href else "",
                    "lastSyncedAt": datetime.now().isoformat(),
                })
            
            time.sleep(2)
        except Exception as e:
            log.error(f"HTML scraping error on page {page}: {e}")
            break
    
    return schemes


def sync_schemes(fetched, existing, dry_run=False):
    """
    Compare fetched schemes with existing and produce:
    - New schemes to add
    - Schemes to mark inactive (removed from source)
    - Schemes to update (description/status changed)
    """
    # Build lookup by fingerprint
    existing_fps = {}
    for s in existing:
        fp = scheme_fingerprint(s)
        existing_fps[fp] = s
    
    fetched_fps = {}
    for s in fetched:
        fp = scheme_fingerprint(s)
        fetched_fps[fp] = s
    
    # --- New schemes (in fetched but not in existing) ---
    new_schemes = []
    for fp, scheme in fetched_fps.items():
        if fp not in existing_fps:
            # Generate a unique ID
            import uuid
            scheme["id"] = str(uuid.uuid4())
            scheme["isActive"] = True
            scheme["addedDate"] = datetime.now().strftime("%Y-%m-%d")
            new_schemes.append(scheme)
    
    # --- Expired schemes (in existing but not in fetched) ---
    # Only mark as inactive if it was previously "Active" and hasn't been synced recently
    expired_schemes = []
    for fp, scheme in existing_fps.items():
        if fp not in fetched_fps and scheme.get("schemeStatus") == "Active":
            expired_schemes.append(scheme)
    
    # --- Updated schemes (in both, but with changes) ---
    updated_schemes = []
    for fp in fetched_fps:
        if fp in existing_fps:
            old = existing_fps[fp]
            new = fetched_fps[fp]
            # Check if description or status changed
            if (old.get("description", "") != new.get("description", "") and new.get("description")) or \
               (old.get("schemeStatus") != new.get("schemeStatus") and new.get("schemeStatus")):
                updated_schemes.append((old, new))
    
    # --- Report ---
    log.info("=" * 60)
    log.info(f"  SYNC REPORT — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    log.info("=" * 60)
    log.info(f"  Existing schemes:  {len(existing)}")
    log.info(f"  Fetched schemes:   {len(fetched)}")
    log.info(f"  New to add:        {len(new_schemes)}")
    log.info(f"  Expired/removed:   {len(expired_schemes)}")
    log.info(f"  Updated:           {len(updated_schemes)}")
    log.info("=" * 60)
    
    if new_schemes:
        log.info("\nNEW SCHEMES:")
        for s in new_schemes[:10]:
            log.info(f"  [+] {s['title']} — {s.get('ministry', 'N/A')}")
        if len(new_schemes) > 10:
            log.info(f"  ... and {len(new_schemes) - 10} more")
    
    if expired_schemes:
        log.info("\nPOTENTIALLY EXPIRED (will be marked inactive):")
        for s in expired_schemes[:10]:
            log.info(f"  [-] {s['title']}")
        if len(expired_schemes) > 10:
            log.info(f"  ... and {len(expired_schemes) - 10} more")
    
    if dry_run:
        log.info("\n[DRY RUN] No changes written. Exiting.")
        return existing
    
    # --- Apply changes ---
    result = list(existing)
    
    # Add new schemes
    result.extend(new_schemes)
    
    # Mark expired schemes as inactive
    for scheme in expired_schemes:
        scheme["schemeStatus"] = "Inactive"
        scheme["expiredDate"] = datetime.now().strftime("%Y-%m-%d")
    
    # Apply updates
    for old, new in updated_schemes:
        if new.get("description"):
            old["description"] = new["description"]
        if new.get("schemeStatus"):
            old["schemeStatus"] = new["schemeStatus"]
        old["lastSyncedAt"] = datetime.now().isoformat()
    
    log.info(f"\n[DONE] Total schemes after sync: {len(result)}")
    return result


def notify_backend():
    """Trigger Spring Boot backend to reload data from JSON."""
    try:
        resp = requests.post(BACKEND_API, timeout=10)
        if resp.ok:
            log.info("[BACKEND] Sync notification sent successfully")
        else:
            log.warning(f"[BACKEND] Sync notification failed: {resp.status_code}")
    except:
        log.warning("[BACKEND] Could not reach backend (is it running?)")


def generate_report(existing_count, result_count, new_count, expired_count, updated_count):
    """Generate a JSON report for the sync run."""
    report = {
        "timestamp": datetime.now().isoformat(),
        "existingSchemes": existing_count,
        "finalSchemes": result_count,
        "newAdded": new_count,
        "markedExpired": expired_count,
        "updated": updated_count,
        "logFile": str(log_file),
    }
    
    report_file = SYNC_LOG_DIR / f"report_{datetime.now().strftime('%Y%m%d')}.json"
    with open(report_file, "w") as f:
        json.dump(report, f, indent=2)
    
    log.info(f"Report saved: {report_file.name}")
    return report


def main():
    print()
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║        MyScheme.gov.in — Daily Scheme Sync Script          ║")
    print("║        GovGrant Tracker • Infosys Springboard 7.0          ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    print()
    
    # Parse args
    full_sync = "--full" in sys.argv
    dry_run = "--dry-run" in sys.argv
    max_pages = 200 if full_sync else 10
    
    if dry_run:
        log.info("[MODE] Dry run — no changes will be saved")
    if full_sync:
        log.info("[MODE] Full sync — fetching all pages")
    
    # Step 1: Load existing
    existing = load_existing_schemes()
    existing_count = len(existing)
    
    # Step 2: Fetch from myscheme.gov.in
    fetched = scrape_myscheme_search(max_pages=max_pages)
    
    if not fetched:
        log.warning("No schemes fetched. The API may be down or blocking requests.")
        log.info("Tip: Try running scraper_production.py with Selenium for full scrape.")
        return
    
    # Step 3: Sync
    result = sync_schemes(fetched, existing, dry_run=dry_run)
    
    new_count = len(result) - existing_count
    expired_count = sum(1 for s in result if s.get("expiredDate") == datetime.now().strftime("%Y-%m-%d"))
    updated_count = sum(1 for s in result if s.get("lastSyncedAt", "").startswith(datetime.now().strftime("%Y-%m-%d")))
    
    # Step 4: Save
    if not dry_run:
        save_schemes(result)
        notify_backend()
    
    # Step 5: Report
    generate_report(existing_count, len(result), max(0, new_count), expired_count, updated_count)
    
    log.info("\nSync complete!")


if __name__ == "__main__":
    main()
