import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pgs, tenants } from "@/lib/data";

export default function PgDetail() {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");
  const pg = pgs.find(p => p.name === decodedName);
  const relatedTenants = useMemo(() => tenants.filter(t => t.pg === decodedName), [decodedName]);

  const [tab, setTab] = useState<"overview" | "beds" | "tenants">("overview");

  if (!pg) {
    return (
      <div className="page">
        <main className="container">
          <div className="card">
            <div className="card__header"><div className="card__title text-base">PG Not Found</div></div>
            <div className="card__content"><Link to="/pgs" className="btn btn--outline">Back to My PGs</Link></div>
          </div>
        </main>
      </div>
    );
  }

  // simple synthetic bed map
  const total = pg.total;
  const occupied = total - pg.available;
  const bedMap = Array(total).fill(false).map((_, i) => i < occupied);

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <nav className="header__nav">
            <Link to="/">Dashboard</Link>
            <Link to="/pgs">My PGs</Link>
            <span className="text-small" aria-current="page">{pg.name}</span>
          </nav>
        </div>
      </header>

      <main className="container grid-main">
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">{pg.name}</div>
                <div className="row gap-2">
                  <button className={`btn btn--outline ${tab === "overview" ? "" : ""}`} onClick={() => setTab("overview")}>Overview</button>
                  <button className="btn btn--outline" onClick={() => setTab("beds")}>Beds</button>
                  <button className="btn btn--outline" onClick={() => setTab("tenants")}>Tenants</button>
                </div>
              </div>
              <div className="card__desc">{pg.location} • {pg.available}/{pg.total} available • {pg.rent}</div>
            </div>

            <div className="card__content">
              {tab === "overview" && (
                <div className="grid-main" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  <div className="stat"><div className="stat__label">Total Beds</div><div className="stat__value">{pg.total}</div></div>
                  <div className="stat"><div className="stat__label">Occupied</div><div className="stat__value">{occupied}</div></div>
                  <div className="stat"><div className="stat__label">Available</div><div className="stat__value">{pg.available}</div></div>
                </div>
              )}

              {tab === "beds" && (
                <div>
                  <div className="text-small muted" style={{ marginBottom: ".5rem" }}>Green = Occupied, Red = Available</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 6 }}>
                    {bedMap.map((occ, idx) => (
                      <div key={idx} style={{ width: "100%", aspectRatio: "1/1", border: "1px solid var(--border-subtle)", borderRadius: 4, background: occ ? "#16a34a" : "#dc2626" }} />
                    ))}
                  </div>
                </div>
              )}

              {tab === "tenants" && (
                <div className="list-item" style={{ padding: 0 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Bed</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedTenants.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 600 }}>{t.name}</td>
                          <td className="text-small">{t.contact}</td>
                          <td>{t.bed}</td>
                          <td>{t.paymentStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
