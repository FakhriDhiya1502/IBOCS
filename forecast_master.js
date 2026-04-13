/**
 * forecast_master.js
 * Master forecast data shared across IBOCS pages.
 * Loaded as a script tag so it is available synchronously.
 *
 * Item codes align with master_data.js:
 *   Feed / Pakan → FEED-001..FEED-006  (vendor: SIC)
 *   DOC  / Chick → DOC-001..DOC-008   (vendor: CTU)
 *
 * Pages that use localStorage (IBOCS_fc_list) should merge stored records
 * with this array, prioritising stored records to avoid duplicates.
 */
window.IBOCS_FORECAST_MASTER = [
    {
        fcNo: "FC-001",
        fcDate: "2026-04-29",
        period: "Week 18",
        company: "PT TOP Distribusi",
        customerCode: "CUST-001",
        farm: "Farm Deli",
        warehouse: "WH-KDG01",
        planNo: "PL-001",
        planDesc: "Broiler Cycle 18",
        status: "Confirmed",
        age: "18 weeks",
        docCodeMale: "DOC-001",
        docNameMale: "DOC Broiler Cobb 500 (M)",
        docCodeFemale: "DOC-002",
        docNameFemale: "DOC Broiler Cobb 500 (F)",
        initialStock: "10,000 / 10,000",
        currentPop: "9,800 / 9,750",
        totalPop: "19,550",
        lines: [
            {
                itemCode: "FEED-002",
                itemName: "Pakan Starter (BR-1)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 8000,
                currentStock: 500,
                recommendedQty: 7500,
                manualAdjustment: 300
            },
            {
                itemCode: "FEED-003",
                itemName: "Pakan Grower (BR-2)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 6000,
                currentStock: 500,
                recommendedQty: 5500,
                manualAdjustment: 200
            }
        ]
    },
    {
        fcNo: "FC-002",
        fcDate: "2026-04-29",
        period: "Week 18",
        company: "PT TOP Distribusi",
        customerCode: "CUST-001",
        farm: "Farm Deli",
        warehouse: "WH-KDG02",
        planNo: "PL-002",
        planDesc: "Broiler Cycle 18",
        status: "Confirmed",
        age: "18 weeks",
        docCodeMale: "DOC-003",
        docNameMale: "DOC Broiler Ross 308 (M)",
        docCodeFemale: "DOC-004",
        docNameFemale: "DOC Broiler Ross 308 (F)",
        initialStock: "12,000 / 12,000",
        currentPop: "11,800 / 11,700",
        totalPop: "23,500",
        lines: [
            {
                itemCode: "FEED-002",
                itemName: "Pakan Starter (BR-1)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 8500,
                currentStock: 500,
                recommendedQty: 8000,
                manualAdjustment: 0
            },
            {
                itemCode: "FEED-004",
                itemName: "Pakan Finisher (BR-3)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 7500,
                currentStock: 500,
                recommendedQty: 7000,
                manualAdjustment: 0
            }
        ]
    },
    {
        fcNo: "FC-003",
        fcDate: "2026-04-28",
        period: "Week 18",
        company: "PT AYM (Ayam Yummy Makmur)",
        customerCode: "CUST-002",
        farm: "Farm Binjai",
        warehouse: "WH-KDG03",
        planNo: "PL-008",
        planDesc: "Broiler Cycle 21",
        status: "PO Created",
        age: "21 weeks",
        docCodeMale: "DOC-007",
        docNameMale: "DOC Hubbard (M)",
        docCodeFemale: "DOC-008",
        docNameFemale: "DOC Hubbard (F)",
        initialStock: "8,000 / 8,000",
        currentPop: "7,800 / 7,700",
        totalPop: "15,500",
        lines: [
            {
                itemCode: "FEED-002",
                itemName: "Pakan Starter (BR-1)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 6500,
                currentStock: 300,
                recommendedQty: 6200,
                manualAdjustment: 0
            },
            {
                itemCode: "FEED-003",
                itemName: "Pakan Grower (BR-2)",
                vendorCode: "VND-SIC",
                flag: "Manual",
                standardNeed: 5000,
                currentStock: 700,
                recommendedQty: 0,
                manualAdjustment: 4300
            }
        ]
    },
    {
        fcNo: "FC-004",
        fcDate: "2026-05-06",
        period: "Week 19",
        company: "PT TOP Distribusi",
        customerCode: "CUST-001",
        farm: "Farm Deli",
        warehouse: "WH-KDG01",
        planNo: "PL-003",
        planDesc: "Broiler Cycle 19",
        status: "Confirmed",
        age: "19 weeks",
        docCodeMale: "DOC-001",
        docNameMale: "DOC Broiler Cobb 500 (M)",
        docCodeFemale: "DOC-002",
        docNameFemale: "DOC Broiler Cobb 500 (F)",
        initialStock: "11,000 / 11,000",
        currentPop: "10,700 / 10,650",
        totalPop: "21,350",
        lines: [
            {
                itemCode: "FEED-002",
                itemName: "Pakan Starter (BR-1)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 9000,
                currentStock: 400,
                recommendedQty: 8600,
                manualAdjustment: 0
            },
            {
                itemCode: "FEED-003",
                itemName: "Pakan Grower (BR-2)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 7000,
                currentStock: 600,
                recommendedQty: 6400,
                manualAdjustment: 500
            },
            {
                itemCode: "FEED-004",
                itemName: "Pakan Finisher (BR-3)",
                vendorCode: "VND-SIC",
                flag: "Manual",
                standardNeed: 5000,
                currentStock: 200,
                recommendedQty: 4800,
                manualAdjustment: 200
            }
        ]
    },
    {
        fcNo: "FC-005",
        fcDate: "2026-05-13",
        period: "Week 20",
        company: "PT AYM (Ayam Yummy Makmur)",
        customerCode: "CUST-002",
        farm: "Farm Binjai",
        warehouse: "WH-KDG02",
        planNo: "PL-009",
        planDesc: "Broiler Cycle 22",
        status: "Confirmed",
        age: "22 weeks",
        docCodeMale: "DOC-005",
        docNameMale: "DOC Layer Lohmann (M)",
        docCodeFemale: "DOC-006",
        docNameFemale: "DOC Layer Lohmann (F)",
        initialStock: "9,500 / 9,500",
        currentPop: "9,300 / 9,200",
        totalPop: "18,500",
        lines: [
            {
                itemCode: "FEED-004",
                itemName: "Pakan Finisher (BR-3)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 9500,
                currentStock: 800,
                recommendedQty: 8700,
                manualAdjustment: 0
            },
            {
                itemCode: "FEED-003",
                itemName: "Pakan Grower (BR-2)",
                vendorCode: "VND-SIC",
                flag: "Manual",
                standardNeed: 6000,
                currentStock: 300,
                recommendedQty: 5700,
                manualAdjustment: 300
            }
        ]
    },
    {
        fcNo: "FC-006",
        fcDate: "2026-05-20",
        period: "Week 21",
        company: "PT BMAX",
        customerCode: "CUST-003",
        farm: "Farm BMAX",
        warehouse: "WH-KDG02",
        planNo: "PL-010",
        planDesc: "Layer Cycle 1",
        status: "Draft",
        age: "21 weeks",
        docCodeMale: "DOC-005",
        docNameMale: "DOC Layer Lohmann (M)",
        docCodeFemale: "DOC-006",
        docNameFemale: "DOC Layer Lohmann (F)",
        initialStock: "9,500 / 9,500",
        currentPop: "9,500 / 9,500",
        totalPop: "19,000",
        lines: [
            {
                itemCode: "FEED-005",
                itemName: "Pakan Layer (L-1)",
                vendorCode: "VND-SIC",
                flag: "Auto",
                standardNeed: 10000,
                currentStock: 200,
                recommendedQty: 9800,
                manualAdjustment: 0
            }
        ]
    }
];
