import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays, CircleAlert, Home, IndianRupee, LogOut, Plus, Star, User, Wallet } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import styles from "./OwnerDashboard.module.scss";
import "@/styles/dashboard.scss";
import { getTotals, pgs } from "@/lib/data";

const owner = { name: "Rahul Verma", initials: "RV" };

function currency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function OwnerDashboard() {
  const summary = useMemo(() => `You have 3 active PGs, 4 new booking requests, and ₹27,500 pending payments.`, []);
  const donutData = [
    { name: "Occupied", value: 78, fill: "currentColor" },
    { name: "Available", value: 22, fill: "#c7c7c7" },
  ];

  const totals = getTotals();
  const totalBeds = totals.totalBeds;
  const totalAvailable = totals.totalAvailable;
  const totalOccupied = totals.totalOccupied;
  const localVsSiteData = [
    { name: "Local", value: totals.localCount, fill: "currentColor" },
    { name: "Site", value: totals.siteCount, fill: "#c7c7c7" },
  ];

  // Payments snapshot
  const receivedThisMonth = totals.paidAmt;
  const pending = totals.pendingAmt;
  const overdue = 0; // You can compute overdue if you add logic

  return (
    <div className={styles.page}>
      {/* Header / Navbar */}
      <header className={styles.header}>
        <div className={styles.header__inner}>
          <div className={`${styles.row} ${styles["gap-2"]}`}> 
            <Home size={20} />
            <nav className={styles.header__nav}>
              <Link to="/">Dashboard</Link>
              <Link to="/tenants">Tenants & Occupancy</Link>
              <Link to="#">My PGs</Link>
              <Link to="#">Bookings</Link>
              <Link to="/payments">Payments</Link>
              <Link to="#">Support</Link>
            </nav>
          </div>
          <div className={`${styles.row} ${styles["gap-2"]}`}> 
            <button className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--icon"]}`} aria-label="Notifications">
              <Bell size={16} />
            </button>
            <div className={`${styles.row} ${styles["gap-2"]}`}> 
              <span className={styles.avatar}>{owner.initials}</span>
              <span className={styles["text-small"]}>{owner.name}</span>
            </div>
            <button className={`${styles.btn} ${styles["btn--ghost"]} ${styles["btn--icon"]}`} aria-label="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className={`${styles.container} ${styles["grid-main"]}`}> 
        {/* Welcome */}
        <section className={styles["span-all"]}>
          <div className={styles.card}>
            <div className={styles.card__header}>
              <div className={styles.card__title}>
                <span>Welcome back, {owner.name.split(" ")[0]} 👋</span>
                <div>
                  <span className={`${styles.badge} ${styles["badge--outline"]}`}>Active PGs: 3</span>
                  <span className={`${styles.badge} ${styles["badge--outline"]}`}>New Requests: 4</span>
                  <span className={`${styles.badge} ${styles["badge--outline"]}`}>Pending: {currency(27500)}</span>
                </div>
              </div>
              <div className={styles.card__desc}>{summary}</div>
            </div>
            <div className={styles.card__content}>
              <div className={styles["quick-actions"]}>
                <Link to="/create" className={`${styles.btn} ${styles["btn--block"]}`}> <Plus size={16} /> ➕ Create New PG</Link>
                <Link to="/pgs" className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--block"]}`}> <Home size={16} /> 🏠 View My PGs</Link>
                <Link to="/bookings" className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--block"]}`}> <CalendarDays size={16} /> 📅 View Bookings</Link>
                <Link to="/payments" className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--block"]}`}> <Wallet size={16} /> 💰 Manage Payments</Link>
                <button className={`${styles.btn} ${styles["btn--outline"]} ${styles["btn--block"]}`}> <User size={16} /> ✏️ Edit Profile</button>
              </div>

              {/* Top overview cards with deep links to Tenants & Occupancy */}
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: "1rem" }}>
                <Link to="/tenants" className="stat" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="stat__label">Total Beds</div>
                  <div className="stat__value">{totalBeds}</div>
                </Link>
                <Link to="/tenants" className="stat" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="stat__label">Occupied</div>
                  <div className="stat__value">{totalOccupied}</div>
                </Link>
                <Link to="/tenants" className="stat" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="stat__label">Available</div>
                  <div className="stat__value">{totalAvailable}</div>
                </Link>
                <Link to="/tenants" className="list-item" style={{ padding: 0, textDecoration: "none", color: "inherit" }}>
                  <div className="row" style={{ justifyContent: "space-between", padding: ".75rem" }}>
                    <div>
                      <div className="text-small" style={{ fontWeight: 600 }}>Local vs Site</div>
                      <div className="text-xsmall muted">Tenant source split</div>
                    </div>
                    <div style={{ width: 100, height: 100 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={localVsSiteData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={45} stroke="none" />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Left column: stats/widgets */}
        <section className="span-2">
          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">📊 Occupancy Overview</div>
              <div className="card__desc">Occupied vs Available beds</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="list-item" style={{ padding: 0 }}>
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} stroke="none" />
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="row-start" style={{ flexDirection: "column", gap: ".5rem" }}>
                  <div className="kpi">78%</div>
                  <div className="text-small muted">of total beds are occupied</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">📅 Latest Booking Requests</div>
              <div className="card__desc">Review and act on recent requests</div>
            </div>
            <div className="card__content">
              <div className="row-start gap-3" style={{ flexDirection: "column" }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="list-item row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <div className="text-small" style={{ fontWeight: 600 }}>John Doe • Sunshine Villa</div>
                      <div className="text-xsmall muted">Deluxe Room • Today • {currency(7500)}</div>
                    </div>
                    <div className="row gap-2">
                      <button className="btn btn--outline text-small">Reject</button>
                      <button className="btn text-small">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">💰 Payments Snapshot</div>
              <div className="card__desc">This month</div>
            </div>
            <div className="card__content">
              <div className="grid-main" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="stat"><div className="stat__label">Received</div><div className="stat__value">{currency(receivedThisMonth)}</div></div>
                <div className="stat"><div className="stat__label">Pending</div><div className="stat__value">{currency(pending)}</div></div>
                <div className="stat"><div className="stat__label">Overdue</div><div className="stat__value">{currency(overdue)}</div></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">⭐ Latest Reviews</div>
              <div className="card__desc">Recent tenant feedback</div>
            </div>
            <div className="card__content row-start gap-3" style={{ flexDirection: "column" }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="list-item">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="text-small" style={{ fontWeight: 600 }}>Jane Smith • Moonlight PG</div>
                    <div className="row gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="currentColor" fill={i < 4 ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <div className="text-small muted" style={{ marginTop: ".25rem" }}>“Great place to stay!”</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right column: management & alerts */}
        <section className="span-1">
          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">🏠 PG Management</div>
              <div className="card__desc">Your properties overview</div>
            </div>
            <div className="card__content">
              <div className="list-item" style={{ padding: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>PG</th>
                      <th>Avail</th>
                      <th>Rent</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pgs.map((pg) => (
                      <tr key={pg.name}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{pg.name}</div>
                          <div className="text-xsmall muted">{pg.location}</div>
                        </td>
                        <td>{pg.available}/{pg.total}</td>
                        <td>{pg.rent}</td>
                        <td><span className="badge badge--outline">{pg.status}</span></td>
                        <td>
                          <Link to={`/pgs/${encodeURIComponent(pg.name)}`} className="btn btn--outline text-small">View</Link>
                          <Link to={`/pgs/${encodeURIComponent(pg.name)}?edit=1`} className="btn btn--outline text-small">Edit</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row" style={{ justifyContent: "flex-end", gap: ".5rem", marginTop: ".75rem" }}>
                <button className="btn btn--outline text-small">View</button>
                <button className="btn btn--outline text-small">Edit</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">Notifications & Alerts</div>
              <div className="card__desc">Important actions needed</div>
            </div>
            <div className="card__content row-start gap-3" style={{ flexDirection: "column" }}>
              <div className="alert">
                <div className="row gap-2">
                  <CircleAlert size={16} />
                  <div className="text-small">Police verification pending for <span style={{ fontWeight: 600 }}>Sunshine Villa</span>.</div>
                </div>
                <button className="btn btn--outline text-small">Resolve</button>
              </div>
              <div className="alert">
                <div className="row gap-2">
                  <IndianRupee size={16} />
                  <div className="text-small">3 tenants haven’t paid rent yet.</div>
                </div>
                <button className="btn btn--outline text-small">View</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">Support & Help</div>
              <div className="card__desc">We’re here for you</div>
            </div>
            <div className="card__content row-start gap-3" style={{ flexDirection: "column" }}>
              <button className="btn btn--outline btn--block">Browse FAQs</button>
              <button className="btn btn--block">Contact Support</button>
              <div className="list-item text-small">
                <div className="mb-1" style={{ fontWeight: 600 }}>Tips</div>
                <p className="muted">5 ways to attract more tenants: good photos, clear pricing, flexible terms, fast replies, and clean common spaces.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="span-all" style={{ marginTop: "1rem" }}>
          <div className="row" style={{ justifyContent: "center", gap: ".75rem" }}>
            <Link to="#" className="text-xsmall muted">Terms</Link>
            <span className="text-xsmall muted">•</span>
            <Link to="#" className="text-xsmall muted">Privacy</Link>
            <span className="text-xsmall muted">•</span>
            <Link to="#" className="text-xsmall muted">About Us</Link>
            <span className="text-xsmall muted">•</span>
            <Link to="#" className="text-xsmall muted">Help Center</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
