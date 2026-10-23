import { useEffect, useState, useMemo } from "react";
import { adminRequest } from "../../lib/adminApi.js";
import {
  AdminCard,
  AdminPageHeader,
  AdminPill,
  AdminShell,
  AdminStatCard,
} from "./shared.jsx";

const STATUS_OPTIONS = ["Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

export function AdminOrdersPage({ pathname, onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (activeTab !== "all") params.append("status", activeTab);
      if (search.trim()) params.append("search", search.trim());

      const queryStr = params.toString() ? `?${params.toString()}` : "";
      const res = await adminRequest(`/admin/orders${queryStr}`);
      setOrders(res.data || []);
      if (res.stats) setStats(res.stats);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (orderId, targetStatus, notes = "") => {
    try {
      setStatusUpdating(true);
      setActionSuccess("");
      setError("");

      const res = await adminRequest(`/admin/orders/${orderId}/status`, {
        method: "PUT",
        body: { status: targetStatus, notes },
      });

      setActionSuccess(res.message || `Order status updated to ${targetStatus}`);

      // Update in state locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: targetStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: targetStatus }));
      }

      // Refresh full list and stats in background
      loadOrders();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Paid");
    setStatusNotes(order.notes || "");
    setActionSuccess("");
    setError("");
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setStatusNotes("");
  };

  return (
    <AdminShell
      pathname={pathname}
      onNavigate={onNavigate}
      title="Orders & Sales"
      subtitle="View customer orders, review purchased herbal products, and update fulfillment status for clients."
    >
      <div className="space-y-6">
        <AdminPageHeader
          title="Customer Orders"
          eyebrow="STORE OPERATIONS"
          description="Manage customer purchases, track fulfillment states, and provide instant status updates to customers."
        />

        {/* Alerts */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {actionSuccess && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {actionSuccess}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <AdminStatCard label="Total Orders" value={stats.total} />
          <AdminStatCard label="Paid" value={stats.paid} />
          <AdminStatCard label="Processing" value={stats.processing} />
          <AdminStatCard label="Shipped" value={stats.shipped} />
          <AdminStatCard label="Delivered" value={stats.delivered} />
          <AdminStatCard
            label="Gross Revenue"
            value={`NGN ${(stats.totalRevenue || 0).toLocaleString()}`}
          />
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-200 pb-2 sm:border-0 sm:pb-0">
            {[
              { id: "all", label: "All Orders", count: stats.total },
              { id: "Paid", label: "Paid", count: stats.paid },
              { id: "Processing", label: "Processing", count: stats.processing },
              { id: "Shipped", label: "Shipped", count: stats.shipped },
              { id: "Delivered", label: "Delivered", count: stats.delivered },
              { id: "Cancelled", label: "Cancelled", count: stats.cancelled },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#2f2b27] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order #, email, items..."
                className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-8 text-xs text-gray-900 focus:border-[#63ac18] focus:outline-none focus:ring-1 focus:ring-[#63ac18]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setTimeout(loadOrders, 0);
                  }}
                  className="absolute right-2 top-1.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-md bg-[#63ac18] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#529113]"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Orders Table */}
        <AdminCard>
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              No orders found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Order #</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Items Ordered</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const statusClass =
                      STATUS_COLORS[order.status] ||
                      "bg-gray-100 text-gray-700 border-gray-200";

                    const itemsCount =
                      order.items && order.items.length
                        ? order.items.reduce((s, i) => s + (i.quantity || 1), 0)
                        : 1;

                    return (
                      <tr
                        key={order._id}
                        className="transition hover:bg-gray-50/70"
                      >
                        {/* Order # */}
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                          <button
                            type="button"
                            onClick={() => openOrderModal(order)}
                            className="text-[#63ac18] hover:underline"
                          >
                            #{order.orderNumber || order._id.slice(-6)}
                          </button>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                          {order.createdAt || order.paidAt
                            ? new Date(
                                order.createdAt || order.paidAt
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {order.customerName || "Customer"}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {order.customerEmail}
                          </div>
                          {order.customerPhone && (
                            <div className="text-[10px] text-gray-400">
                              {order.customerPhone}
                            </div>
                          )}
                        </td>

                        {/* Items */}
                        <td className="max-w-[220px] px-4 py-3">
                          <div className="truncate font-medium text-gray-800" title={order.productSummary}>
                            {order.productSummary || "Herbal Products"}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {itemsCount} item{itemsCount > 1 ? "s" : ""}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                          NGN {Number(order.total || 0).toLocaleString()}
                        </td>

                        {/* Payment */}
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                            <span>{order.paymentGateway || "Paystack"}</span>
                          </span>
                          {order.paymentReference && (
                            <div className="truncate text-[10px] text-gray-400" title={order.paymentReference}>
                              {order.paymentReference}
                            </div>
                          )}
                        </td>

                        {/* Status (with inline quick change) */}
                        <td className="whitespace-nowrap px-4 py-3">
                          <select
                            value={order.status || "Paid"}
                            disabled={statusUpdating}
                            onChange={(e) =>
                              handleUpdateStatus(order._id, e.target.value)
                            }
                            className={`rounded-md border px-2 py-1 text-xs font-semibold focus:outline-none ${statusClass}`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openOrderModal(order)}
                            className="rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        {/* Order Details Modal / Drawer */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Placed on{" "}
                    {new Date(
                      selectedOrder.createdAt || selectedOrder.paidAt || Date.now()
                    ).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6 px-6 py-5 text-xs text-gray-700">
                {/* Status Update Banner */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-semibold text-gray-800">
                    Update Order Status to Client
                  </h4>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 focus:border-[#63ac18] focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          Status: {st}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="Optional note to customer (e.g. Courier tracking #)"
                      className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-[#63ac18] focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={statusUpdating}
                      onClick={() =>
                        handleUpdateStatus(selectedOrder._id, newStatus, statusNotes)
                      }
                      className="rounded-md bg-[#63ac18] px-4 py-1.5 font-semibold text-white shadow-sm transition hover:bg-[#529113] disabled:opacity-50"
                    >
                      {statusUpdating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-500">
                    Updating status will instantly reflect in the customer's account dashboard and send a message to their inbox.
                  </p>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Customer & Delivery Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 p-3 sm:grid-cols-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Customer Name
                      </span>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.customerName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Email Address
                      </span>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Phone Number
                      </span>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.customerPhone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Payment Reference
                      </span>
                      <p className="font-mono font-medium text-gray-900">
                        {selectedOrder.paymentReference || "N/A"}
                      </p>
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="sm:col-span-2">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          Shipping Address
                        </span>
                        <p className="font-medium text-gray-900">
                          {[
                            selectedOrder.shippingAddress.line1,
                            selectedOrder.shippingAddress.line2,
                            selectedOrder.shippingAddress.city,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Items in this Order
                  </h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-gray-200 bg-gray-50 text-[10px] font-semibold uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-2">Item Name</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Unit Price</th>
                          <th className="px-4 py-2 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, idx) => (
                            <tr key={item._id || idx}>
                              <td className="px-4 py-2 font-medium text-gray-800">
                                {item.name}
                              </td>
                              <td className="px-4 py-2 text-center text-gray-600">
                                {item.quantity || 1}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-600">
                                NGN {Number(item.price || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                NGN{" "}
                                {(
                                  Number(item.price || 0) * (item.quantity || 1)
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-4 py-2 font-medium text-gray-800">
                              {selectedOrder.productSummary || "Standard Order"}
                            </td>
                            <td className="px-4 py-2 text-center text-gray-600">1</td>
                            <td className="px-4 py-2 text-right text-gray-600">
                              NGN {Number(selectedOrder.total || 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right font-semibold text-gray-900">
                              NGN {Number(selectedOrder.total || 0).toLocaleString()}
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold text-gray-900">
                        <tr>
                          <td colSpan="3" className="px-4 py-2 text-right">
                            Total Paid:
                          </td>
                          <td className="px-4 py-2 text-right text-sm text-[#63ac18]">
                            NGN {Number(selectedOrder.total || 0).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end border-t border-gray-200 px-6 py-3">
                <button
                  type="button"
                  onClick={closeOrderModal}
                  className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
