const fs = require('fs');

function wrapFile(path, title, activeMenu) {
    let content = fs.readFileSync(path, 'utf8');

    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
    const bodyMatch = content.match(/<div class="page">([\s\S]*?)<\/div>\s*<\/body>/);
    const topbarMatch = content.match(/<div class="topbar">(.*?)<\/div>/);

    const style = styleMatch ? styleMatch[1] : '';
    const body = bodyMatch ? bodyMatch[1] : content;
    const topbarText = topbarMatch ? topbarMatch[1] : title;

    const newContent = `<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
${style}
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
                    <h4 class="mb-0 header-title"><i class="bi bi-tag-fill me-2"></i>${topbarText}</h4>
                </div>
                <!-- Content injected here -->
                <div class="page" style="max-width: 100%; margin: 0; background: transparent; padding: 0;">
${body}
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="sidebar.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const sidebar = new SidebarSystem("admin", "${activeMenu}");
            sidebar.render();
            
            const sess = localStorage.getItem("IBOCS_user");
            if(sess) {
                const user = JSON.parse(sess);
                const ub = document.getElementById("userBtn");
                if(ub) ub.textContent = user.name || "Admin";
                const ui = document.getElementById("userInfo");
                if(ui) ui.textContent = \`\${user.email} • role=\${user.role}\`;
            }

            const blo = document.getElementById("btnLogout");
            if(blo) {
                blo.addEventListener("click", () => {
                    localStorage.removeItem("IBOCS_user");
                    window.location.href = "index.html";
                });
            }
        });
    </script>
</body>
</html>
`;

    fs.writeFileSync(path, newContent, 'utf8');
}

wrapFile('d:/STEM/IBOCS2/IBOCS/IBOCS/HTML/src/main/resources/static/admin_PLList.html', 'Price List Management', 'PriceList');
wrapFile('d:/STEM/IBOCS2/IBOCS/IBOCS/HTML/src/main/resources/static/admin_PLadd.html', 'Add Price List', 'PriceListAdd');

console.log("Success");


