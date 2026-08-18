import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Package, CreditCard, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { orderService } from '../services/orderService';
import { addressService } from '../services/addressService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoiceData = async () => {
      try {
        setLoading(true);
        console.log(`Invoice request: orderId=${orderId}`);
        const data = await orderService.getOrderDetails(orderId);
        console.log(`Invoice response: status=200, dataReceived=${!!data}`);

        setOrder({
          orderId: data.orderId,
          totalAmount: data.totalAmount,
          status: data.status,
          orderDate: data.orderDate,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
        });
        setOrderItems(data.items || []);

        // Load customer addresses to find shipping information
        if (data.userId) {
          try {
            const addressList = await addressService.getAddresses(data.userId);
            const defaultAddr = addressList.find((addr) => addr.isDefault) || addressList[0] || null;
            setAddress(defaultAddr);
          } catch (addrErr) {
            console.error('Error loading address for invoice:', addrErr);
          }
        }
      } catch (err) {
        console.log(`Invoice response: status=${err.response?.status || 'network_error'}`);
        console.error('Error loading invoice details:', err);
        showToast('Unable to load invoice details. Please try again.', 'error');
        if (user?.role === 'ADMIN') {
          navigate('/admin/orders');
        } else {
          navigate('/profile');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) {
      loadInvoiceData();
    }
  }, [orderId, user, navigate, showToast]);

  const handleDownloadPDF = () => {
    if (!order) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Branding Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(214, 122, 87); // #D67A57
    doc.text('CRAFTNEST', 20, 25);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('HANDMADE CRAFTS', 20, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55); // #1F2937
    doc.text('INVOICE', 140, 25);

    // Header divider line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 35, 190, 35);

    // Metadata Info
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Number:', 20, 44);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${order.orderId}`, 50, 44);

    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Date:', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(order.orderDate).toLocaleDateString(), 50, 50);

    doc.setFont('helvetica', 'bold');
    doc.text('Order Status:', 120, 44);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order.status), 145, 44);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Status:', 120, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('SUCCESS', 150, 50);

    // Metadata divider line
    doc.line(20, 56, 190, 56);

    // Bill To Customer Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(214, 122, 87);
    doc.text('BILL TO', 20, 66);

    doc.setFontSize(9);
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 20, 73);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order.customerName || ''), 50, 73);

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, 79);
    doc.setFont('helvetica', 'normal');
    doc.text(String(order.customerEmail || ''), 50, 79);

    let currentY = 79;

    if (address?.phone) {
      currentY += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Phone:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(String(address.phone), 50, currentY);
    }

    if (address) {
      currentY += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Address:', 20, currentY);
      doc.setFont('helvetica', 'normal');
      const addressString = `${address.streetAddress}, ${address.city}, ${address.state} - ${address.zipCode}`;
      const splitAddress = doc.splitTextToSize(addressString, 120);
      doc.text(splitAddress, 50, currentY);
      currentY += splitAddress.length * 5;
    } else {
      currentY += 5;
    }

    // Products table header
    currentY += 6;
    doc.setFillColor(247, 245, 240);
    doc.rect(20, currentY, 170, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text('Product Name', 22, currentY + 5.5);
    doc.text('Qty', 115, currentY + 5.5);
    doc.text('Unit Price', 135, currentY + 5.5);
    doc.text('Total', 165, currentY + 5.5);

    currentY += 8;
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'normal');

    // Draw item rows
    orderItems.forEach((item) => {
      const nameLines = doc.splitTextToSize(item.productName, 80);
      const heightNeeded = nameLines.length * 5;

      // Draw horizontal item border line if approaching new page
      doc.text(nameLines, 22, currentY + 4.5);
      doc.text(String(item.quantity), 115, currentY + 4.5);
      doc.text(`Rs. ${item.price}`, 135, currentY + 4.5);
      doc.text(`Rs. ${item.price * item.quantity}`, 165, currentY + 4.5);

      currentY += heightNeeded + 2;
      doc.setDrawColor(245, 245, 245);
      doc.line(20, currentY, 190, currentY);
    });

    // Summary Section
    currentY += 8;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', 135, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(`Rs. ${order.totalAmount}`, 165, currentY);

    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Shipping Fees:', 135, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text('Rs. 0', 165, currentY);

    currentY += 5;
    doc.setDrawColor(214, 122, 87);
    doc.setLineWidth(0.4);
    doc.line(130, currentY, 190, currentY);

    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(214, 122, 87);
    doc.text('GRAND TOTAL:', 135, currentY);
    doc.text(`Rs. ${order.totalAmount}`, 165, currentY);

    // Print Footer message
    currentY += 20;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(130, 130, 130);
    doc.text('Thank you for shopping with CraftNest!', 105, currentY, { align: 'center' });

    // Save and download pdf file
    doc.save(`CraftNest-Invoice-${order.orderId}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-secondary-500 font-medium animate-pulse">Loading invoice...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      {/* Header controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-secondary-100 dark:border-secondary-800 pb-6 mt-4">
        <button
          onClick={() => {
            if (user?.role === 'ADMIN') {
              navigate('/admin/orders');
            } else {
              navigate('/profile');
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary-500 hover:text-primary-500 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D67A57] hover:bg-[#c36a49] text-white px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-primary-500/10 cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4" />
          Download Invoice PDF
        </button>
      </div>

      {/* Invoice Card Container */}
      <div className="bg-[#FAF7F2] dark:bg-secondary-900 border border-secondary-200/50 dark:border-secondary-800 p-6 sm:p-12 rounded-[32px] shadow-sm text-secondary-800 dark:text-secondary-100 font-sans max-w-3xl mx-auto space-y-8">

        {/* Branding header metadata block */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-[#D67A57] font-black text-2xl tracking-[0.1em] font-outfit uppercase">
              CRAFTNEST
            </h2>
            <p className="text-[10px] text-secondary-450 dark:text-secondary-400 font-bold uppercase tracking-widest mt-0.5">
              HANDMADE CRAFTS
            </p>
          </div>
          <div className="text-right">
            <h1 className="font-outfit font-black text-2xl text-secondary-900 dark:text-white uppercase tracking-wider">
              INVOICE
            </h1>
            <p className="text-xs text-secondary-450 dark:text-secondary-400 mt-1 font-bold">
              #{order.orderId}
            </p>
          </div>
        </div>

        <hr className="border-secondary-200/60 dark:border-secondary-800" />

        {/* Info Grid block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="flex justify-between sm:justify-start gap-4">
              <span className="font-bold text-secondary-500 w-32">Invoice Number:</span>
              <span className="font-semibold text-secondary-800 dark:text-secondary-200">#{order.orderId}</span>
            </p>
            <p className="flex justify-between sm:justify-start gap-4">
              <span className="font-bold text-secondary-500 w-32">Invoice Date:</span>
              <span className="font-semibold text-secondary-800 dark:text-secondary-200">
                {new Date(order.orderDate).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="flex justify-between sm:justify-start gap-4">
              <span className="font-bold text-secondary-500 w-32">Order Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-[#B8633F] dark:text-[#F3C8AF]">
                {order.status}
              </span>
            </p>
            <p className="flex justify-between sm:justify-start gap-4">
              <span className="font-bold text-secondary-500 w-32">Payment Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600">
                SUCCESS
              </span>
            </p>
          </div>
        </div>

        <hr className="border-secondary-200/60 dark:border-secondary-800" />

        {/* Bill To Customer Section */}
        <div className="space-y-3">
          <h3 className="font-outfit font-bold text-xs uppercase tracking-widest text-[#D67A57] dark:text-[#F3C8AF]">
            BILL TO
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 leading-relaxed">
              <p>
                <strong className="text-secondary-500 block mb-0.5">Customer Name</strong>
                <span className="font-bold text-sm text-secondary-900 dark:text-white">{order.customerName}</span>
              </p>
              <p>
                <strong className="text-secondary-500 block mb-0.5">Email Address</strong>
                <span className="font-semibold text-secondary-800 dark:text-secondary-200">{order.customerEmail}</span>
              </p>
              {address?.phone && (
                <p>
                  <strong className="text-secondary-500 block mb-0.5">Phone Number</strong>
                  <span className="font-semibold text-secondary-800 dark:text-secondary-200">{address.phone}</span>
                </p>
              )}
            </div>

            {address && (
              <div>
                <strong className="text-secondary-500 block mb-1">Shipping Address</strong>
                <p className="font-medium text-secondary-800 dark:text-secondary-200 leading-relaxed bg-white/40 dark:bg-secondary-950/40 border border-secondary-200/50 dark:border-secondary-850 p-3 rounded-2xl">
                  {address.name}
                  <br />
                  {address.streetAddress}
                  <br />
                  {address.city}, {address.state} - {address.zipCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details items table */}
        <div className="space-y-3">
          <h3 className="font-outfit font-bold text-xs uppercase tracking-widest text-[#D67A57] dark:text-[#F3C8AF] flex items-center gap-1.5">
            <Package className="w-4 h-4" /> ORDER DETAILS
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-secondary-200/60 dark:border-secondary-800 bg-white dark:bg-secondary-950">
            <table className="min-w-full text-left text-xs divide-y divide-secondary-100 dark:divide-secondary-850">
              <thead className="bg-[#FAF7F2]/80 dark:bg-secondary-900/80 text-secondary-500 font-bold">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 dark:divide-secondary-850">
                {orderItems.map((item) => (
                  <tr key={item.productId} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-900/20">
                    <td className="px-4 py-4 font-bold text-secondary-900 dark:text-white max-w-[200px] truncate">
                      {item.productName}
                    </td>
                    <td className="px-4 py-4 text-center font-semibold">{item.quantity}</td>
                    <td className="px-4 py-4 text-right">₹{item.price}</td>
                    <td className="px-4 py-4 text-right font-bold text-secondary-900 dark:text-white">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing calculations details */}
        <div className="flex flex-col items-end gap-3 text-xs border-t border-secondary-200/60 dark:border-secondary-800 pt-6">
          <div className="flex justify-between w-64 text-secondary-500 font-medium">
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className="flex justify-between w-64 text-secondary-500 font-medium">
            <span>Shipping</span>
            <span>₹0</span>
          </div>
          <div className="flex justify-between w-64 border-t border-secondary-200/50 dark:border-secondary-800 pt-3 text-sm font-extrabold text-[#D67A57]">
            <span className="font-outfit uppercase">Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Secure seal check */}
        <div className="flex items-center gap-3 p-4 bg-white/40 dark:bg-secondary-950/40 rounded-2xl border border-secondary-200/50 dark:border-secondary-850 text-xs text-secondary-500 leading-relaxed justify-center sm:justify-start">
          <ShieldCheck className="w-6 h-6 text-primary-500 shrink-0" />
          <span>Official transaction invoice for CraftNest catalog. Securely generated and printed.</span>
        </div>

        <div className="text-center italic text-xs text-secondary-400 dark:text-secondary-500 pt-4 font-medium border-t border-secondary-200/40 dark:border-secondary-800/40">
          Thank you for shopping with CraftNest!
        </div>

      </div>
    </div>
  );
};

export default Invoice;
