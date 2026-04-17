/**
 * iBOCS Sidebar Component
 * Unified sidebar for all roles with 3 core menu items.
 */

class SidebarSystem {
    constructor(role, activePageId) {
        // Auto-read role from session if not provided
        if (!role) {
            try {
                const userData = JSON.parse(localStorage.getItem("IBOCS_user") || "{}");
                this.role = userData.role || "vendor";
            } catch(e) {
                this.role = "vendor";
            }
        } else {
            this.role = role;
        }
        this.activePageId = activePageId;
        this.containerId = "sidebar-container";
        this.themeColor = "#1a237e"; // Deep Sapphire
    }

    getMenuItems() {
        const allItems = [
            { id: "forecast_dashboard", label: "Dashboard",           icon: "bi-speedometer2",    url: "forecast_dashboard.html",             roles: ["customer", "vendor", "super_admin"] },
            { id: "forecast",           label: "Forecast",           icon: "bi-graph-up-arrow",  url: "customer_ForecastList.html",            roles: ["customer", "super_admin"] },
            { id: "orders",             label: "Purchase Order",     icon: "bi-list-ul",         url: "customer_orders.html",                  roles: ["customer", "super_admin"] },
            { id: "incoming_po",        label: "Sales Order",        icon: "bi-check2-square",   url: "vendor_incoming_po_list.html",          roles: ["vendor", "super_admin"] },
            { id: "po_so_monitor",      label: "Transaction Monitoring", icon: "bi-arrow-left-right", url: "po_so_monitor.html",                roles: ["customer", "vendor", "super_admin"] },
            { id: "settings",           label: "Settings",           icon: "bi-gear",            url: "admin_settings.html",                   roles: ["admin", "super_admin"] },
        ];

        if (this.role === "super_admin") return allItems;

        return allItems.filter(item => item.roles.includes(this.role));
    }

    buildList(items) {
        return items.map(item => {
            const isActive = this.activePageId === item.id;
            const activeStyle = isActive
                ? `background-color: ${this.themeColor}; color: #fff;`
                : `background-color: transparent; color: #374151;`;
            return `
                <a href="${item.url}"
                   class="list-group-item list-group-item-action border-0 rounded mb-1 d-flex align-items-center gap-2"
                   style="${activeStyle} padding: 10px 14px; font-size: 14px; font-weight: ${isActive ? '700' : '500'}; text-decoration: none;">
                    <i class="bi ${item.icon}" style="font-size:15px;"></i>
                    ${item.label}
                </a>`;
        }).join("");
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.classList.add("d-none", "d-lg-block");

        const items = this.getMenuItems();
        const listHtml = this.buildList(items);
        const logoutHtml = `
            <div class="dropdown-divider my-3"></div>
            <a href="login.html"
               onclick="localStorage.removeItem('IBOCS_user')"
               class="list-group-item list-group-item-action border-0 rounded d-flex align-items-center gap-2"
               style="background: transparent; color: #dc3545; font-size: 14px; font-weight: 500; text-decoration: none; padding: 10px 14px;">
                <i class="bi bi-box-arrow-left" style="font-size:15px;"></i> Logout
            </a>`;

        container.innerHTML = `
            <div class="card border-0 shadow-sm" style="min-height: calc(100vh - 80px); background: #f8f9fa; border-radius: 12px;">
                <div class="card-body p-2">
                    <div class="list-group list-group-flush">
                        ${listHtml}
                        ${logoutHtml}
                    </div>
                </div>
            </div>`;

        // Update navbar brand color
        const brand = document.querySelector(".navbar-brand");
        if (brand) {
            brand.style.color = this.themeColor;
            brand.style.fontWeight = "800";
        }

        // Mobile offcanvas
        const navbar = document.querySelector(".navbar .container-fluid");
        if (navbar && !document.getElementById("mobileSidebarToggle")) {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "navbar-toggler d-block d-lg-none me-2 border-0";
            toggleBtn.id = "mobileSidebarToggle";
            toggleBtn.type = "button";
            toggleBtn.setAttribute("data-bs-toggle", "offcanvas");
            toggleBtn.setAttribute("data-bs-target", "#offcanvasSidebar");
            toggleBtn.innerHTML = '<span class="navbar-toggler-icon"></span>';
            const brandEl = navbar.querySelector(".navbar-brand");
            if (brandEl) brandEl.parentNode.insertBefore(toggleBtn, brandEl);
        }

        if (!document.getElementById("offcanvasSidebar")) {
            const offcanvasDiv = document.createElement("div");
            offcanvasDiv.className = "offcanvas offcanvas-start";
            offcanvasDiv.tabIndex = -1;
            offcanvasDiv.id = "offcanvasSidebar";
            offcanvasDiv.innerHTML = `
                <div class="offcanvas-header border-bottom">
                    <h5 class="offcanvas-title fw-bold" style="color: ${this.themeColor}">iBOCS</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body p-2">
                    <div class="list-group list-group-flush">
                        ${listHtml}
                        ${logoutHtml}
                    </div>
                </div>`;
            document.body.appendChild(offcanvasDiv);
        }
    }
}
