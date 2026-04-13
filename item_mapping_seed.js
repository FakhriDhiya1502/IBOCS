/**
 * Seed data for IBOCS Item Mappings
 * Run this in the browser console or include it in a script tag to populate localStorage.
 */

const itemMappingsSeed = {
    // C-AYM (Customer) mapping to V-BMAX (Vendor Vendor) - Diversified 15 Items
    "C-AYM|V-BMAX": {
        // Simple mapping
        "PKN-001": [{ "targetId": "PKN-001", "multiplier": 1, "uom": "Kg" }],
        // Qty/UoM Conversion
        "PKN-002": [{ "targetId": "PKN-002", "multiplier": 1000, "uom": "Gram" }],
        // Cross-ID Mapping (Different item IDs)
        "PKN-003": [{ "targetId": "PKN-008", "multiplier": 1, "uom": "Kg" }], // Pakan Finisher mapped to Jagung Giling
        "PKN-004": [{ "targetId": "PKN-010", "multiplier": 0.8, "uom": "Kg" }], // Pakan mapped to Bungkil Kedelai (substitute)
        // 1-to-Many Bundle Mapping
        "PKN-005": [
            { "targetId": "PKN-001", "multiplier": 0.5, "uom": "Kg" },
            { "targetId": "PKN-013", "multiplier": 1, "uom": "Bungkus" }
        ],
        "PKN-006": [{ "targetId": "PKN-006", "multiplier": 1, "uom": "Kg" }],
        "PKN-007": [{ "targetId": "PKN-012", "multiplier": 0.5, "uom": "Kg" }], // Different Item
        "PKN-008": [{ "targetId": "PKN-008", "multiplier": 1, "uom": "Kg" }],
        "PKN-009": [{ "targetId": "PKN-009", "multiplier": 1, "uom": "Kg" }],
        "PKN-010": [{ "targetId": "PKN-010", "multiplier": 1, "uom": "Kg" }],
        "AYM-001": [{ "targetId": "AYM-001", "multiplier": 1, "uom": "Ekor" }],
        "AYM-002": [{ "targetId": "AYM-004", "multiplier": 1, "uom": "Ekor" }], // Layer mapped to Pejantan
        "AYM-003": [{ "targetId": "AYM-003", "multiplier": 1, "uom": "Ekor" }],
        // Bundle 1-to-Many
        "AYM-004": [
            { "targetId": "AYM-004", "multiplier": 1, "uom": "Ekor" },
            { "targetId": "PKN-002", "multiplier": 2, "uom": "Kg" } // Chick plus initial feed
        ],
        "AYM-005": [{ "targetId": "AYM-005", "multiplier": 1, "uom": "Ekor" }]
    },
    
    // C-BMAX mapping to V-CTU - 12 Items
    "C-BMAX|V-CTU": {
        "PKN-011": [{ "targetId": "PKN-011", "multiplier": 1, "uom": "Kg" }],
        "PKN-012": [{ "targetId": "PKN-015", "multiplier": 1.2, "uom": "Kg" }], // Cross mapping
        "PKN-013": [{ "targetId": "PKN-013", "multiplier": 1, "uom": "Bungkus" }],
        // Bundle
        "PKN-014": [
            { "targetId": "PKN-014", "multiplier": 1, "uom": "Kg" },
            { "targetId": "PKN-010", "multiplier": 0.2, "uom": "Kg" }
        ],
        "PKN-015": [{ "targetId": "PKN-015", "multiplier": 1, "uom": "Kg" }],
        "AYM-006": [{ "targetId": "AYM-006", "multiplier": 1, "uom": "Ekor" }],
        "AYM-007": [{ "targetId": "AYM-007", "multiplier": 1, "uom": "Ekor" }],
        "AYM-008": [{ "targetId": "AYM-008", "multiplier": 1, "uom": "Ekor" }],
        "AYM-009": [{ "targetId": "AYM-011", "multiplier": 1, "uom": "Ekor" }], // Cross mapping
        "AYM-010": [{ "targetId": "AYM-010", "multiplier": 1, "uom": "Ekor" }],
        "AYM-011": [{ "targetId": "AYM-011", "multiplier": 1, "uom": "Ekor" }],
        "AYM-012": [{ "targetId": "AYM-012", "multiplier": 1, "uom": "Ekor" }]
    },
    
    // V-TOP mapping to C-AYM - 10 Items
    "V-TOP|C-AYM": {
        "PKN-001": [{ "targetId": "PKN-001", "multiplier": 1, "uom": "Kg" }],
        "PKN-005": [{ "targetId": "PKN-005", "multiplier": 1, "uom": "Zak" }],
        "PKN-010": [{ "targetId": "PKN-010", "multiplier": 1, "uom": "Kg" }],
        "AYM-001": [{ "targetId": "AYM-001", "multiplier": 1, "uom": "Ekor" }],
        "AYM-005": [{ "targetId": "AYM-005", "multiplier": 1, "uom": "Ekor" }],
        "AYM-010": [{ "targetId": "AYM-010", "multiplier": 1, "uom": "Ekor" }],
        "AYM-013": [{ "targetId": "AYM-013", "multiplier": 1, "uom": "Ekor" }],
        "AYM-014": [{ "targetId": "AYM-014", "multiplier": 1, "uom": "Ekor" }],
        "AYM-015": [{ "targetId": "AYM-015", "multiplier": 1, "uom": "Ekor" }],
        "PKN-012": [{ "targetId": "PKN-012", "multiplier": 1, "uom": "Kg" }]
    },

    // V-CTU mapping to C-TOP - 10 Items
    "V-CTU|C-TOP": {
        "AYM-005": [
            { "targetId": "AYM-005", "multiplier": 1, "uom": "Ekor" },
            { "targetId": "PKN-001", "multiplier": 0.5, "uom": "Kg" }
        ],
        "AYM-001": [{ "targetId": "AYM-001", "multiplier": 1, "uom": "Ekor" }],
        "AYM-002": [{ "targetId": "AYM-002", "multiplier": 1, "uom": "Ekor" }],
        "AYM-003": [{ "targetId": "AYM-003", "multiplier": 1, "uom": "Ekor" }],
        "AYM-004": [{ "targetId": "AYM-004", "multiplier": 1, "uom": "Ekor" }],
        "PKN-001": [{ "targetId": "PKN-001", "multiplier": 1, "uom": "Kg" }],
        "PKN-002": [{ "targetId": "PKN-002", "multiplier": 1, "uom": "Kg" }],
        "PKN-003": [{ "targetId": "PKN-003", "multiplier": 1, "uom": "Kg" }],
        "PKN-004": [{ "targetId": "PKN-004", "multiplier": 1, "uom": "Kg" }],
        "PKN-015": [{ "targetId": "PKN-015", "multiplier": 1, "uom": "Kg" }]
    }
};

// Function to seed the data - Force seeding for demo
function seedIBOCSMappings() {
    localStorage.setItem('IBOCS_master_mappings', JSON.stringify(itemMappingsSeed));
    console.log("IBOCS Item Mappings seeded successfully!");
}

// Automatically seed on load to ensure data is there for demo
seedIBOCSMappings();
console.log("Item Mappings storage updated with sample data.");


