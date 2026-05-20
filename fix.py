import os
pages = ['journey', 'research', 'awards', 'teaching', 'contact']
for p in pages:
    os.makedirs(f'src/app/{p}', exist_ok=True)
    with open(f'src/app/{p}/page.tsx', 'w') as f:
        f.write(f'"use client";\nimport {p.capitalize()}Page from \'../../views/{p.capitalize()}Page\';\nexport default function Page() {{ return <{p.capitalize()}Page />; }}\n')

with open('src/app/page.tsx', 'w') as f:
    f.write('"use client";\nimport HomePage from \'../views/HomePage\';\nexport default function Page() { return <HomePage />; }\n')
