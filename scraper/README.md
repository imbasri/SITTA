# Scraper for pustaka.ut.ac.id (simple)

This folder contains a small convenience scraper to fetch book pages from
https://pustaka.ut.ac.id/lib/ruangbaca/ and produce a JSON file with basic
metadata (code, title, link, image).

How to run (Windows PowerShell):

1. Create a virtual environment and activate it:

   python -m venv venv
   .\venv\Scripts\Activate

2. Install requirements:

   pip install -r requirements.txt

3. Run the scraper:

   python scrape_books.py

Output: `output_books.json` will be created in this folder.

Notes:
- This is a basic scraper for convenience during development. Review the
  produced JSON before merging into `js/data.js`.
- Respect the target site's robots.txt and usage policies when scraping at
  scale.
