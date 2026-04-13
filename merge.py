import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_metadata(content):
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    style = style_match.group(1) if style_match else ''
    
    body_match = re.search(r'<body>\s*<div class="page">(.*?)</div>\s*</body>', content, re.DOTALL)
    if not body_match:
        body_match = re.search(r'<body>(.*?)</body>', content, re.DOTALL)
    
    body = body_match.group(1) if body_match else ''
    
    script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
    script = script_match.group(1) if script_match else ''
    
    return style, body, script

list_content = read_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_Billinglist.html')
detail_content = read_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_Billing.html')

s1, b1, sc1 = extract_metadata(list_content)
s2, b2, sc2 = extract_metadata(detail_content)

merged_style = s1 + "\n/* DETAIL STYLES START */\n" + s2

b1 = b1.replace('href="#"', 'href="javascript:void(0)" onclick="showDetail()"')
b1 = b1.replace('class="btn btn-primary">+ Add New Billing', 'class="btn btn-primary" onclick="showDetail()">+ Add New Billing')
b1 = b1.replace('class="btn-xs btn-open">Open', 'class="btn-xs btn-open" onclick="showDetail()">Open')

b2 = b2.replace('class="btn btn-secondary">Back</button>', 'class="btn btn-secondary" onclick="showList()">Back</button>')

merged_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Billing Management</title>
    <style>{merged_style}</style>
</head>
<body>
    <div class="page">
        <div id="section-list">
{b1}
        </div>
        <div id="section-detail" style="display:none;">
{b2}
        </div>
    </div>
    
    <script>
        function showDetail() {{
            document.getElementById('section-list').style.display = 'none';
            document.getElementById('section-detail').style.display = 'block';
        }}

        function showList() {{
            document.getElementById('section-detail').style.display = 'none';
            document.getElementById('section-list').style.display = 'block';
        }}
        {sc1}
        {sc2}
    </script>
</body>
</html>
"""

with open(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_Billing.html', 'w', encoding='utf-8') as f:
    f.write(merged_html)

print("Merged successfully")

