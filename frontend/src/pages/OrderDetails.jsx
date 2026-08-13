import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Truck,
  ClipboardCheck,
  XCircle,
} from "lucide-react";

import { orderService } from "../services/orderService";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setLoading(true);

        const data = await orderService.getOrderDetails(orderId);

        setOrder({
          orderId: data.orderId,
          totalAmount: data.totalAmount,
          status: data.status,
          orderDate: data.orderDate,
        });

        setOrderItems(data.items || []);
      } catch (error) {
        console.error("Error loading order details:", error);
        showToast("Failed to load order details", "error");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId, navigate, showToast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-secondary-500">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) return null;

  const date = new Date(order.orderDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const orderStatusFlow = [
    { key: "PENDING", label: "Ordered" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "PACKED", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentStatus = String(order.status || "").toUpperCase();
  const currentIndex = currentStatus === "CANCELLED"
    ? -1
    : orderStatusFlow.findIndex((step) => step.key === currentStatus);

  const canCancelOrder = ["PENDING", "CONFIRMED"].includes(currentStatus);

  const handleCancelOrder = async () => {
    if (!user?.userId || !canCancelOrder) return;

    try {
      setCancelLoading(true);
      await orderService.cancelOrder(user.userId, order.orderId);
      const refreshed = await orderService.getOrderDetails(order.orderId);
      setOrder({
        orderId: refreshed.orderId,
        totalAmount: refreshed.totalAmount,
        status: refreshed.status,
        orderDate: refreshed.orderDate,
      });
      showToast("Order cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling order:", error);
      showToast(error?.response?.data?.message || "This order cannot be cancelled right now.", "error");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-4">
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-secondary-100 dark:border-secondary-800 pb-6">
          <div>
            <h1 className="font-outfit font-extrabold text-3xl text-secondary-900 dark:text-white">
              Order Details
            </h1>

            <p className="text-xs text-secondary-400 mt-1">
              Order #{order.orderId} placed on {date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold">Status:</span>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus === "CANCELLED"
              ? "bg-rose-100 text-rose-700"
              : "bg-primary-100 text-primary-700"}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {currentStatus !== "CANCELLED" && (
        <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white">Order Tracking</h3>
              <p className="text-xs text-secondary-500 mt-1">Current status: {orderStatusFlow[Math.max(currentIndex, 0)]?.label || order.status}</p>
            </div>

            {canCancelOrder && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-60"
              >
                <XCircle className="w-4 h-4" />
                {cancelLoading ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
            {orderStatusFlow.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              const isCancelled = currentStatus === "CANCELLED";

              return (
                <div key={step.key} className="relative flex flex-col items-center text-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isCancelled
                      ? "border-secondary-200 bg-secondary-100 text-secondary-500"
                      : isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : isCurrent
                          ? "border-primary-500 bg-primary-500 text-white"
                          : "border-secondary-200 bg-secondary-100 text-secondary-400"
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index === 0 ? <ClipboardCheck className="w-5 h-5" /> : index === 3 ? <Truck className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <p className={`mt-3 text-[11px] font-bold ${isCancelled ? "text-secondary-500" : isCompleted || isCurrent ? "text-primary-700 dark:text-primary-300" : "text-secondary-500"}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentStatus === "CANCELLED" && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 rounded-3xl p-4 text-sm font-medium">
          This order was cancelled and can no longer be processed.
        </div>
      )}
            {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Left: Products */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl shadow-sm">

            <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white pb-2 border-b border-secondary-100 dark:border-secondary-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary-500" />
              Items in Order
            </h3>

            <div className="space-y-4 mt-4">

              {orderItems.length === 0 ? (
                <p className="text-center text-secondary-500 py-6">
                  No items found for this order.
                </p>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 py-3 border-b border-secondary-100 dark:border-secondary-800 last:border-0"
                  >

                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-secondary-100 shrink-0">

                      <img
                        src={item.imageUrl || "/no-image.png"}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/no-image.png";
                        }}
                        className="w-full h-full object-cover"
                      />

                    </div>

                    {/* Product Info */}
                    <div className="flex-1">

                      <h4 className="font-outfit font-bold text-secondary-900 dark:text-white">
                        {item.productName}
                      </h4>

                      <p className="text-sm text-secondary-500 mt-1">
                        Quantity : {item.quantity}
                      </p>

                    </div>

                    {/* Price */}
                    <div className="text-right">

                      <p className="font-bold text-secondary-900 dark:text-white">
                        ₹{item.price}
                      </p>

                      <p className="text-xs text-secondary-500">
                        Total : ₹{item.price * item.quantity}
                      </p>

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>
        </div>

                {/* Right: Payment Summary */}
        <div className="space-y-6">

          <div className="bg-white dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 rounded-3xl shadow-sm">

            <h3 className="font-outfit font-bold text-base text-secondary-900 dark:text-white pb-2 border-b border-secondary-100 dark:border-secondary-800">
              Payment Summary
            </h3>

            <div className="space-y-4 mt-4">

              <div className="flex justify-between text-secondary-500">
                <span>Payment Status</span>

                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  SUCCESS
                </span>
              </div>

              {currentStatus === "CANCELLED" && (
                <div className="flex justify-between text-secondary-500">
                  <span>Cancellation</span>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    CANCELLED
                  </span>
                </div>
              )}

              <div className="flex justify-between text-secondary-500">
                <span>Shipping Fees</span>

                <span className="text-emerald-600 font-semibold">
                  FREE
                </span>
              </div>

              <div className="border-t border-secondary-100 dark:border-secondary-800 pt-4 flex justify-between items-center">

                <span className="font-outfit font-extrabold text-secondary-900 dark:text-white">
                  Grand Total
                </span>

                <span className="flex items-center font-outfit font-extrabold text-secondary-900 dark:text-white">
                  <DollarSign className="w-4 h-4" />
                  {order.totalAmount}
                </span>

              </div>

            </div>

            <div className="mt-6 p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-950 border border-secondary-200 dark:border-secondary-800 flex items-center gap-3">

              <ShieldCheck className="w-8 h-8 text-primary-500 shrink-0" />

              <div className="text-xs text-secondary-500 leading-relaxed">
                Order record is securely stored.
                Please contact support for any delivery or payment issues.
              </div>

            </div>

          </div>

        </div>

      </div>
          </div>
  );
};

export default OrderDetails;