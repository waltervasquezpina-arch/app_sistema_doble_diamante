import os
import re

def fix_seo():
    html_files = []
    # Find all html files recursively, excluding .agents folder
    for root, dirs, files in os.walk('.'):
        if '.agents' in root.split(os.sep):
            continue
        for file in files:
            if file.endswith('.html') or file.endswith('.htm'):
                html_files.append(os.path.join(root, file))

    print(f"Found {len(html_files)} HTML files to process.")

    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Parse title
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        if not title_match:
            print(f"No title found in {file_path}, skipping.")
            continue

        title_text = title_match.group(1).strip()
        
        # Check if tags already exist
        has_desc = 'name="description"' in content.lower() or "name='description'" in content.lower()
        has_og = 'og:' in content or 'property="og:' in content.lower()

        if has_desc and has_og:
            print(f"SEO tags already present in {file_path}, skipping.")
            continue

        seo_tags = []
        if not has_desc:
            seo_tags.append(f'    <meta name="description" content="Herramienta {title_text} - Portafolio Institucional de Innovación Pública (PIIP) de AGROIDEAS.">')
        if not has_og:
            seo_tags.append(f'    <meta property="og:title" content="{title_text}">')
            seo_tags.append(f'    <meta property="og:description" content="Herramienta {title_text} - Portafolio Institucional de Innovación Pública (PIIP) de AGROIDEAS.">')

        if seo_tags:
            # Insert after </title>
            replacement = "</title>\n" + "\n".join(seo_tags)
            new_content = re.sub(r'</title>', replacement, content, flags=re.IGNORECASE)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated SEO tags for {file_path}")

if __name__ == "__main__":
    fix_seo()
