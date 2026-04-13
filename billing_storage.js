(function () {
    const LS_BILLING = "IBOCS_batch_invoices";
    const LS_RETURN = "IBOCS_return_list";
    const LS_CREDIT_MEMO = "IBOCS_credit_memo_list";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("en-US");
    }

    function formatCurrency(value) {
        return `Rp ${formatNumber(value)}`;
    }

    function loadJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function toDisplayDate(value) {
        if (!value) return "-";
        const date = new Date(`${value}T00:00:00`);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/ /g, "-");
    }

    function getReturns() {
        const stored = JSON.parse(localStorage.getItem(LS_RETURN) || "[]");
        if (stored.length) return stored;
        // Seed minimal return data so customer list is available on first load
        const seed = [
            {
                no: "RET-202604-9001", date: "2026-04-06",
                customer: "Sunrise Bakery Mart", type: "Deduction",
                grpo: "GRPO-202604-0018", billingRef: "BILL-202604-0001",
                billingStatus: "Confirmed", qty: 6, amount: 108000,
                financialTreatment: "Credit Memo Required", status: "Submitted",
                lines: [{ itemCode: "BRD-001", itemName: "Butter Croissant", returnQty: 6 }]
            },
            {
                no: "RET-202604-9002", date: "2026-04-07",
                customer: "Sunrise Bakery Mart", type: "Deduction",
                grpo: "GRPO-202604-0018", billingRef: "BILL-202604-0001",
                billingStatus: "Confirmed", qty: 4, amount: 72000,
                financialTreatment: "Credit Memo Required", status: "Approved",
                lines: [{ itemCode: "BRD-001", itemName: "Butter Croissant", returnQty: 4 }]
            },
            {
                no: "RET-202604-9003", date: "2026-04-10",
                customer: "Golden Crust Bakery", type: "Deduction",
                grpo: "GRPO-202604-0019", billingRef: "BILL-202604-0002",
                billingStatus: "Draft", qty: 3, amount: 43500,
                financialTreatment: "Direct Billing Reduction", status: "Submitted",
                lines: [{ itemCode: "BRD-007", itemName: "Chocolate Donut", returnQty: 3 }]
            }
        ];
        localStorage.setItem(LS_RETURN, JSON.stringify(seed));
        return seed;
    }

    function getGrpoList() {
        return loadJson("IBOCS_grpo_list", []);
    }

    function getDoList() {
        const summary = loadJson("IBOCS_do_list", []);
        return summary.map(item => {
            const full = loadJson("IBOCS_do_" + item.id, null);
            return full || item;
        });
    }

    function getCustomerList() {
        const set = new Set();

        // From DO list summary — try store first, then customer
        const doSummary = loadJson("IBOCS_do_list", []);
        doSummary.forEach(d => {
            if (d.store) set.add(d.store);
            else if (d.customer) set.add(d.customer);
        });

        // Also load full DO records to catch any extra fields
        doSummary.forEach(d => {
            const full = loadJson("IBOCS_do_" + d.id, null);
            if (!full) return;
            if (full.store) set.add(full.store);
            else if (full.customer) set.add(full.customer);
        });

        // From GRPO records
        getGrpoList().forEach(g => {
            if (g.store) set.add(g.store);
            else if (g.customer) set.add(g.customer);
        });

        return [...set].sort();
    }

    function getCreditMemos() {
        const stored = JSON.parse(localStorage.getItem(LS_CREDIT_MEMO) || "[]");
        if (stored.length) return stored;

        const derived = getReturns()
            .filter(item =>
                item.status === "Approved"
                && ["Confirmed", "Final", "Posted"].includes(item.billingStatus)
                && String(item.financialTreatment || "").includes("Credit Memo"))
            .map((item, index) => ({
                creditMemoNo: item.creditMemoNo || (() => {
                    const now = new Date();
                    const period = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
                    return `CM-${period}-${String(index + 1).padStart(4, "0")}`;
                })(),
                creditMemoDate: item.creditMemoDate || item.date || "2026-04-30",
                customer: item.customer,
                relatedBillingNo: item.billingRef,
                relatedReturnNo: item.no,
                amount: Number(item.amount || 0),
                qty: Number(item.qty || 0),
                status: item.creditMemoStatus || "Issued",
                createdBy: item.approvalInfo?.approvedBy || "Vendor Finance",
                remarks: item.approvalInfo?.approvalRemarks || "Credit Memo derived from approved return.",
                financialTreatment: item.financialTreatment || "Credit Memo Required"
            }));

        if (derived.length) {
            localStorage.setItem(LS_CREDIT_MEMO, JSON.stringify(derived));
        }

        return derived;
    }

    function recalcBilling(doc) {
        const rows = doc.detailRows || [];
        const dates = doc.dates || [];

        doc.summaryRows = rows.map((row) => {
            const totalQty = (row.slots || []).reduce((total, slot) => total + Number(slot.billingQty || 0), 0);
            const totalAmount = (row.slots || []).reduce((total, slot) => total + (Number(slot.billingQty || 0) * Number(slot.price || 0)), 0);
            return {
                itemCode: row.itemCode,
                itemName: row.itemName,
                totalQty,
                avgPrice: row.slots && row.slots.length ? Number(row.slots[0].price || 0) : 0,
                totalAmount
            };
        });

        doc.totalQty = doc.summaryRows.reduce((total, row) => total + Number(row.totalQty || 0), 0);
        doc.totalAmount = doc.summaryRows.reduce((total, row) => total + Number(row.totalAmount || 0), 0);
        doc.totalDo = doc.deliveries ? doc.deliveries.length : doc.totalDo || dates.length;
        doc.deliveryDates = dates.length;
        return doc;
    }

    function priceMapFrom(doc) {
        // Base fallback prices
        const map = {
            "BRD-001": 18000,
            "BRD-007": 14500,
            "BRD-010": 21500,
            "BRD-013": 9000
        };

        // Lookup active price list from localStorage that matches this billing doc
        try {
            const plList = JSON.parse(localStorage.getItem("IBOCS_pl_list") || "[]");
            const customer = doc.customer || "";
            const billingDate = doc.periodFrom || "";

            // Find best matching price list: Active status, customer matches toko, date in range
            const matched = plList.filter(pl => {
                if (pl.status !== "Active") return false;
                const tokoMatch = !pl.toko || pl.toko === customer;
                const afterFrom = !pl.validFrom || !billingDate || billingDate >= pl.validFrom;
                const beforeTo  = !pl.validTo   || !billingDate || billingDate <= pl.validTo;
                return tokoMatch && afterFrom && beforeTo;
            });

            // Apply prices from matched price lists (last match wins for same item)
            matched.forEach(pl => {
                (pl.items || []).forEach(item => {
                    if (item.code && item.price) map[item.code] = Number(item.price);
                });
            });
        } catch (e) { /* ignore */ }

        // Override with prices already stored in the doc (highest priority)
        (doc.summaryRows || []).forEach((row) => {
            if (row.itemCode) map[row.itemCode] = Number(row.avgPrice || 0) || map[row.itemCode] || 0;
        });

        (doc.detailRows || []).forEach((row) => {
            if (row.itemCode && row.slots && row.slots.length) {
                map[row.itemCode] = Number(row.slots[0].price || 0) || map[row.itemCode] || 0;
            }
        });

        return map;
    }

    function resolveLinkedPL(customer, periodFrom) {
        try {
            const plList = JSON.parse(localStorage.getItem("IBOCS_pl_list") || "[]");
            const date = periodFrom || "";
            const matched = plList.filter(pl => {
                if (pl.status !== "Active") return false;
                if (!pl.toko || pl.toko !== customer) return false;
                const afterFrom = !pl.validFrom || !date || date >= pl.validFrom;
                const beforeTo  = !pl.validTo   || !date || date <= pl.validTo;
                return afterFrom && beforeTo;
            });
            if (matched.length) return matched[matched.length - 1].plName || "-";
        } catch (e) { /* ignore */ }
        return "";
    }

    function buildFromGrpoSource(baseDoc, fallbackDoc, options = {}) {
        const grpos = getGrpoList();
        if (!grpos.length) return recalcBilling(clone(fallbackDoc || baseDoc));

        const preferredStore = baseDoc.customer; // dropdown uses store name
        const selectedGrpoNos = Array.isArray(options.grpoNos) ? options.grpoNos.filter(Boolean) : [];
        const filtered = grpos.filter((grpo) => {
            const selectedMatch = !selectedGrpoNos.length || selectedGrpoNos.includes(grpo.grpoNo);
            const grpoStore = grpo.store || grpo.customer || "";
            const sameStore = !preferredStore || grpoStore === preferredStore;
            const afterFrom = !baseDoc.periodFrom || !grpo.grpoDate || grpo.grpoDate >= baseDoc.periodFrom;
            const beforeTo = !baseDoc.periodTo || !grpo.grpoDate || grpo.grpoDate <= baseDoc.periodTo;
            return selectedMatch && sameStore && afterFrom && beforeTo;
        });

        if (!filtered.length) return recalcBilling(clone(fallbackDoc || baseDoc));
        const sourceRows = filtered;

        const firstCustomer = sourceRows[0].store || sourceRows[0].customer || baseDoc.customer;
        const dates = [...new Set(sourceRows.map(item => item.grpoDate).filter(Boolean))].sort();
        const dateLabels = dates.map(toDisplayDate).map(label => label.slice(0, 6));
        const rowMap = new Map();
        const returns = getReturns().filter(item => {
            if (item.billingRef === baseDoc.billingNo) return true;
            if ((item.customer || "") !== firstCustomer) return false;
            const retDate = item.date || item.returnDate || "";
            const afterFrom = !baseDoc.periodFrom || !retDate || retDate >= baseDoc.periodFrom;
            const beforeTo = !baseDoc.periodTo || !retDate || retDate <= baseDoc.periodTo;
            return afterFrom && beforeTo;
        });
        const priceMap = priceMapFrom(baseDoc);

        // Build DO qty map: { itemCode: { dateISO: doQty } }
        const doQtyMap = {};
        const doList = getDoList().filter(doDoc => {
            const doStore = doDoc.store || doDoc.customer || "";
            const sameStore = !firstCustomer || doStore === firstCustomer;
            const afterFrom = !baseDoc.periodFrom || !doDoc.deliveryDate || doDoc.deliveryDate >= baseDoc.periodFrom;
            const beforeTo = !baseDoc.periodTo || !doDoc.deliveryDate || doDoc.deliveryDate <= baseDoc.periodTo;
            return sameStore && afterFrom && beforeTo && doDoc.status !== "DRAFT";
        });
        doList.forEach(doDoc => {
            const doDateISO = doDoc.deliveryDate;
            (doDoc.lines || []).forEach(line => {
                if (!line.itemCode) return;
                if (!doQtyMap[line.itemCode]) doQtyMap[line.itemCode] = {};
                doQtyMap[line.itemCode][doDateISO] = (doQtyMap[line.itemCode][doDateISO] || 0) + Number(line.qtyDO || 0);
            });
        });

        sourceRows.forEach((grpo) => {
            const dateIndex = dates.indexOf(grpo.grpoDate);
            (grpo.rows || []).forEach((line) => {
                const key = `${line.itemCode}__${line.itemName}`;
                if (!rowMap.has(key)) {
                    rowMap.set(key, {
                        itemCode: line.itemCode,
                        itemName: line.itemName,
                        slots: dates.map((dateISO) => ({
                            doQty: doQtyMap[line.itemCode]?.[dateISO] || 0,
                            grpoQty: 0,
                            returnQty: 0,
                            billingQty: 0,
                            price: priceMap[line.itemCode] || 0
                        }))
                    });
                }

                const targetRow = rowMap.get(key);
                const slot = targetRow.slots[dateIndex];
                // doQty already set from DO data; only accumulate grpoQty here
                if (!doQtyMap[line.itemCode]?.[grpo.grpoDate]) {
                    // fallback: no DO data found, use grpo qty as doQty too
                    slot.doQty += Number(line.qtyReceived || 0);
                }
                const qty = Number(line.qtyReceived || 0);
                slot.grpoQty += qty;
                slot.billingQty += qty;
            });
        });

        returns.forEach((ret) => {
            (ret.lines || []).forEach((line) => {
                for (const row of rowMap.values()) {
                    if (row.itemCode === line.itemCode && row.slots.length) {
                        row.slots[row.slots.length - 1].returnQty += Number(line.returnQty || 0);
                    }
                }
            });
        });

        const deliveries = sourceRows.map((grpo) => ({
            sourceNo: `SRC-${grpo.grpoNo}`,
            doNo: `SRC-${grpo.grpoNo}`,
            deliveryDate: toDisplayDate(grpo.grpoDate),
            qty: Number(grpo.totalQty || 0),
            amount: (grpo.rows || []).reduce((total, line) => total + Number(line.qtyReceived || 0) * Number(priceMap[line.itemCode] || 0), 0)
        }));

        const doc = {
            ...clone(baseDoc),
            customer: firstCustomer,
            periodFrom: dates[0] || baseDoc.periodFrom,
            periodTo: dates[dates.length - 1] || baseDoc.periodTo,
            sourceGrpoNos: sourceRows.map(item => item.grpoNo),
            dates: dateLabels,
            deliveries,
            detailRows: [...rowMap.values()],
            remarks: `Billing recap loaded from ${sourceRows.length} GRPO document(s) in local storage. Final qty follows GRPO received qty.`
        };

        doc.history = doc.history || [];
        return recalcBilling(doc);
    }

    function buildDeliveries(prefix, dates, amounts, qtys) {
        return dates.map((date, index) => ({
            sourceNo: `${prefix}${String(index + 1).padStart(4, "0")}`,
            doNo: `${prefix}${String(index + 1).padStart(4, "0")}`,
            deliveryDate: date,
            qty: qtys[index] || 0,
            amount: amounts[index] || 0
        }));
    }

    function makeSeedDocs() {
        const confirmedRows = [
            {
                itemCode: "BRD-001",
                itemName: "Butter Croissant",
                slots: [
                    { doQty: 85, grpoQty: 84, returnQty: 0, billingQty: 84, price: 18000 },
                    { doQty: 95, grpoQty: 93, returnQty: 0, billingQty: 93, price: 18000 },
                    { doQty: 90, grpoQty: 90, returnQty: 0, billingQty: 90, price: 18000 },
                    { doQty: 95, grpoQty: 94, returnQty: 6, billingQty: 94, price: 18000 }
                ]
            },
            {
                itemCode: "BRD-007",
                itemName: "Chocolate Donut",
                slots: [
                    { doQty: 70, grpoQty: 70, returnQty: 0, billingQty: 70, price: 14500 },
                    { doQty: 80, grpoQty: 79, returnQty: 0, billingQty: 79, price: 14500 },
                    { doQty: 85, grpoQty: 85, returnQty: 0, billingQty: 85, price: 14500 },
                    { doQty: 75, grpoQty: 74, returnQty: 0, billingQty: 74, price: 14500 }
                ]
            },
            {
                itemCode: "BRD-010",
                itemName: "Cheese Danish",
                slots: [
                    { doQty: 60, grpoQty: 60, returnQty: 0, billingQty: 60, price: 21500 },
                    { doQty: 70, grpoQty: 69, returnQty: 0, billingQty: 69, price: 21500 },
                    { doQty: 65, grpoQty: 65, returnQty: 0, billingQty: 65, price: 21500 },
                    { doQty: 60, grpoQty: 58, returnQty: 0, billingQty: 58, price: 21500 }
                ]
            },
            {
                itemCode: "BRD-013",
                itemName: "Soft Burger Bun",
                slots: [
                    { doQty: 85, grpoQty: 85, returnQty: 0, billingQty: 85, price: 9000 },
                    { doQty: 70, grpoQty: 70, returnQty: 0, billingQty: 70, price: 9000 },
                    { doQty: 95, grpoQty: 94, returnQty: 0, billingQty: 94, price: 9000 },
                    { doQty: 100, grpoQty: 99, returnQty: 0, billingQty: 99, price: 9000 }
                ]
            }
        ];

        const draftRows = [
            {
                itemCode: "BRD-001",
                itemName: "Butter Croissant",
                slots: [
                    { doQty: 20, grpoQty: 20, returnQty: 0, billingQty: 20, price: 18000 },
                    { doQty: 15, grpoQty: 14, returnQty: 0, billingQty: 14, price: 18000 },
                    { doQty: 30, grpoQty: 28, returnQty: 6, billingQty: 28, price: 18000 }
                ]
            },
            {
                itemCode: "BRD-007",
                itemName: "Chocolate Donut",
                slots: [
                    { doQty: 10, grpoQty: 10, returnQty: 0, billingQty: 10, price: 14500 },
                    { doQty: 20, grpoQty: 20, returnQty: 0, billingQty: 20, price: 14500 },
                    { doQty: 25, grpoQty: 24, returnQty: 0, billingQty: 24, price: 14500 }
                ]
            },
            {
                itemCode: "BRD-010",
                itemName: "Cheese Danish",
                slots: [
                    { doQty: 12, grpoQty: 12, returnQty: 0, billingQty: 12, price: 21500 },
                    { doQty: 18, grpoQty: 17, returnQty: 0, billingQty: 17, price: 21500 },
                    { doQty: 10, grpoQty: 10, returnQty: 0, billingQty: 10, price: 21500 }
                ]
            },
            {
                itemCode: "BRD-013",
                itemName: "Soft Burger Bun",
                slots: [
                    { doQty: 20, grpoQty: 20, returnQty: 0, billingQty: 20, price: 9000 },
                    { doQty: 15, grpoQty: 15, returnQty: 0, billingQty: 15, price: 9000 },
                    { doQty: 20, grpoQty: 19, returnQty: 0, billingQty: 19, price: 9000 }
                ]
            }
        ];

        const docs = [
            {
                billingNo: "BILL-202604-0001",
                billingDate: "2026-04-30",
                customer: "Sunrise Bakery Mart",
                status: "Confirmed",
                periodFrom: "2026-04-01",
                periodTo: "2026-04-30",
                currency: "IDR",
                priceList: "Sunrise Bakery PL (Active)",
                preparedBy: "Jennie Lou",
                remarks: "Billing prepared from operational source and GRPO recap for April 2026 period.",
                dates: ["01-Apr", "03-Apr", "05-Apr", "08-Apr"],
                deliveries: buildDeliveries("DO-202604-", ["01-Apr-2026", "03-Apr-2026", "05-Apr-2026", "08-Apr-2026"], [4120000, 3560000, 4800000, 3995000], [110, 95, 120, 105]),
                detailRows: clone(confirmedRows),
                history: [
                    { time: "30-Apr-2026 14:35", title: "Status changed to Confirmed", description: "Confirmed by Finance Supervisor." },
                    { time: "30-Apr-2026 13:50", title: "Manual adjustment saved", description: "Billing recap updated based on final GRPO posting." },
                    { time: "30-Apr-2026 10:15", title: "Billing created", description: "Billing generated from operational source recap for customer Sunrise Bakery Mart." }
                ]
            },
            {
                billingNo: "BILL-202604-0002",
                billingDate: "2026-04-30",
                customer: "Golden Crust Bakery",
                status: "Draft",
                periodFrom: "2026-04-01",
                periodTo: "2026-04-30",
                currency: "IDR",
                priceList: "Golden Crust PL (Active)",
                preparedBy: "Jennie Lou",
                remarks: "Draft billing still waiting for final GRPO check on several operational source slots.",
                dates: ["01-Apr", "03-Apr", "05-Apr"],
                deliveries: buildDeliveries("DO-202604-", ["01-Apr-2026", "03-Apr-2026", "05-Apr-2026"], [1220000, 980000, 1122500], [62, 68, 85]),
                detailRows: clone(draftRows),
                history: [
                    { time: "30-Apr-2026 09:10", title: "Draft billing created", description: "Created from operational source recap and awaiting GRPO validation." }
                ]
            },
            {
                billingNo: "BILL-202604-0003",
                billingDate: "2026-04-25",
                customer: "Daily Fresh Bakery",
                status: "Confirmed",
                periodFrom: "2026-04-10",
                periodTo: "2026-04-25",
                currency: "IDR",
                priceList: "Daily Fresh PL (Promo)",
                preparedBy: "Finance Team",
                remarks: "Confirmed billing based on completed operational source and receipt period.",
                dates: ["10-Apr", "15-Apr", "20-Apr"],
                deliveries: buildDeliveries("DO-202604-", ["10-Apr-2026", "15-Apr-2026", "20-Apr-2026"], [6450000, 7100000, 7900000], [185, 210, 220]),
                detailRows: [
                    { itemCode: "BRD-001", itemName: "Butter Croissant", slots: [{ doQty: 40, grpoQty: 40, returnQty: 0, billingQty: 40, price: 18000 }, { doQty: 45, grpoQty: 45, returnQty: 0, billingQty: 45, price: 18000 }, { doQty: 50, grpoQty: 49, returnQty: 0, billingQty: 49, price: 18000 }] },
                    { itemCode: "BRD-007", itemName: "Chocolate Donut", slots: [{ doQty: 38, grpoQty: 38, returnQty: 0, billingQty: 38, price: 14500 }, { doQty: 42, grpoQty: 42, returnQty: 0, billingQty: 42, price: 14500 }, { doQty: 44, grpoQty: 44, returnQty: 0, billingQty: 44, price: 14500 }] },
                    { itemCode: "BRD-010", itemName: "Cheese Danish", slots: [{ doQty: 32, grpoQty: 31, returnQty: 0, billingQty: 31, price: 21500 }, { doQty: 36, grpoQty: 35, returnQty: 0, billingQty: 35, price: 21500 }, { doQty: 39, grpoQty: 38, returnQty: 0, billingQty: 38, price: 21500 }] },
                    { itemCode: "BRD-013", itemName: "Soft Burger Bun", slots: [{ doQty: 48, grpoQty: 47, returnQty: 0, billingQty: 47, price: 9000 }, { doQty: 52, grpoQty: 51, returnQty: 0, billingQty: 51, price: 9000 }, { doQty: 55, grpoQty: 54, returnQty: 0, billingQty: 54, price: 9000 }] }
                ],
                history: [
                    { time: "25-Apr-2026 16:20", title: "Status changed to Confirmed", description: "Confirmed after all receipt data matched billing recap." },
                    { time: "25-Apr-2026 09:00", title: "Billing created", description: "Billing generated from operational source recap for Daily Fresh Bakery." }
                ]
            },
            {
                billingNo: "BILL-202604-0004",
                billingDate: "2026-04-20",
                customer: "Butter House Bakery",
                status: "Draft",
                periodFrom: "2026-04-05",
                periodTo: "2026-04-20",
                currency: "IDR",
                priceList: "Butter House PL (Active)",
                preparedBy: "Jennie Lou",
                remarks: "Draft billing created from operational source recap and pending finance review.",
                dates: ["05-Apr", "12-Apr", "18-Apr"],
                deliveries: buildDeliveries("DO-202604-", ["05-Apr-2026", "12-Apr-2026", "18-Apr-2026"], [4200000, 5380000, 6100000], [180, 240, 280]),
                detailRows: [
                    { itemCode: "BRD-001", itemName: "Butter Croissant", slots: [{ doQty: 35, grpoQty: 35, returnQty: 0, billingQty: 35, price: 18000 }, { doQty: 42, grpoQty: 41, returnQty: 0, billingQty: 41, price: 18000 }, { doQty: 44, grpoQty: 43, returnQty: 0, billingQty: 43, price: 18000 }] },
                    { itemCode: "BRD-007", itemName: "Chocolate Donut", slots: [{ doQty: 30, grpoQty: 30, returnQty: 0, billingQty: 30, price: 14500 }, { doQty: 36, grpoQty: 36, returnQty: 0, billingQty: 36, price: 14500 }, { doQty: 38, grpoQty: 37, returnQty: 0, billingQty: 37, price: 14500 }] },
                    { itemCode: "BRD-010", itemName: "Cheese Danish", slots: [{ doQty: 26, grpoQty: 25, returnQty: 0, billingQty: 25, price: 21500 }, { doQty: 30, grpoQty: 29, returnQty: 0, billingQty: 29, price: 21500 }, { doQty: 33, grpoQty: 32, returnQty: 0, billingQty: 32, price: 21500 }] },
                    { itemCode: "BRD-013", itemName: "Soft Burger Bun", slots: [{ doQty: 40, grpoQty: 40, returnQty: 0, billingQty: 40, price: 9000 }, { doQty: 44, grpoQty: 43, returnQty: 0, billingQty: 43, price: 9000 }, { doQty: 46, grpoQty: 45, returnQty: 0, billingQty: 45, price: 9000 }] }
                ],
                history: [
                    { time: "20-Apr-2026 11:40", title: "Draft billing created", description: "Created from operational source recap and awaiting final finance review." }
                ]
            }
        ];

        return docs.map(recalcBilling);
    }

    function applyReturnImpact(doc) {
        const returns = getReturns().filter(item => item.billingRef === doc.billingNo);
        const creditMemos = getCreditMemos().filter(item => item.relatedBillingNo === doc.billingNo);
        const returnQty = returns.reduce((total, item) => total + Number(item.totalQty || 0), 0);
        const returnAmount = returns.reduce((total, item) => total + Number(item.returnAmount || item.estimatedAmount || 0), 0);
        const financialTreatment = returns.length
            ? (returns.some(item => (item.financialTreatment || "").includes("Credit Memo")) ? "Credit Memo Required" : "Direct Billing Reduction")
            : "No Return Impact";

        doc.returnImpact = {
            docCount: returns.length,
            qty: returnQty,
            amount: returnAmount,
            financialTreatment,
            creditMemoCount: creditMemos.length,
            creditMemoRefs: creditMemos.map(item => item.creditMemoNo),
            note: returns.length
                ? (financialTreatment === "Credit Memo Required"
                    ? (creditMemos.length
                        ? `Original billing remains intact. Settled by ${creditMemos.map(item => item.creditMemoNo).join(", ")}`
                        : "Original billing remains intact. Credit Memo still pending generation")
                    : "Billing can still be reduced directly")
                : "No related return document"
        };

        return doc;
    }

    function ensureStorage() {
        const stored = JSON.parse(localStorage.getItem(LS_BILLING) || "[]");
        if (stored.length && stored.every(doc => Array.isArray(doc.detailRows) && Array.isArray(doc.dates))) {
            return stored.map(doc => applyReturnImpact(recalcBilling(doc)));
        }
        const seeded = makeSeedDocs().map(applyReturnImpact);
        localStorage.setItem(LS_BILLING, JSON.stringify(seeded));
        return seeded;
    }

    function saveAll(docs) {
        localStorage.setItem(LS_BILLING, JSON.stringify(docs.map(doc => applyReturnImpact(recalcBilling(doc)))));
    }

    function getAll() {
        return clone(ensureStorage());
    }

    function getByNo(billingNo) {
        return getAll().find(doc => doc.billingNo === billingNo) || null;
    }

    function nextBillingNo() {
        const now = new Date();
        const period = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
        const docs = getAll();
        const max = docs.reduce((value, doc) => {
            const parts = String(doc.billingNo || "").split("-");
            if (parts[1] !== period) return value;
            const current = Number(parts.pop() || 0);
            return Math.max(value, current);
        }, 0);
        return `BILL-${period}-${String(max + 1).padStart(4, "0")}`;
    }

    function createDraftTemplate() {
        const template = clone(makeSeedDocs()[1]);
        template.billingNo = nextBillingNo();
        template.status = "Draft";
        template.billingDate = "2026-04-30";
        template.preparedBy = "Jennie Lou";
        template.remarks = "New draft billing created from operational source recap. Review GRPO before confirmation.";
        template.history = [
            { time: "30-Apr-2026 09:10", title: "Draft billing created", description: "Created from operational source and GRPO recap template." }
        ];
        return applyReturnImpact(buildFromGrpoSource(template, template));
    }

    function saveBilling(doc) {
        const docs = getAll();
        const index = docs.findIndex(item => item.billingNo === doc.billingNo);
        const normalized = applyReturnImpact(recalcBilling(clone(doc)));
        if (index >= 0) docs[index] = normalized;
        else docs.push(normalized);
        saveAll(docs);
        return normalized;
    }

    function upsertHistory(doc, entry) {
        doc.history = doc.history || [];
        doc.history.unshift(entry);
        return doc;
    }

    window.BillingStorage = {
        formatNumber,
        formatCurrency,
        toDisplayDate,
        getAll,
        getByNo,
        saveBilling,
        createDraftTemplate,
        buildFromGrpoSource,
        getGrpoList,
        getDoList,
        getCustomerList,
        nextBillingNo,
        upsertHistory,
        recalcBilling,
        applyReturnImpact,
        resolveLinkedPL
    };
})();


