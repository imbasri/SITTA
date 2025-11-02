#!/usr/bin/env python3
"""
Update js/data.js with scraped books
Only include books with valid course codes (e.g., ADBI4211, MSIM4101)
"""
import json
import re

# Read scraped data
with open('output_books.json', 'r', encoding='utf-8') as f:
    scraped_books = json.load(f)

# Filter only valid course codes (4 letters + 4 digits)
valid_books = []
for book in scraped_books:
    code = book['code']
    if re.match(r'^[A-Z]{4}\d{4}$', code):
        # Clean title - remove code prefix and "– Perpustakaan UT"
        title = book['title']
        title = re.sub(r'^' + code + r'\s*[-–]\s*', '', title)
        title = re.sub(r'\s*[-–]\s*Perpustakaan UT$', '', title)
        title = re.sub(r'\s*\(Edisi \d+\)', '', title).strip()
        
        # Try to get better image URL from link
        # Format: https://pustaka.ut.ac.id/lib/adbi4235-kepabeanan-dan-cukai-edisi-4/
        # Image should be: https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/ADBI4235.jpg
        image_url = f"https://pustaka.ut.ac.id/lib/wp-content/uploads/2017/01/{code}.jpg"
        
        valid_books.append({
            'code': code,
            'title': title,
            'author': book['author'],
            'prodi': 'Administrasi Bisnis',  # Based on ADBI code
            'semester': 4,  # Default, admin can change
            'price': 75000,  # Default price
            'stock': 20,  # Default stock
            'image': image_url,
            'description': title
        })

print(f"Found {len(valid_books)} valid books with course codes")

# Generate JavaScript code
js_code = "// New books from pustaka.ut.ac.id (scraped)\n"
js_code += "const NewBooks = [\n"

for book in valid_books:
    js_code += "    {\n"
    js_code += f"        code: \"{book['code']}\",\n"
    js_code += f"        title: \"{book['title']}\",\n"
    js_code += f"        author: \"{book['author']}\",\n"
    js_code += f"        prodi: \"{book['prodi']}\",\n"
    js_code += f"        semester: {book['semester']},\n"
    js_code += f"        price: {book['price']},\n"
    js_code += f"        stock: {book['stock']},\n"
    js_code += f"        image: \"{book['image']}\",\n"
    js_code += f"        description: \"{book['description']}\"\n"
    js_code += "    },\n"

js_code += "];\n"

# Write to file
with open('new_books.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print("Generated new_books.js")
print("\nPreview:")
print(js_code[:500] + "...")
