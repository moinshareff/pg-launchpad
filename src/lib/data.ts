// Shared mock data for dashboard, tenants, and payments pages
export type TenantSource = "Local" | "Site";
export type PaymentStatus = "Paid" | "Pending";

export interface PG {
  name: string;
  location: string;
  total: number; // total beds
  available: number; // available beds
  rent: string;
  status: "Active" | "Pending";
}

export interface Tenant {
  id: string;
  name: string;
  contact: string;
  source: TenantSource;
  pg: string; // PG name
  bed: string; // e.g., B-101
  paymentStatus: PaymentStatus;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  source: TenantSource;
  pg: string;
  amount: number;
  status: PaymentStatus;
  date: string; // ISO or human string for mock
  // Owner-recorded optional fields
  mode?: "Cash" | "UPI" | "Bank Transfer";
  reference?: string; // UPI ref / txn id / cheque no
  forMonth?: string; // e.g., 2025-09
  notes?: string;
}

export type BookingStatus = "New" | "Approved" | "Rejected";
export interface Booking {
  id: string;
  name: string;
  pg: string;
  roomType: "Single" | "Double" | "Triple";
  date: string; // human string for mock
  amount: number;
  status: BookingStatus;
}

export const pgs: PG[] = [
  { name: "Sunshine Villa", location: "BTM Layout", total: 40, available: 6, rent: "₹6k–12k", status: "Active" },
  { name: "City Nest", location: "HSR Sector 2", total: 28, available: 2, rent: "₹8k–15k", status: "Active" },
  { name: "Lake View PG", location: "Kudlu Gate", total: 24, available: 8, rent: "₹5k–9k", status: "Pending" },
];

export const tenants: Tenant[] = [
  { id: "T-1001", name: "Ankit Sharma", contact: "+91 98765 43210", source: "Local", pg: "Sunshine Villa", bed: "B-101", paymentStatus: "Paid" },
  { id: "T-1002", name: "Priya N", contact: "+91 99876 54321", source: "Site", pg: "City Nest", bed: "B-204", paymentStatus: "Pending" },
  { id: "T-1003", name: "Rohan Mehta", contact: "+91 88990 11223", source: "Local", pg: "Lake View PG", bed: "B-305", paymentStatus: "Paid" },
  { id: "T-1004", name: "Sana Khan", contact: "+91 77665 44332", source: "Site", pg: "City Nest", bed: "B-205", paymentStatus: "Paid" },
  { id: "T-1005", name: "Irfan Ali", contact: "+91 99001 22334", source: "Local", pg: "Sunshine Villa", bed: "B-102", paymentStatus: "Pending" },
  { id: "T-1006", name: "Neha Gupta", contact: "+91 91234 56780", source: "Local", pg: "Sunshine Villa", bed: "B-103", paymentStatus: "Paid" },
  { id: "T-1007", name: "Vikram Singh", contact: "+91 93456 78123", source: "Site", pg: "Lake View PG", bed: "B-306", paymentStatus: "Pending" },
  { id: "T-1008", name: "Aisha", contact: "+91 90000 11122", source: "Local", pg: "City Nest", bed: "B-106", paymentStatus: "Paid" },
  { id: "T-1009", name: "Manoj", contact: "+91 95555 66677", source: "Site", pg: "Sunshine Villa", bed: "B-107", paymentStatus: "Paid" },
  { id: "T-1010", name: "Divya", contact: "+91 96666 77788", source: "Local", pg: "Lake View PG", bed: "B-308", paymentStatus: "Paid" },
  { id: "T-1011", name: "Karthik", contact: "+91 97777 88899", source: "Site", pg: "Sunshine Villa", bed: "B-109", paymentStatus: "Pending" },
  { id: "T-1012", name: "Ritu", contact: "+91 98888 99900", source: "Local", pg: "City Nest", bed: "B-108", paymentStatus: "Paid" },
];

export const payments: Payment[] = [
  { id: "P-2001", tenantId: "T-1001", tenantName: "Ankit Sharma", source: "Local", pg: "Sunshine Villa", amount: 7500, status: "Paid", date: "2025-09-01", mode: "Cash" },
  { id: "P-2002", tenantId: "T-1002", tenantName: "Priya N", source: "Site", pg: "City Nest", amount: 12000, status: "Pending", date: "2025-09-03" },
  { id: "P-2003", tenantId: "T-1003", tenantName: "Rohan Mehta", source: "Local", pg: "Lake View PG", amount: 6000, status: "Paid", date: "2025-09-04", mode: "UPI", reference: "TXN123" },
  { id: "P-2004", tenantId: "T-1005", tenantName: "Irfan Ali", source: "Local", pg: "Sunshine Villa", amount: 9000, status: "Pending", date: "2025-09-05" },
  { id: "P-2005", tenantId: "T-1007", tenantName: "Vikram Singh", source: "Site", pg: "Lake View PG", amount: 6500, status: "Pending", date: "2025-09-06" },
  { id: "P-2006", tenantId: "T-1008", tenantName: "Aisha", source: "Local", pg: "City Nest", amount: 8000, status: "Paid", date: "2025-09-02", mode: "Bank Transfer", reference: "NEFT-991" },
  { id: "P-2007", tenantId: "T-1011", tenantName: "Karthik", source: "Site", pg: "Sunshine Villa", amount: 7000, status: "Pending", date: "2025-09-02" },
];

export const bookings: Booking[] = [
  { id: "BK-1042", name: "Ankit Sharma", pg: "Sunshine Villa", roomType: "Double", date: "Today 10:30", amount: 7500, status: "New" },
  { id: "BK-1041", name: "Priya N", pg: "City Nest", roomType: "Single", date: "Yesterday", amount: 12000, status: "New" },
  { id: "BK-1038", name: "Rohan Mehta", pg: "Lake View PG", roomType: "Triple", date: "2 days ago", amount: 6000, status: "New" },
  { id: "BK-1037", name: "Sana", pg: "City Nest", roomType: "Single", date: "3 days ago", amount: 9000, status: "Approved" },
  { id: "BK-1035", name: "Irfan", pg: "Sunshine Villa", roomType: "Double", date: "last week", amount: 8000, status: "Rejected" },
];

export function currency(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function getTotals() {
  const totalBeds = pgs.reduce((sum, pg) => sum + pg.total, 0);
  const totalAvailable = pgs.reduce((sum, pg) => sum + pg.available, 0);
  const totalOccupied = totalBeds - totalAvailable;
  const localCount = tenants.filter(t => t.source === "Local").length;
  const siteCount = tenants.filter(t => t.source === "Site").length;
  const paidAmt = payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmt = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  return { totalBeds, totalAvailable, totalOccupied, localCount, siteCount, paidAmt, pendingAmt };
}

// Build a synthetic bed map for a PG based on totals.
export function buildBedMap(pgName: string) {
  const pg = pgs.find(p => p.name === pgName);
  if (!pg) return [] as boolean[];
  const { total, available } = pg;
  const occupied = total - available;
  const map: boolean[] = Array(total).fill(false);
  for (let i = 0; i < occupied; i++) map[i] = true; // first N occupied
  return map;
}
