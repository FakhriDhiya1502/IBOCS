import re

def wrap_file(path, title, active_menu="PriceList"):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    body_match = re.search(r'<div class="page">(.*?)</div>\s*</body>', content, re.DOTALL)

    style = style_match.group(1) if style_match else ''
    body = body_match.group(1) if body_match else content

    # Get original topbar text
    topbar_match = re.search(r'<div class="topbar">(.*?)</div>', content)
    topbar_text = topbar_match.group(1) if topbar_match else title

    new_content = """<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>""" + title + """</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
""" + style + """
        body { background: #f4f6f9; }
        .sidebar { min-height: calc(100vh - 56px); }
        .nav-pill { border-radius: 10px; }
        .header-title { font-weight: 700; color: #1f4e79; }
    </style>
</head>
<body>
    <!-- Topbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid px-3">
            <a class="navbar-brand fw-bold" href="admin_dashboard.html">
                <i class="bi bi-shield-lock-fill me-2"></i>IBOCS Admin
            </a>
            <span class="navbar-text text-white-50 small d-none d-md-inline">Platform Management</span>

            <div class="ms-auto d-flex align-items-center gap-2">
                <div class="dropdown">
                    <button class="btn btn-outline-light btn-sm dropdown-toggle" data-bs-toggle="dropdown"
                        id="userBtn">Admin</button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><span class="dropdown-item-text small text-muted" id="userInfo">-</span></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="index.html">Switch Portal</a></li>
                        <li><button class="dropdown-item text-danger" id="btnLogout">Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <div class="container-fluid py-3">
        <div class="row g-3">
            <!-- Sidebar -->
            <div class="col-lg-2" id="sidebar-container"></div>

            <!-- Main -->
            <div class="col-lg-10">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0 header-title"><i class="bi bi-tag-fill me-2"></i>""" + topbar_text + """</h4>
                </div>
                <!-- Content injected here -->
                <div class="page" style="max-width: 100%; margin: 0;">
""" + body + """
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="sidebar.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const sidebar = new SidebarSystem("admin", \"""" + active_menu + """\");
            sidebar.render();
            
            const sess = localStorage.getItem("ibocs_user");
            if(sess) {
                const user = JSON.parse(sess);
                const ub = document.getElementById("userBtn");
                if(ub) ub.textContent = user.name || "Admin";
                const ui = document.getElementById("userInfo");
                if(ui) ui.textContent = `${user.email} • role=${user.role}`;
            }

            const blo = document.getElementById("btnLogout");
            if(blo) {
                blo.addEventListener("click", () => {
                    localStorage.removeItem("ibocs_user");
                    window.location.href = "index.html";
                });
            }
        });
    </script>
</body>
</html>
"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

wrap_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\admin_PLList.html', 'Price List Management', 'PriceList')
wrap_file(r'd:\STEM\IBOCS2\IBOCS\IBOCS\HTML\src\main\resources\static\admin_PLadd.html', 'Add Price List', 'PriceListAdd')

print("Success")

