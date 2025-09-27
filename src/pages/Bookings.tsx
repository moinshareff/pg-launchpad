import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bookings as seedBookings, currency, BookingStatus } from "@/lib/data";

export default function Bookings() {
  const [status, setStatus] = useState<"All" | BookingStatus>("All");
  const bookings = useMemo(() => seedBookings.filter(b => (status === "All" ? true : b.status === status)), [status]);

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <nav className="header__nav">
            <Link to="/">Dashboard</Link>
            <Link to="/bookings" aria-current="page">Bookings</Link>
          </nav>
        </div>
      </header>

      <main className="container grid-main">
        <section className="span-all">
          <div className="card">
            <div className="card__header">
              <div className="row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="card__title text-base">Bookings</div>
                <div className="row gap-2">
                  <button className="btn btn--outline" onClick={() => setStatus("All")}>All</button>
                  <button className="btn btn--outline" onClick={() => setStatus("New")}>New</button>
                  <button className="btn btn--outline" onClick={() => setStatus("Approved")}>Approved</button>
                  <button className="btn btn--outline" onClick={() => setStatus("Rejected")}>Rejected</button>
                </div>
              </div>
              <div className="card__desc">Review and manage booking requests.</div>
            </div>
            <div className="card__content">
              <div className="list-item" style={{ padding: 0 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>PG</th>
                      <th>Room</th>
                      <th>Requested</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td style={{ fontWeight: 600 }}>{b.name}</td>
                        <td>{b.pg}</td>
                        <td>{b.roomType}</td>
                        <td className="text-small">{b.date}</td>
                        <td>{currency(b.amount)}</td>
                        <td><span className="badge badge--outline">{b.status}</span></td>
                        <td>
                          <div className="row" style={{ gap: ".5rem", justifyContent: "flex-end" }}>
                            <button className="btn btn--outline text-small">Reject</button>
                            <button className="btn text-small">Approve</button>
                          </div>
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
