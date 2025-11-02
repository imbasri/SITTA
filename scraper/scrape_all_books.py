#!/usr/bin/env python3
"""
Advanced scraper untuk pustaka.ut.ac.id/lib/ruangbaca/
Mengambil SEMUA buku dengan detail lengkap

Usage:
  python scrape_all_books.py

Output:
  scraper/all_books.json
  scraper/all_books.js (untuk import ke data.js)
"""
import json
import re
import time
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://pustaka.ut.ac.id/lib/ruangbaca/"
OUT_JSON = "all_books.json"
OUT_JS = "all_books.js"
DELAY = 0.5  # Delay antar request (seconds)
MAX_BOOKS = 50  # Limit untuk testing (set None untuk semua)


def fetch(url, retries=3):
    """Fetch URL dengan retry"""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    
    for attempt in range(retries):
        try:
            resp = requests.get(url, headers=headers, timeout=20)
            resp.raise_for_status()
            return resp.text
        except Exception as e:
            print(f"  Attempt {attempt+1}/{retries} failed: {e}")
            if attempt < retries - 1:
                time.sleep(2)
            else:
                raise
    return None


def extract_book_links(index_html):
    """Extract semua link buku dari halaman utama"""
    soup = BeautifulSoup(index_html, "html.parser")
    
    # Target XPath: /html/body/div[1]/div/div[1]/div[2]/div/div[1]/section[2]
    # Cari section dengan class tertentu atau struktur yang sesuai
    links = []
    
    # Method 1: Cari semua link di dalam article/section
    for section in soup.find_all(['section', 'article', 'div'], class_=re.compile(r'(book|item|entry|post)')):
        for a in section.find_all('a', href=True):
            href = a['href'].strip()
            if '/lib/' in href and not href.endswith('#') and href != BASE_URL:
                # Normalize URL
                if href.startswith('/'):
                    href = urljoin('https://pustaka.ut.ac.id', href)
                links.append(href)
    
    # Method 2: Cari semua link yang mengandung /lib/
    if not links:
        for a in soup.find_all('a', href=True):
            href = a['href'].strip()
            if '/lib/' in href and href.endswith('/') and href != BASE_URL:
                if href.startswith('/'):
                    href = urljoin('https://pustaka.ut.ac.id', href)
                if href not in links:
                    links.append(href)
    
    # Remove duplicates
    links = list(set(links))
    
    # Filter hanya yang pola: /lib/xxxxx-nama-buku/
    filtered = []
    for link in links:
        parsed = urlparse(link)
        path = parsed.path.rstrip('/')
        slug = path.split('/')[-1]
        # Harus ada format kode-nama
        if re.match(r'^[a-zA-Z]{4}\d{4}', slug):
            filtered.append(link)
    
    return filtered or links  # Return filtered or all if no match


def extract_code_from_url(url):
    """Extract kode buku dari URL"""
    parsed = urlparse(url)
    slug = parsed.path.rstrip('/').split('/')[-1]
    
    # Format: adbi4211-manajemen-risiko-dan-asuransi-edisi-3
    match = re.match(r'^([a-zA-Z]{4}\d{4})', slug)
    if match:
        return match.group(1).upper()
    
    # Fallback: ambil token pertama
    return slug.split('-')[0].upper()


