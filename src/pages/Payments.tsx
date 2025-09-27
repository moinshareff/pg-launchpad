import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { payments as seedPayments, currency, tenants as allTenants, Payment } from "@/lib/data";

export default function Payments() {
  const [filter, setFilter] = useState<"All" | "Local" | "Site">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending">("All");

  // Local payments state so owners can add transactions
  const [paymentsState, setPaymentsState] = useState<Payment[]>(seedPayments);

  const filtered = useMemo(
    () => paymentsState.filter(p => (filter === "All" ? true : p.source === filter) && (statusFilter === "All" ? true : p.status === statusFilter)),
    [paymentsState, filter, statusFilter]
  );

  const collected = useMemo(() => filtered.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0), [filtered]);
  const pending = useMemo(() => filtered.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0), [filtered]);

  // Add Payment modal state
  const [showAdd, setShowAdd] = useState(false);
  const [tenantQuery, setTenantQuery] = useState("");
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const selectedTenant = useMemo(() => allTenants.find(t => t.id === selectedTenantId) || null, [selectedTenantId]);
  const suggestions = useMemo(() => {
    const q = tenantQuery.trim().toLowerCase();
    if (!q) return [] as typeof allTenants;
    return allTenants.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [tenantQuery]);

  const [form, setForm] = useState({ amount: "", status: "Paid" as "Paid" | "Pending", date: new Date().toISOString().slice(0,10), notes: "", mode: "Cash" as "Cash" | "UPI" | "Bank Transfer", reference: "", forMonth: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function openAdd() {
    setTenantQuery("");
    setSelectedTenantId(null);
    setForm({ amount: "", status: "Paid", date: new Date().toISOString().slice(0,10), notes: "", mode: "Cash", reference: "", forMonth: "" });
    setErrors({});
    setShowAdd(true);
  }
  function closeAdd() { setShowAdd(false); setErrors({}); }

  function validate() {
    const e: Record<string,string> = {};
    if (!selectedTenant) e.tenant = "Select a tenant";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter valid amount";
    if (!form.date) e.date = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function savePayment() {
    if (!validate() || !selectedTenant) return;
    const newPayment: Payment = {
      id: `P-${Math.floor(2000 + Math.random() * 8000)}`,
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.name,
      source: selectedTenant.source,
      pg: selectedTenant.pg,
      amount: Number(form.amount),
      status: form.status,
      date: form.date,
      mode: form.mode,
      reference: form.reference || undefined,
      forMonth: form.forMonth || undefined,
      notes: form.notes || undefined,
    };
    setPaymentsState(prev => [newPayment, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="row gap-2">
            <nav className="header__nav">
              <Link to="/">Dashboard</Link>
              <Link to="/tenants">Tenants & Occupancy</Link>
              <Link to="/payments" aria-current="page">Payments</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container grid-main">
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">Payments</div>
                <div className="row gap-2">
                  <button className="btn btn--outline" onClick={() => setFilter("All")}>All</button>
                  <button className="btn btn--outline" onClick={() => setFilter("Local")}>Local</button>
                  <button className="btn btn--outline" onClick={() => setFilter("Site")}>Site</button>
                  <span className="separator" style={{ width: 1, background: "var(--border-subtle)" }} />
                  <button className="btn btn--outline" onClick={() => setStatusFilter("All")}>All</button>
                  <button className="btn btn--outline" onClick={() => setStatusFilter("Paid")}>Paid</button>
                  <button className="btn btn--outline" onClick={() => setStatusFilter("Pending")}>Pending</button>
                  <button className="btn" onClick={openAdd}>+ Add Payment</button>
                </div>
              </div>
              <div className="card__desc">Owner-recorded payments. Filter by source and status.</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="stat"><div className="stat__label">Collected</div><div className="stat__value">{currency(collected)}</div></div>
                <div className="stat"><div className="stat__label">Pending</div><div className="stat__value">{currency(pending)}</div></div>
                <div className="stat"><div className="stat__label">Transactions</div><div className="stat__value">{filtered.length}</div></div>
              </div>
            </div>
          </div>
        </section>

        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">Payment Entries</div>
              <div className="card__desc">Click a tenant to open the tenant record.</div>
            </div>
            <div className="card__content">
              <div className="list-item" style={{ padding: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tenant</th>
                      <th>PG</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <Link to={`/tenants?tenantId=${p.tenantId}`} className="text-small" style={{ fontWeight: 600 }}>{p.tenantName}</Link>
                          <div className="text-xsmall muted">#{p.tenantId}</div>
                        </td>
                        <td>{p.pg}</td>
                        <td><span className="badge badge--outline">{p.source}</span></td>
                        <td>{p.status}</td>
                        <td>{currency(p.amount)}</td>
                        <td>{new Date(p.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showAdd && (
        <div
          role="dialog"
          aria-modal="true"
          className="row"
          style={{ position: "fixed", inset: 0, background: "rgb(0 0 0 / 0.4)", alignItems: "center", justifyContent: "center", padding: "1rem", zIndex: 50 }}
        >
          <div className="card" style={{ maxWidth: 720, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">Add Payment</div>
                <div className="row gap-2">
                  <button className="btn btn--outline" onClick={closeAdd}>Cancel</button>
                  <button className="btn" onClick={savePayment}>Save</button>
                </div>
              </div>
              <div className="card__desc">Search tenant, enter amount and details, then save.</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Tenant</div>
                  <label className="text-xsmall">Search by name or ID *</label>
                  <input value={tenantQuery} onChange={(e) => { setTenantQuery(e.target.value); setSelectedTenantId(null); }} placeholder="Start typing..." style={inputStyle(errors.tenant)} />
                  {errors.tenant && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.tenant}</div>}
                  {tenantQuery && !selectedTenantId && (
                    <div className="list-item" style={{ marginTop: ".5rem", maxHeight: 180, overflow: "auto" }}>
                      {suggestions.length === 0 && <div className="text-xsmall muted">No matches</div>}
                      {suggestions.map(t => (
                        <button key={t.id} className="btn btn--ghost" style={{ width: "100%", justifyContent: "flex-start" }} onClick={() => { setSelectedTenantId(t.id); setTenantQuery(t.name); }}>
                          <span style={{ fontWeight: 600 }}>{t.name}</span>
                          <span className="text-xsmall muted" style={{ marginLeft: 8 }}>#{t.id} • {t.pg}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedTenant && (
                    <div className="list-item" style={{ marginTop: ".5rem" }}>
                      <div className="text-small" style={{ fontWeight: 600 }}>{selectedTenant.name}</div>
                      <div className="text-xsmall muted">#{selectedTenant.id} • {selectedTenant.pg} • <span className="badge badge--outline">{selectedTenant.source}</span></div>
                    </div>
                  )}
                </div>

                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Transaction</div>
                  <label className="text-xsmall">Amount (₹) *</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="8000" style={inputStyle(errors.amount)} />
                  {errors.amount && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.amount}</div>}
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Status</label>
                      <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as "Paid" | "Pending" }))} style={inputStyle()}>
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Date *</label>
                      <input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle(errors.date)} />
                      {errors.date && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.date}</div>}
                    </div>
                  </div>
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Mode</label>
                      <select value={form.mode} onChange={(e) => setForm(f => ({ ...f, mode: e.target.value as any }))} style={inputStyle()}>
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Bank Transfer</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Reference</label>
                      <input value={form.reference} onChange={(e) => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="UPI/Txn/Cheque no." style={inputStyle()} />
                    </div>
                  </div>
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">For Month</label>
                      <input type="month" value={form.forMonth} onChange={(e) => setForm(f => ({ ...f, forMonth: e.target.value }))} style={inputStyle()} />
                    </div>
                    <div style={{ flex: 1 }} />
                  </div>
                  <label className="text-xsmall" style={{ marginTop: ".5rem" }}>Notes</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional remarks" style={inputStyle()} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function inputStyle(error?: string): React.CSSProperties {
  return {
    width: "100%",
    padding: ".5rem .75rem",
    borderRadius: 6,
    border: `1px solid ${error ? "#dc2626" : "var(--border-subtle)"}`,
    background: "var(--panel)",
    color: "var(--fg)",
    outline: 0,
  };
}
