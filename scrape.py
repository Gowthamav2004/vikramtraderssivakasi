import re
import json

file_path = r"C:\Users\Admin\.gemini\antigravity-ide\brain\31a19191-df8e-441b-b7ac-7591d4d9308b\.system_generated\steps\150\content.md"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove line numbers added by view_file tool if any (but this is raw content, so it might not have line numbers)
# It's raw markdown, so no line numbers.

products = []
categories = []
current_category = ""
current_cat_id = ""

import bs4
soup = bs4.BeautifulSoup(content, "html.parser")

table = soup.find("table", id="order-table")
if table:
    tbody = table.find("tbody")
    if tbody:
        for tr in tbody.find_all("tr"):
            if "sub" in tr.get("class", []):
                cat_name = tr.text.strip()
                current_category = cat_name
                current_cat_id = re.sub(r'[^a-zA-Z0-9]', '', cat_name).lower()
                categories.append({
                    "id": current_cat_id,
                    "name": cat_name,
                    "icon": "sparkler" # default
                })
            elif "odd" in tr.get("class", []) or "even" in tr.get("class", []):
                try:
                    name = tr.find("td", class_="product_name").text.strip()
                    desc = tr.find("td", class_="product_content").text.strip()
                    mrp_text = tr.find("td", class_="product_rate").text.strip()
                    price_text = tr.find("td", class_="discounted_price").text.strip()
                    
                    # Extract numbers
                    mrp = int(re.search(r'\d+', mrp_text).group()) if re.search(r'\d+', mrp_text) else 0
                    price = int(re.search(r'\d+', price_text).group()) if re.search(r'\d+', price_text) else 0
                    
                    products.append({
                        "code": f"RUBY-{len(products)+1}",
                        "cat": current_cat_id,
                        "name": name,
                        "desc": desc,
                        "mrp": mrp,
                        "price": price
                    })
                except Exception as e:
                    print(f"Error parsing row: {e}")

print(f"Found {len(categories)} categories and {len(products)} products.")

with open("g:\\Code\\file\\scraped_products.json", "w") as f:
    json.dump({"categories": categories, "products": products}, f, indent=2)

