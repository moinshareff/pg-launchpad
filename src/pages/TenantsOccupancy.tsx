import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { tenants as seedTenants, pgs, getTotals, buildBedMap, Tenant } from "@/lib/data";

export default function TenantsOccupancy() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get("tenantId");

  // Local state for tenants so we can add a Local Tenant quickly
  const [tenantsState, setTenantsState] = useState<Tenant[]>(seedTenants);
  const [filter, setFilter] = useState<"All" | "Local" | "Site">("All");

  const totals = useMemo(() => getTotals(), []);
  const donutData = [
    { name: "Local", value: totals.localCount, fill: "currentColor" },
    { name: "Site", value: totals.siteCount, fill: "#c7c7c7" },
  ];

  const filteredTenants = useMemo(
    () => tenantsState.filter((t) => (filter === "All" ? true : t.source === filter)),
    [tenantsState, filter]
  );

  // Simple bed map for Sunshine Villa
  const [selectedPg, setSelectedPg] = useState("Sunshine Villa");
  const [bedMap, setBedMap] = useState<boolean[]>(() => buildBedMap("Sunshine Villa"));
  const occupiedCount = bedMap.filter(Boolean).length;
  const availableCount = bedMap.length - occupiedCount;

  // Optional auto-scroll to highlighted tenant
  useEffect(() => {
    if (!highlightId) return;
    const el = document.getElementById(`tenant-${highlightId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightId]);

  // Add Local Tenant Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    age: "",
    phone: "",
    email: "",

    pg: selectedPg,
    roomType: "",
    bedLabel: "",
    checkIn: "",
    stayMonths: "",

    idType: "",
    idNumber: "",

    address: "",
    city: "",
    state: "",
    pincode: "",

    emergencyName: "",
    emergencyPhone: "",

    rent: "",
    deposit: "",
    paymentStatus: "Pending",
    foodPlan: "None",

    notes: "",
  });

  function openAdd() {
    setForm((f) => ({ ...f, pg: selectedPg }));
    setErrors({});
    setShowAdd(true);
  }

  function closeAdd() {
    setShowAdd(false);
    setErrors({});
  }

  function onChange<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.pg.trim()) e.pg = "Required";
    if (!form.roomType.trim()) e.roomType = "Required";
    if (!form.bedLabel.trim()) e.bedLabel = "Required";
    if (!form.checkIn.trim()) e.checkIn = "Required";
    if (!form.idType.trim()) e.idType = "Required";
    if (!form.idNumber.trim()) e.idNumber = "Required";
    if (!form.emergencyName.trim()) e.emergencyName = "Required";
    if (!form.emergencyPhone.trim()) e.emergencyPhone = "Required";
    if (!form.rent.trim()) e.rent = "Required";
    if (!form.deposit.trim()) e.deposit = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function saveTenant() {
    if (!validate()) return;
    const nextId = `T-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTenant: Tenant = {
      id: nextId,
      name: form.fullName,
      contact: form.phone,
      source: "Local",
      pg: form.pg,
      bed: form.bedLabel,
      paymentStatus: form.paymentStatus as Tenant["paymentStatus"],
    };

    setTenantsState((prev) => [newTenant, ...prev]);

    // If the selected PG is the one with the bed map shown, attempt to mark a bed as occupied
    if (form.pg === selectedPg) {
      const m = [...bedMap];
      const match = form.bedLabel.match(/(\d{1,3})$/); // last 1-3 digits
      if (match) {
        const idx = (parseInt(match[1], 10) - 1) % m.length;
        m[idx] = true;
        setBedMap(m);
      }
    }

    setShowAdd(false);
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <div className="row gap-2">
            <nav className="header__nav">
              <Link to="/">Dashboard</Link>
              <Link to="/tenants" aria-current="page">Tenants & Occupancy</Link>
              <Link to="/payments">Payments</Link>
              <Link to="#">Support</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container grid-main">
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="card__title">
                <span>Tenants & Occupancy</span>
              </div>
              <div className="card__desc">Full tenant CRM, occupancy split, and bed availability.</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                <div className="stat"><div className="stat__label">Total Beds</div><div className="stat__value">{totals.totalBeds}</div></div>
                <div className="stat"><div className="stat__label">Occupied</div><div className="stat__value">{totals.totalOccupied}</div></div>
                <div className="stat"><div className="stat__label">Available</div><div className="stat__value">{totals.totalAvailable}</div></div>
                <div className="list-item" style={{ padding: 0 }}>
                  <div className="row" style={{ justifyContent: "space-between", padding: ".75rem" }}>
                    <div>
                      <div className="text-small" style={{ fontWeight: 600 }}>Local vs Site</div>
                      <div className="text-xsmall muted">Tenant source split</div>
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={45} stroke="none" />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tenant Management */}
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">Tenant Management</div>
                <div className="row gap-2">
                  <button className="btn btn--outline" onClick={() => setFilter("All")}>All</button>
                  <button className="btn btn--outline" onClick={() => setFilter("Local")}>Local</button>
                  <button className="btn btn--outline" onClick={() => setFilter("Site")}>Site</button>
                  <button className="btn" onClick={openAdd}><Plus size={16} /> Add Local Tenant</button>
                </div>
              </div>
              <div className="card__desc">View and manage all tenants.</div>
            </div>
            <div className="card__content">
              <div className="list-item" style={{ padding: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Source</th>
                      <th>PG / Bed</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTenants.map((t) => (
                      <tr key={t.id} id={`tenant-${t.id}`} style={highlightId === t.id ? { outline: "2px solid var(--border-strong)", outlineOffset: -2 } : undefined}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.name}</div>
                          <div className="text-xsmall muted">#{t.id}</div>
                        </td>
                        <td>{t.contact}</td>
                        <td><span className="badge badge--outline">{t.source}</span></td>
                        <td>
                          <div>{t.pg}</div>
                          <div className="text-xsmall muted">{t.bed}</div>
                        </td>
                        <td>{t.paymentStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Bed Availability */}
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">Bed Availability — {selectedPg}</div>
              <div className="card__desc">Green = Occupied, Red = Available. Click to assign/release.</div>
            </div>
            <div className="card__content">
              <div className="row" style={{ justifyContent: "space-between", marginBottom: ".5rem" }}>
                <div className="row gap-2">
                  <div className="row gap-1"><span style={{ width: 12, height: 12, background: "#16a34a", display: "inline-block", borderRadius: 2 }}></span><span className="text-xsmall">Occupied</span></div>
                  <div className="row gap-1"><span style={{ width: 12, height: 12, background: "#dc2626", display: "inline-block", borderRadius: 2 }}></span><span className="text-xsmall">Available</span></div>
                </div>
                <div className="row gap-2 text-small">
                  <span>Occupied: <b>{occupiedCount}</b></span>
                  <span>Available: <b>{availableCount}</b></span>
                  <span>Total: <b>{bedMap.length}</b></span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6 }}>
                {bedMap.map((occ, idx) => (
                  <button
                    key={idx}
                    aria-label={`Bed ${idx + 1} ${occ ? "Occupied" : "Available"}`}
                    onClick={() => setBedMap((m) => m.map((v, i) => (i === idx ? !v : v)))}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: 4,
                      background: occ ? "#16a34a" : "#dc2626",
                    }}
                  />
                ))}
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
          style={{
            position: "fixed",
            inset: 0,
            background: "rgb(0 0 0 / 0.4)",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 50,
          }}
        >
          <div className="card" style={{ maxWidth: 900, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">Add Local Tenant</div>
                <div className="row gap-2">
                  <button className="btn btn--outline" onClick={closeAdd}>Cancel</button>
                  <button className="btn" onClick={saveTenant}>Save</button>
                </div>
              </div>
              <div className="card__desc">Capture all important details. Fields marked Required must be filled.</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                {/* Personal */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Personal</div>
                  <label className="text-xsmall">Full Name *</label>
                  <input value={form.fullName} onChange={(e) => onChange("fullName", e.target.value)} placeholder="e.g., Ankit Sharma" style={inputStyle(errors.fullName)} />
                  {errors.fullName && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.fullName}</div>}
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Gender</label>
                      <select value={form.gender} onChange={(e) => onChange("gender", e.target.value)} style={inputStyle()}> 
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Age</label>
                      <input type="number" value={form.age} onChange={(e) => onChange("age", e.target.value)} placeholder="22" style={inputStyle()} />
                    </div>
                  </div>
                  <label className="text-xsmall" style={{ marginTop: ".5rem" }}>Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 ..." style={inputStyle(errors.phone)} />
                  {errors.phone && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.phone}</div>}
                  <label className="text-xsmall" style={{ marginTop: ".5rem" }}>Email</label>
                  <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="name@example.com" style={inputStyle()} />
                </div>

                {/* Tenancy */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Tenancy</div>
                  <div className="row" style={{ gap: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Source</label>
                      <input value="Local" disabled style={inputStyle()} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">PG *</label>
                      <select value={form.pg} onChange={(e) => onChange("pg", e.target.value)} style={inputStyle(errors.pg)}>
                        {pgs.map((pg) => (
                          <option key={pg.name} value={pg.name}>{pg.name}</option>
                        ))}
                      </select>
                      {errors.pg && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.pg}</div>}
                    </div>
                  </div>
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Room Type *</label>
                      <select value={form.roomType} onChange={(e) => onChange("roomType", e.target.value)} style={inputStyle(errors.roomType)}>
                        <option value="">Select</option>
                        <option>Single</option>
                        <option>Double</option>
                        <option>Triple</option>
                      </select>
                      {errors.roomType && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.roomType}</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Bed Label *</label>
                      <input value={form.bedLabel} onChange={(e) => onChange("bedLabel", e.target.value)} placeholder="e.g., B-101" style={inputStyle(errors.bedLabel)} />
                      {errors.bedLabel && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.bedLabel}</div>}
                    </div>
                  </div>
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Check-in *</label>
                      <input type="date" value={form.checkIn} onChange={(e) => onChange("checkIn", e.target.value)} style={inputStyle(errors.checkIn)} />
                      {errors.checkIn && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.checkIn}</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Expected Stay (months)</label>
                      <input type="number" value={form.stayMonths} onChange={(e) => onChange("stayMonths", e.target.value)} placeholder="6" style={inputStyle()} />
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>ID & Documents</div>
                  <label className="text-xsmall">ID Proof Type *</label>
                  <select value={form.idType} onChange={(e) => onChange("idType", e.target.value)} style={inputStyle(errors.idType)}>
                    <option value="">Select</option>
                    <option>Aadhaar</option>
                    <option>Passport</option>
                    <option>Driving License</option>
                    <option>Voter ID</option>
                  </select>
                  {errors.idType && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.idType}</div>}
                  <label className="text-xsmall" style={{ marginTop: ".5rem" }}>ID Number *</label>
                  <input value={form.idNumber} onChange={(e) => onChange("idNumber", e.target.value)} placeholder="Enter ID number" style={inputStyle(errors.idNumber)} />
                  {errors.idNumber && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.idNumber}</div>}
                </div>

                {/* Address */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Permanent Address</div>
                  <label className="text-xsmall">Address</label>
                  <textarea value={form.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Street, Area" rows={3} style={inputStyle()} />
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">City</label>
                      <input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="City" style={inputStyle()} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">State</label>
                      <input value={form.state} onChange={(e) => onChange("state", e.target.value)} placeholder="State" style={inputStyle()} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Pincode</label>
                      <input value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="560001" style={inputStyle()} />
                    </div>
                  </div>
                </div>

                {/* Emergency */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Emergency Contact</div>
                  <label className="text-xsmall">Name *</label>
                  <input value={form.emergencyName} onChange={(e) => onChange("emergencyName", e.target.value)} placeholder="Guardian name" style={inputStyle(errors.emergencyName)} />
                  {errors.emergencyName && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.emergencyName}</div>}
                  <label className="text-xsmall" style={{ marginTop: ".5rem" }}>Phone *</label>
                  <input value={form.emergencyPhone} onChange={(e) => onChange("emergencyPhone", e.target.value)} placeholder="+91 ..." style={inputStyle(errors.emergencyPhone)} />
                  {errors.emergencyPhone && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.emergencyPhone}</div>}
                </div>

                {/* Payments */}
                <div className="list-item">
                  <div className="mb-1" style={{ fontWeight: 600 }}>Payments</div>
                  <div className="row" style={{ gap: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Monthly Rent (₹) *</label>
                      <input type="number" value={form.rent} onChange={(e) => onChange("rent", e.target.value)} placeholder="8000" style={inputStyle(errors.rent)} />
                      {errors.rent && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.rent}</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Security Deposit (₹) *</label>
                      <input type="number" value={form.deposit} onChange={(e) => onChange("deposit", e.target.value)} placeholder="15000" style={inputStyle(errors.deposit)} />
                      {errors.deposit && <div className="text-xsmall" style={{ color: "#dc2626" }}>{errors.deposit}</div>}
                    </div>
                  </div>
                  <div className="row" style={{ gap: ".5rem", marginTop: ".5rem" }}>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Payment Status</label>
                      <select value={form.paymentStatus} onChange={(e) => onChange("paymentStatus", e.target.value)} style={inputStyle()}>
                        <option>Pending</option>
                        <option>Paid</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="text-xsmall">Food Plan</label>
                      <select value={form.foodPlan} onChange={(e) => onChange("foodPlan", e.target.value)} style={inputStyle()}>
                        <option>None</option>
                        <option>Veg</option>
                        <option>Non-Veg</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="list-item" style={{ gridColumn: "1 / -1" }}>
                  <div className="mb-1" style={{ fontWeight: 600 }}>Notes</div>
                  <textarea value={form.notes} onChange={(e) => onChange("notes", e.target.value)} placeholder="Any special requests or remarks" rows={3} style={inputStyle()} />
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
