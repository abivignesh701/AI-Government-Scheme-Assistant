import os
import json

next_dir = 'd:/Hack odyseey/arogyasathi-data/arogyasathi-data/frontend/.next'
frontend_dir = 'd:/Hack odyseey/arogyasathi-data/arogyasathi-data/frontend'
recovered_files = set()

def recover_from_sourcemap(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        return
    
    if 'sources' in data and 'sourcesContent' in data:
        for i, source in enumerate(data['sources']):
            # source could be like "webpack://_N_E/src/app/page.tsx" or "file://D:/.../src/app/page.tsx"
            # or just relative to something. We need to match it to 'src/' files.
            if 'src/' in source:
                # Extract everything from 'src/' onwards
                src_path = source[source.find('src/'):]
                # Sometimes it has webpack query params like src/app/page.tsx?b3f2
                src_path = src_path.split('?')[0]
                
                content = data['sourcesContent'][i]
                if not content:
                    continue
                    
                target_path = os.path.join(frontend_dir, src_path.replace('/', os.sep))
                
                if target_path not in recovered_files:
                    # check if the file currently exists and is 0 bytes
                    if os.path.exists(target_path) and os.path.getsize(target_path) == 0:
                        os.makedirs(os.path.dirname(target_path), exist_ok=True)
                        with open(target_path, 'w', encoding='utf-8') as tf:
                            tf.write(content)
                        recovered_files.add(target_path)
                        print(f"Recovered {src_path}")

for root, _, files in os.walk(next_dir):
    for f in files:
        if f.endswith('.map') or f.endswith('.json') or f.endswith('.js'):
            # Some turbopack chunks contain source code inline or map data
            recover_from_sourcemap(os.path.join(root, f))

print(f"Recovered {len(recovered_files)} files total.")
