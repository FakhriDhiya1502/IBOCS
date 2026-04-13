/**
 * master_data.js
 * IBOCS Master Data — Single source of truth for Item, Customer, Vendor, Warehouse.
 * Include as a <script> tag before any page scripts that need master data.
 *
 * Item categories:
 *   "Feed" — supplied by VND-SIC (SIC)
 *   "DOC"  — supplied by VND-CTU (CTU)
 */

window.IBOCS_MASTER = {

    /* ─────────────────────────────────────────────────────────────
       ITEMS
    ───────────────────────────────────────────────────────────── */
    items: [
        // ── Feed / Pakan (Vendor: SIC) ──────────────────────────
        { code: "FEED-001", name: "Pakan Pre-Starter (S-0)",  category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 52000 },
        { code: "FEED-002", name: "Pakan Starter (BR-1)",      category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 50000 },
        { code: "FEED-003", name: "Pakan Grower (BR-2)",       category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 48000 },
        { code: "FEED-004", name: "Pakan Finisher (BR-3)",     category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 46000 },
        { code: "FEED-005", name: "Pakan Layer (L-1)",         category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 49000 },
        { code: "FEED-006", name: "Pakan Petelur Konsentrat",  category: "Feed", vendor: "VND-SIC", uom: "Kg",  price: 55000 },

        // ── DOC / Day-Old-Chick (Vendor: CTU) ───────────────────
        { code: "DOC-001",  name: "DOC Broiler Cobb 500 (M)",  category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  7500 },
        { code: "DOC-002",  name: "DOC Broiler Cobb 500 (F)",  category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  7000 },
        { code: "DOC-003",  name: "DOC Broiler Ross 308 (M)",  category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  8000 },
        { code: "DOC-004",  name: "DOC Broiler Ross 308 (F)",  category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  7500 },
        { code: "DOC-005",  name: "DOC Layer Lohmann (M)",     category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price: 12000 },
        { code: "DOC-006",  name: "DOC Layer Lohmann (F)",     category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price: 11000 },
        { code: "DOC-007",  name: "DOC Hubbard (M)",           category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  9000 },
        { code: "DOC-008",  name: "DOC Hubbard (F)",           category: "DOC",  vendor: "VND-CTU", uom: "Ekor", price:  8500 }
    ],

    /* ─────────────────────────────────────────────────────────────
       CUSTOMERS
    ───────────────────────────────────────────────────────────── */
    customers: [
        {
            code: "CUST-001",
            name: "PT TOP Distribusi",
            shortName: "TOP",
            contact: "Budi Santoso",
            phone: "0812-1111-0001",
            email: "top@ibocs.id",
            address: "Jl. Distribusi No. 1, Medan, Sumatera Utara",
            farm: "Farm Deli"
        },
        {
            code: "CUST-002",
            name: "PT AYM (Ayam Yummy Makmur)",
            shortName: "AYM",
            contact: "Dewi Rahayu",
            phone: "0812-2222-0002",
            email: "aym@ibocs.id",
            address: "Jl. Poultry No. 12, Binjai, Sumatera Utara",
            farm: "Farm Binjai"
        },
        {
            code: "CUST-003",
            name: "PT BMAX",
            shortName: "BMAX",
            contact: "Andi Susanto",
            phone: "0812-3333-0003",
            email: "bmax@ibocs.id",
            address: "Jl. Farm Raya No. 5, Binjai, Sumatera Utara",
            farm: "Farm BMAX"
        }
    ],

    /* ─────────────────────────────────────────────────────────────
       VENDORS
    ───────────────────────────────────────────────────────────── */
    vendors: [
        {
            code: "VND-SIC",
            name: "SIC",
            fullName: "SIC — Supplier Pakan & Feed",
            category: "Feed",
            contact: "Agus Prasetyo",
            phone: "0812-4444-0001",
            email: "sic@ibocs.id",
            address: "Jl. Industri Feed No. 7, Medan, Sumatera Utara"
        },
        {
            code: "VND-CTU",
            name: "CTU",
            fullName: "CTU — Supplier DOC / Bibit Ayam",
            category: "DOC",
            contact: "Rini Kusuma",
            phone: "0812-5555-0002",
            email: "ctu@ibocs.id",
            address: "Jl. Hatchery No. 3, Deli Serdang, Sumatera Utara"
        }
    ],

    /* ─────────────────────────────────────────────────────────────
       WAREHOUSES
    ───────────────────────────────────────────────────────────── */
    warehouses: [
        { code: "WH-KDG01", name: "Gudang Kandang 01", location: "Medan",         capacity: 50000 },
        { code: "WH-KDG02", name: "Gudang Kandang 02", location: "Deli Serdang",  capacity: 40000 },
        { code: "WH-KDG03", name: "Gudang Kandang 03", location: "Binjai",        capacity: 35000 }
    ]
};

/* ─────────────────────────────────────────────────────────────
   HELPER FUNCTIONS
───────────────────────────────────────────────────────────── */
const M = window.IBOCS_MASTER;

/** Lookup single item by code */
M.getItem = code => M.items.find(i => i.code === code) || null;

/** Lookup single customer by code */
M.getCustomer = code => M.customers.find(c => c.code === code) || null;

/** Lookup single vendor by code */
M.getVendor = code => M.vendors.find(v => v.code === code) || null;

/** Lookup single warehouse by code */
M.getWarehouse = code => M.warehouses.find(w => w.code === code) || null;

/** Filter items by category ("Feed" | "DOC") */
M.getItemsByCategory = cat => M.items.filter(i => i.category === cat);

/** Filter items by vendor code */
M.getItemsByVendor = vCode => M.items.filter(i => i.vendor === vCode);

/** Resolve vendor code from item code */
M.getVendorForItem = itemCode => {
    const item = M.getItem(itemCode);
    return item ? M.getVendor(item.vendor) : null;
};

/** Build <option> list for a <select> — optionally filtered by category */
M.buildItemOptions = (category = null) => {
    const list = category ? M.getItemsByCategory(category) : M.items;
    return list.map(i => `<option value="${i.code}">[${i.category}] ${i.code} — ${i.name} (${i.uom})</option>`).join("");
};

M.buildCustomerOptions = () =>
    M.customers.map(c => `<option value="${c.code}">${c.name}</option>`).join("");

M.buildVendorOptions = () =>
    M.vendors.map(v => `<option value="${v.code}">${v.name}</option>`).join("");

M.buildWarehouseOptions = () =>
    M.warehouses.map(w => `<option value="${w.code}">${w.code} — ${w.name} (${w.location})</option>`).join("");

console.log("[IBOCS] master_data.js loaded —",
    M.items.length, "items,",
    M.customers.length, "customers,",
    M.vendors.length, "vendors,",
    M.warehouses.length, "warehouses");
