(function () {
    const LS_RETURN = "IBOCS_return_list";
    const LS_CREDIT_MEMO = "IBOCS_credit_memo_list";

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function loadReturns() {
        return JSON.parse(localStorage.getItem(LS_RETURN) || "[]");
    }

    function saveReturns(list) {
        localStorage.setItem(LS_RETURN, JSON.stringify(list));
    }

    function loadCreditMemos() {
        return JSON.parse(localStorage.getItem(LS_CREDIT_MEMO) || "[]");
    }

    function saveCreditMemos(list) {
        localStorage.setItem(LS_CREDIT_MEMO, JSON.stringify(list));
    }

    function currentPeriod() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        return `${y}${m}`;
    }

    function nextCreditMemoNo(existing) {
        const period = currentPeriod();
        const max = existing.reduce((value, item) => {
            const parts = String(item.creditMemoNo || "").split("-");
            if (parts[1] !== period) return value;
            const current = Number(parts.pop() || 0);
            return Math.max(value, current);
        }, 0);
        return `CM-${period}-${String(max + 1).padStart(4, "0")}`;
    }

    function qualifiesForCreditMemo(ret) {
        const finalBilling = ["Confirmed", "Final", "Posted"].includes(ret.billingStatus);
        return ret.status === "Approved"
            && finalBilling
            && String(ret.financialTreatment || "").includes("Credit Memo");
    }

    function buildMemoFromReturn(ret, existing) {
        return {
            creditMemoNo: nextCreditMemoNo(existing),
            creditMemoDate: ret.approvalInfo?.approvalDate?.slice(0, 10) || ret.date || "2026-04-30",
            customer: ret.customer,
            relatedBillingNo: ret.billingRef,
            relatedReturnNo: ret.no,
            amount: Number(ret.amount || 0),
            qty: Number(ret.qty || 0),
            status: "Issued",
            createdBy: ret.approvalInfo?.approvedBy || "Vendor Finance",
            remarks: ret.approvalInfo?.approvalRemarks || "Credit Memo generated from approved return.",
            financialTreatment: ret.financialTreatment || "Credit Memo Required"
        };
    }

    function synchronize() {
        const returns = loadReturns();
        const memos = loadCreditMemos();
        let returnsChanged = false;
        let memosChanged = false;

        returns.forEach((ret, index) => {
            if (!qualifiesForCreditMemo(ret)) return;

            let memo = memos.find(item => item.relatedReturnNo === ret.no);
            if (!memo) {
                memo = buildMemoFromReturn(ret, memos);
                memos.push(memo);
                memosChanged = true;
            }

            if (returns[index].creditMemoNo !== memo.creditMemoNo
                || returns[index].creditMemoDate !== memo.creditMemoDate
                || returns[index].creditMemoStatus !== memo.status) {
                returns[index].creditMemoNo = memo.creditMemoNo;
                returns[index].creditMemoDate = memo.creditMemoDate;
                returns[index].creditMemoStatus = memo.status;
                returns[index].billingImpactStatus = "Original Billing Locked - Credit Memo Flow";
                returnsChanged = true;
            }
        });

        if (memosChanged) saveCreditMemos(memos);
        if (returnsChanged) saveReturns(returns);

        return clone(memos);
    }

    function ensureForReturn(ret) {
        const returns = loadReturns();
        const memos = loadCreditMemos();
        let memo = memos.find(item => item.relatedReturnNo === ret.no);

        if (!memo && qualifiesForCreditMemo(ret)) {
            memo = buildMemoFromReturn(ret, memos);
            memos.push(memo);
            saveCreditMemos(memos);
        }

        if (memo) {
            const idx = returns.findIndex(item => item.no === ret.no);
            if (idx >= 0) {
                returns[idx].creditMemoNo = memo.creditMemoNo;
                returns[idx].creditMemoDate = memo.creditMemoDate;
                returns[idx].creditMemoStatus = memo.status;
                returns[idx].billingImpactStatus = "Original Billing Locked - Credit Memo Flow";
                saveReturns(returns);
            }
        }

        return memo ? clone(memo) : null;
    }

    function getAll() {
        return synchronize();
    }

    function getByNo(creditMemoNo) {
        return getAll().find(item => item.creditMemoNo === creditMemoNo) || null;
    }

    window.CreditMemoStorage = {
        getAll,
        getByNo,
        ensureForReturn,
        synchronize
    };
})();


