import { Link } from "react-router-dom";
import { pgs } from "@/lib/data";

export default function MyPgs() {
  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <nav className="header__nav">
            <Link to="/">Dashboard</Link>
            <Link to="/pgs" aria-current="page">My PGs</Link>
            <Link to="/bookings">Bookings</Link>
          </nav>
        </div>
      </header>

      <main className="container grid-main">
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="card__title text-base">My PGs</div>
              <div className="card__desc">Overview of properties you manage.</div>
            </div>
            <div className="card__content">
              <div className="list-item" style={{ padding: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Location</th>
                      <th>Available</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pgs.map((pg) => (
                      <tr key={pg.name}>
                        <td style={{ fontWeight: 600 }}>{pg.name}</td>
                        <td className="text-small">{pg.location}</td>
                        <td>{pg.available}</td>
                        <td>{pg.total}</td>
                        <td><span className="badge badge--outline">{pg.status}</span></td>
                        <td>
                          <Link to={`/pgs/${encodeURIComponent(pg.name)}`} className="btn btn--outline text-small">View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
