import re

file_path = r'd:\Ourcompany\web-app\src\App.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the labels
content = re.sub(r'[ \t]*<span className="mono">\[.*?\]</span>\r?\n', '', content)
content = re.sub(r'[ \t]*<p className="mono"[^>]*>\[.*?\]</p>\r?\n', '', content)
content = re.sub(r'[ \t]*<span className="mono"[^>]*>\[.*?\]</span>\r?\n', '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
