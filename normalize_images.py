import os
import re

def normalize_filename(filename):
    # Lowercase
    new_name = filename.lower()
    # Replace spaces with hyphens
    new_name = new_name.replace(" ", "-")
    # Remove parentheses
    new_name = new_name.replace("(", "").replace(")", "")
    return new_name

def main():
    images_dir = r"g:\Code\file - Copy\images"
    base_dir = r"g:\Code\file - Copy"
    
    files_to_update = [
        "index.html",
        "app.js",
        "style.css",
        "products.js"
    ]
    
    renames = {}
    
    for filename in os.listdir(images_dir):
        if filename.startswith('.'): continue
        new_name = normalize_filename(filename)
        if new_name != filename:
            old_path = os.path.join(images_dir, filename)
            new_path = os.path.join(images_dir, new_name)
            
            # Handle case-only renames on Windows by using a temp name first if they clash case-insensitively
            if new_name.lower() == filename.lower():
                temp_path = os.path.join(images_dir, new_name + ".tmp")
                os.rename(old_path, temp_path)
                os.rename(temp_path, new_path)
            else:
                os.rename(old_path, new_path)
                
            renames[filename] = new_name
            print(f"Renamed: '{filename}' -> '{new_name}'")
            
    print(f"Total renames: {len(renames)}")
    
    for file_to_update in files_to_update:
        filepath = os.path.join(base_dir, file_to_update)
        if not os.path.exists(filepath):
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # Replace occurrences of old filenames
        for old_name, new_name in renames.items():
            # We want to match things like "images/aerial commet.jpg"
            # It could be url('images/...') or src="images/..."
            content = content.replace(f"images/{old_name}", f"images/{new_name}")
            # Also replace in case they used different quoting
            content = content.replace(f"images/{old_name.replace(' ', '%20')}", f"images/{new_name}")
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated references in: {file_to_update}")

if __name__ == '__main__':
    main()
