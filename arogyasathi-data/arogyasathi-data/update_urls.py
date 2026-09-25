import os, re

src_dir = 'd:/Hack odyseey/arogyasathi-data/arogyasathi-data/frontend/src'
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # This matches 'http://localhost:4000/api/v1...', "http://localhost:4000/api/v1...", and `http://localhost:4000/api/v1...`
            new_content = re.sub(
                r'[\'"`]http://localhost:4000(/api/v1.*?)[\'"`]',
                r'`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:4000\'}\1`',
                content
            )
            
            if content != new_content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f'Updated {path}')
