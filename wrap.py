import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

billing = read_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_Billing.html')
forecast = read_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_forecastlist.html')

top_nav_match = re.search(r'(<nav.*?</nav>)', forecast, re.DOTALL)
sidebar_match = re.search(r'(<!-- Sidebar -->.*?</div>)', forecast, re.DOTALL)
footer_match = re.search(r'(<div class="text-center text-muted small mt-4 mb-2">.*?</div>)', forecast, re.DOTALL)

style_match = re.search(r'<style>(.*?)</style>', billing, re.DOTALL)

# Extract everything between <div class="page"> and the <script> 
# Wait, billing has two pages now? I merged them inside <div class="page">
body_match = re.search(r'<body>\s*<div class="page">(.*?)</div>\s*<script>', billing, re.DOTALL)
if not body_match:
    body_content_match = re.search(r'<body>(.*?)</body', billing, re.DOTALL)
    body_html = body_content_match.group(1) if body_content_match else ''
    
    # Try getting everything before script
    body_part_match = re.search(r'(.*?)<script>', body_html, re.DOTALL)
    if body_part_match:
        body = body_part_match.group(1)
    else:
        body = body_html
else:
    body = body_match.group(1)
    
script_match = re.search(r'<script>(.*?)</script>', billing, re.DOTALL)

new_billing = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Distributor | Billing Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
""" + (style_match.group(1) if style_match else '') + """
    </style>
</head>
<body>
    <!-- Topbar -->
    """ + (top_nav_match.group(1) if top_nav_match else '') + """

    <div class="container-fluid py-3">
        <div class="row g-3">
            
            """ + (sidebar_match.group(1) if sidebar_match else '') + """

            <!-- Main -->
            <div class="col-lg-10">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0 text-success fw-bold"><i class="bi bi-receipt me-2"></i>Billing Management</h4>
                </div>

                <div class="page shadow-sm" style="max-width: 100%; border-radius: 12px; background: #fff; padding: 24px;">
""" + body + """
                </div>
                """ + (footer_match.group(1) if footer_match else '') + """
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="sidebar.js"></script>
    <script>
        // =========================
        // SESSION GUARD
        // =========================
        const sess = localStorage.getItem("ibocs_user");
        if (!sess) window.location.href = "login.html?role=distributor";
        const user = JSON.parse(sess);

        document.getElementById("userBtn").textContent = user.name || "User";
        document.getElementById("userInfo").textContent = `${user.email} • role=${user.role}`;

        document.getElementById("btnLogout").addEventListener("click", () => {
            localStorage.removeItem("ibocs_user");
            window.location.href = "index.html";
        });

        // =========================
        // SIDEBAR INJECTION
        // =========================
        document.addEventListener("DOMContentLoaded", () => {
            const sidebar = new SidebarSystem("distributor", "billing");
            sidebar.render();
        });

        """ + (script_match.group(1) if script_match else '') + """
    </script>
</body>
</html>
"""

with open(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\distributor_Billing.html', 'w', encoding='utf-8') as f:
    f.write(new_billing)

print("Wrapped successfully")