def extract_book_details(book_url):
    """Extract detail buku dari halaman detail"""
    try:
        print(f"  Fetching: {book_url}")
        html = fetch(book_url)
        if not html:
            return None
            
    except Exception as e:
        print(f"  ERROR: {e}")
        return None

    soup = BeautifulSoup(html, "html.parser")
    
    # 1. KODE BUKU
    code = extract_code_from_url(book_url)
    
    # 2. TITLE
    title = None
    # Try h1
    h1 = soup.find('h1', class_=re.compile(r'(title|entry-title)'))
    if h1:
        title = h1.get_text(strip=True)
    # Try og:title
    if not title:
        og_title = soup.find('meta', property='og:title')
        if og_title:
            title = og_title.get('content', '').strip()
    # Fallback to any h1
    if not title:
        h1 = soup.find('h1')
        if h1:
            title = h1.get_text(strip=True)
    
    # 3. IMAGE (prioritas: og:image)
    image = None
    og_img = soup.find('meta', property='og:image')
    if og_img:
        image = og_img.get('content', '').strip()
    
    # Fallback: cari img dengan class/id tertentu
    if not image:
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src and '/wp-content/uploads/' in src:
                image = urljoin(book_url, src)
                break
    
    # Skip jika tidak ada gambar
    if not image:
        print(f"  -> No image, skipping")
        return None
    
    # 4. AUTHOR (penulis)
    author = "Tim Penulis UT"
    # Try meta author
    author_meta = soup.find('meta', attrs={'name': 'author'})
    if author_meta:
        author = author_meta.get('content', 'Tim Penulis UT').strip()
    
    # Try element dengan class/text "Penulis" atau "Author"
    for elem in soup.find_all(['p', 'div', 'span'], string=re.compile(r'Penulis|Author', re.I)):
        text = elem.get_text(strip=True)
        # Extract setelah ":"
        if ':' in text:
            author = text.split(':', 1)[1].strip()
            break
    
    # 5. DESCRIPTION
    description = ""
    # Try og:description
    og_desc = soup.find('meta', property='og:description')
    if og_desc:
        description = og_desc.get('content', '').strip()
    
    # Try meta description
    if not description:
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content', '').strip()
    
    # Try first paragraph in content
    if not description:
        content_div = soup.find(['div', 'article'], class_=re.compile(r'(content|entry|post-content)'))
        if content_div:
            p = content_div.find('p')
            if p:
                description = p.get_text(strip=True)
    
    # Default description
    if not description:
        description = f"Buku ajar {code} dari Universitas Terbuka"
    
    # Limit description length
    if len(description) > 200:
        description = description[:197] + '...'
    
    # Fallback for missing title
    if not title:
        title = f"Buku {code}"
        print(f"  -> No title found, using: {title}")
    
    # 6. PRODI & SEMESTER (extract dari kode atau title)
    prodi = "Umum"
    semester = 1
    
    # Mapping kode fakultas
    faculty_map = {
        'ADBI': 'Administrasi Bisnis',
        'ADPU': 'Administrasi Publik',
        'EKMA': 'Manajemen',
        'EKSI': 'Ekonomi Syariah',
        'PEKO': 'Ekonomi Pembangunan',
        'MKCU': 'Perpajakan',
        'IPEM': 'Pemerintahan',
        'ISIP': 'Ilmu Perpustakaan',
        'SKOM': 'Ilmu Komunikasi',
        'SOSI': 'Sosiologi',
        'PKNI': 'PKN',
        'PDGK': 'Pendidikan Guru SD',
        'PAUD': 'Pendidikan Anak Usia Dini',
        'PBIS': 'Pendidikan Bahasa Inggris',
        'PBIN': 'Pendidikan Bahasa Indonesia',
        'PMAT': 'Pendidikan Matematika',
        'PEKI': 'Pendidikan Kimia',
        'PEFI': 'Pendidikan Fisika',
        'PEBI': 'Pendidikan Biologi',
        'MKWU': 'Mata Kuliah Wajib Umum',
    }
    
    # Extract dari kode (4 huruf pertama)
    code_prefix = code[:4].upper()
    if code_prefix in faculty_map:
        prodi = faculty_map[code_prefix]
    
    # Extract semester dari kode (digit pertama)
    if len(code) >= 5 and code[4].isdigit():
        semester = int(code[4])
    
    # 7. PRICE & STOCK (default values)
    price = 50000  # Default price
    stock = 100    # Default stock
    
    book_data = {
        'code': code,
        'title': title or f"Buku {code}",
        'author': author,
        'prodi': prodi,
        'semester': semester,
        'price': price,
        'stock': stock,
        'image': image,
        'description': description,
        'link': book_url
    }
    
    # Safe print
    display_title = (book_data['title'][:50]) if book_data['title'] else code
    print(f"  ✓ {code}: {display_title}")
    return book_data


def scrape_all():
    """Main scraping function"""
    print("=" * 60)
    print("SCRAPING PUSTAKA.UT.AC.ID")
    print("=" * 60)
    
    # 1. Fetch halaman utama
    print(f"\n1. Fetching main page: {BASE_URL}")
    index_html = fetch(BASE_URL)
    
    # 2. Extract semua link buku
    print("\n2. Extracting book links...")
    book_links = extract_book_links(index_html)
    print(f"   Found {len(book_links)} book links")
    
    if not book_links:
        print("   WARNING: No book links found!")
        print("   Trying alternative method...")
        # Alternative: scrape from sitemap or specific pages
        
    # 3. Extract detail untuk setiap buku
    print("\n3. Extracting book details...")
    books = []
    
    # Limit if MAX_BOOKS is set
    links_to_process = book_links[:MAX_BOOKS] if MAX_BOOKS else book_links
    total_links = len(book_links)
    
    print(f"   Processing {len(links_to_process)} out of {total_links} books")
    
    for i, link in enumerate(links_to_process, 1):
        print(f"\n[{i}/{len(links_to_process)}] {link}")
        
        book = extract_book_details(link)
        if book:
            books.append(book)
        
        # Delay to be polite
        if i < len(links_to_process):
            time.sleep(DELAY)
    
    print(f"\n{'=' * 60}")
    print(f"TOTAL BOOKS SCRAPED: {len(books)}/{len(links_to_process)}")
    if MAX_BOOKS:
        print(f"(Limited to {MAX_BOOKS} books for testing)")
    print(f"{'=' * 60}")
    
    # 4. Save to JSON
    print(f"\n4. Saving to {OUT_JSON}...")
    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=2, ensure_ascii=False)
    
    # 5. Generate JS file
    print(f"\n5. Generating {OUT_JS}...")
    generate_js_file(books)
    
    print("\n✅ SCRAPING COMPLETE!")
    print(f"   JSON: {OUT_JSON}")
    print(f"   JS:   {OUT_JS}")
    print("\nNext steps:")
    print("1. Review all_books.js")
    print("2. Copy content to js/data.js (append or replace)")
    print("3. Test in browser")


def generate_js_file(books):
    """Generate JavaScript file untuk import ke data.js"""
    
    js_content = """// =====================================================
// SCRAPED BOOKS FROM PUSTAKA.UT.AC.ID
// Auto-generated - DO NOT EDIT MANUALLY
// =====================================================

const ScrapedBooks = [
"""
    
    for book in books:
        # Escape quotes properly
        title_safe = book['title'].replace('"', "'")
        author_safe = book['author'].replace('"', "'")
        desc_safe = book['description'].replace('"', "'")
        
        js_content += f"""    {{
        code: "{book['code']}",
        title: "{title_safe}",
        author: "{author_safe}",
        prodi: "{book['prodi']}",
        semester: {book['semester']},
        price: {book['price']},
        stock: {book['stock']},
        image: "{book['image']}",
        description: "{desc_safe}"
    }},
"""
    
    js_content += """];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrapedBooks;
}
"""
    
    with open(OUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)


if __name__ == '__main__':
    scrape_all()
