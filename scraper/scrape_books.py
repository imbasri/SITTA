#!/usr/bin/env python3
"""
Simple scraper for pustaka.ut.ac.id/lib/ruangbaca/

Usage:
  python scrape_books.py

Output:
  scraper/output_books.json

Note: run locally. This script is a convenience tool and does not bypass any site's robots.txt.
"""
import json
import re
import time
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


BASE = "https://pustaka.ut.ac.id/lib/ruangbaca/"
OUT_FILE = "output_books.json"


def fetch(url):
    headers = {"User-Agent": "sitta-scraper/1.0 (+https://example.com)"}
    resp = requests.get(url, headers=headers, timeout=15)
    resp.raise_for_status()
    return resp.text


def extract_entries(index_html):
    soup = BeautifulSoup(index_html, "html.parser")
    anchors = soup.find_all("a", href=True)
    links = []
    for a in anchors:
        href = a["href"].strip()
        if href.startswith("/"):
            href = urljoin("https://pustaka.ut.ac.id", href)
        if "pustaka.ut.ac.id/lib/" in href and href.endswith("/"):
            links.append((href, a.get_text(strip=True)))
        elif "pustaka.ut.ac.id/lib/" in href and not href.startswith("https://pustaka.ut.ac.id/lib/#"):
            # include non-slash links too
            links.append((href, a.get_text(strip=True)))

    # de-duplicate while preserving order
    seen = set()
    uniq = []
    for href, text in links:
        if href not in seen:
            seen.add(href)
            uniq.append((href, text))
    return uniq


def extract_book_details(book_url):
    try:
        html = fetch(book_url)
    except Exception as e:
        print(f"Failed to fetch {book_url}: {e}")
        return None

    soup = BeautifulSoup(html, "html.parser")
    
    # title
    title = None
    h1 = soup.find("h1")
    if h1 and h1.get_text(strip=True):
        title = h1.get_text(strip=True)
    if not title and soup.title:
        title = soup.title.get_text(strip=True)

    # image: prefer og:image, else first image under post
    image = None
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        image = og["content"]

    if not image:
        imgs = soup.find_all("img")
        for img in imgs:
            src = img.get("src") or img.get("data-src")
            if src and "/wp-content/uploads/" in src:
                image = urljoin(book_url, src)
                break
    
    # Skip if no image found
    if not image:
        print(f"  -> No image found, skipping")
        return None

    # derive code from URL slug (first token before dash)
    parsed = urlparse(book_url)
    slug = parsed.path.rstrip("/").split("/")[-1]
    code_match = re.match(r"([A-Za-z0-9]+)", slug)
    code = code_match.group(1).upper() if code_match else slug
    
    # Extract description from meta or content
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"]
    
    # Extract author (look for common patterns)
    author = "Tim Penulis UT"
    author_patterns = ["Penulis:", "Pengarang:", "Author:"]
    content_text = soup.get_text()
    for pattern in author_patterns:
        if pattern in content_text:
            idx = content_text.index(pattern)
            author_text = content_text[idx:idx+100].split('\n')[0]
            author = author_text.replace(pattern, "").strip()
            break

    return {
        "code": code, 
        "title": title or slug, 
        "author": author,
        "link": book_url, 
        "image": image,
        "description": description[:200] if description else f"Buku {title or slug}"
    }


def main():
    print("Fetching index page...", BASE)
    html = fetch(BASE)
    entries = extract_entries(html)
    print(f"Found {len(entries)} candidate links")
    
    # Limit to first 30 books for faster scraping
    MAX_BOOKS = 30
    print(f"Will scrape max {MAX_BOOKS} books (with images only)...")

    books = []
    processed = 0
    for i, (href, text) in enumerate(entries, 1):
        if len(books) >= MAX_BOOKS:
            print(f"Reached limit of {MAX_BOOKS} books with images")
            break
            
        # basic filter: many links are category/index links; skip obvious non-book items
        if any(x in href for x in ["/rbv/", "/katalog", "/lib/sitemap", "/lib/ruangbaca"]):
            continue
        
        print(f"[{i}/{len(entries)}] probing: {href}")
        details = extract_book_details(href)
        if details:
            books.append(details)
            print(f"  -> Added ({len(books)}/{MAX_BOOKS})")
        processed += 1
        
        # Don't probe too many if we're not finding books
        if processed > 100 and len(books) < 10:
            print("Not finding many books, stopping...")
            break
            
        time.sleep(0.5)

    print(f"Scraped {len(books)} book entries")
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUT_FILE}")


if __name__ == "__main__":
    main()
