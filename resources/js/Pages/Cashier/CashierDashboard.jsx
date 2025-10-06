import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";

export default function CashierDashboard({ role, user }) {
  const [search, setSearch] = useState(""); 
  const [serviceSearch, setServiceSearch] = useState(""); 

  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showReceipt, setShowReceipt] = useState(false);

  const [categories, setCategories] = useState([]);
  const [servicesAndItems, setServicesAndItems] = useState([]);

  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch categories and flatten services/items
  useEffect(() => {
    fetch("/nurse/cashier/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data || []);
        const combined = data?.flatMap((cat) => [
          ...(cat.services || []).map((s) => ({ ...s, type: "service" })),
          ...(cat.items || []).map((i) => ({ ...i, type: "item" })),
        ]) || [];
        setServicesAndItems(combined);
        setServices(combined);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch initial patients, pending payments, and transactions
  useEffect(() => {
    fetch("/nurse/cashier/patients")
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch(console.error);

    fetch("/nurse/cashier/pending-payments")
    .then(res => res.json())
    .then(data => setPendingPayments(data))
    .catch(console.error);


    fetch("/nurse/cashier/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : data.data || []))
      .catch(console.error);
  }, []);

  // Filtered lists
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name || ""} ${p.last_name || ""}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || `${p.user_id || ""}`.includes(search);
  });

  const filteredServicesAndItems = servicesAndItems.filter((entry) =>
    (entry.name || "").toLowerCase().includes(serviceSearch.toLowerCase().trim())
  );

  // Handlers
  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  };

 const handleShowMockReceipt = () => {
  if (!selectedPatient) return alert("Please select a patient!");
  if (cart.length === 0) return alert("Cart is empty!");
  if (!amountReceived) return alert("Please enter the amount received!");
  if (Number(amountReceived) < totalPrice)
    return alert("Amount received cannot be less than the total bill!");
  
  setShowReceipt(true);
};


  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCart([]);
   fetch(`/nurse/cashier/transactions?patient_id=${patient.user_id}`) 
  .then((res) => res.json())
  .then((data) => setTransactions(Array.isArray(data) ? data : data.data || []))
  .catch(console.error);

  };

  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");

    const service = servicesAndItems.find(
      (s) => s.id.toString() === selectedService || s.name === selectedService
    );
    if (!service) return;

    const existingIndex = cart.findIndex((c) => c.id === service.id);
    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...service, quantity }]);
    }

    setSelectedService("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (id) => setCart(cart.filter((c) => c.id !== id));

  const handleGenerateBill = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (cart.length === 0) return alert("Cart is empty!");
    alert(`Bill Generated for ${selectedPatient.first_name} ${selectedPatient.last_name}: ₱${totalPrice}`);
  };

const handleRecordPayment = async () => {
  try {
   const response = await fetch("/nurse/cashier/record-payment", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content"),
  },
  body: JSON.stringify({
    patient_id: selectedPatient.user_id,
    payment_method: paymentMethod,
    amount_received: amountReceived,
    total_price: totalPrice,
  }),
});

    console.log("✅ Payment recorded:", response.data);
  } catch (error) {
    console.error("❌ Failed to record payment:", error);
  }
};






  const searchPatients = (query) => {
    fetch(`/nurse/cashier/patients?q=${query}`)
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch(console.error);
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4 w-full">
            <h1 className="text-xl font-bold">Cashier Dashboard</h1>
            <input
              type="text"
              placeholder="Search patients by name or ID"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                searchPatients(e.target.value);
              }}
              className="border rounded px-3 py-1 text-sm flex-1 max-w-xs"
            />
          </div>
        </header>

        {/* Main Grid */}
        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="col-span-2 space-y-6">
            {selectedPatient && (
              <div className="border rounded p-4 mb-4">
                <h2 className="font-semibold">Patient Info</h2>
                <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p><strong>Balance:</strong> ₱{selectedPatient.balance ?? 0}</p>
              </div>
            )}

           {/* Add Services/Items */}
<div>
  <h2 className="font-semibold mb-2">Add Services / Items</h2>
  <input
    type="text"
    placeholder="Search services or medicines..."
    value={serviceSearch}
    onChange={(e) => setServiceSearch(e.target.value)}
    className="border rounded px-3 py-2 w-full mb-2"
  />

  <div className="flex items-center gap-4">
    <select
      className="border rounded px-3 py-2 flex-1"
      value={selectedService}
      onChange={(e) => setSelectedService(e.target.value)}
    >
      <option value="">Select Service/Item</option>
      {filteredServicesAndItems.map((s) => (
        <option key={`${s.type}-${s.id}`} value={s.id}>
          {s.name} - ₱{s.price}
        </option>
      ))}
    </select>
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      className="border rounded px-3 py-2 w-20"
    />
    <button
      onClick={handleAddToCart}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add
    </button>
  </div>

  {/* Cart Items */}
  {cart.map((item) => (
    <div
      key={item.id}
      className="flex justify-between items-center py-1 border-b last:border-b-0"
    >
      <span>
        {item.name} x {item.quantity}
      </span>
      <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
      <button
        onClick={() => handleRemoveFromCart(item.id)}
        className="text-red-600"
      >
        Remove
      </button>
    </div>
  ))}

  {/* 💰 Automatic Total */}
  {cart.length > 0 && (
    <div className="flex justify-between items-center mt-3 font-semibold text-blue-800">
      <span>Total Amount:</span>
      <span>₱ {totalPrice.toFixed(2)}</span>
    </div>
  )}
</div>

            {/* Process Payments */}
            <div>
              <h2 className="font-semibold mb-2">Process Payments</h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Amount Received"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  className="border rounded px-3 py-2 flex-1"
                />
                <select
                  className="border rounded px-3 py-2"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>GCash</option>
                </select>
              </div>
              <div className="flex gap-4">
         <button
              onClick={handleRecordPayment}
              disabled={!selectedPatient || !amountReceived}
              className={`px-4 py-2 rounded text-white ${
                !selectedPatient || !amountReceived
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Record Payment
            </button>

              <button
              onClick={handleShowMockReceipt}
              disabled={
                !selectedPatient ||
                cart.length === 0 ||
                !amountReceived ||
                Number(amountReceived) < totalPrice
              }
              className={`flex-1 py-2 rounded text-white ${
                !selectedPatient ||
                cart.length === 0 ||
                !amountReceived ||
                Number(amountReceived) < totalPrice
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              Show Receipt
            </button>

              </div>
            </div>
          </div>

    {/* Right Section */}
<div className="space-y-6">

  {/* 🧾 Selected Patient Display */}
  {selectedPatient && (
    <div className="border rounded-lg p-4 bg-blue-50 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-blue-800">Selected Patient</h2>
          <p className="text-sm mt-1">
            <strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}
          </p>
          <p className="text-sm">
            <strong>ID:</strong> {selectedPatient.user_id}
          </p>
          <p className="text-sm">
            <strong>Balance:</strong> ₱{Number(selectedPatient.balance ?? 0).toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => setSelectedPatient(null)}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
    </div>
  )}

  {/* Select Patient */}
  {filteredPatients.length > 0 && (
    <div className="border rounded p-4 max-h-64 overflow-y-auto">
      <h2 className="font-semibold mb-3">Select Patient</h2>
      {filteredPatients.map((p) => (
        <div
          key={p.user_id}
          className={`p-2 border rounded cursor-pointer mb-2 ${
            selectedPatient?.user_id === p.user_id
              ? "bg-blue-200 border-blue-400"
              : "hover:bg-blue-100"
          }`}
          onClick={() => handleSelectPatient(p)}
        >
          <p className="font-semibold">{p.first_name} {p.last_name}</p>
          <p className="text-sm text-gray-600">ID: {p.user_id}</p>
        </div>
      ))}
    </div>
  )}

  {search && filteredPatients.length === 0 && (
    <p className="text-gray-500">No patients found</p>
  )}

            {/* Pending Payments */}
            {selectedPatient && (
              <div className="border rounded p-4">
                <h2 className="font-semibold mb-3">Pending Payments</h2>
                {pendingPayments.filter(pp => pp.patient_id === selectedPatient.user_id).length > 0 ? (
                  pendingPayments.filter(pp => pp.patient_id === selectedPatient.user_id).map((p) => (
                    <div key={p.id} className="p-2 border rounded">
                      <p className="font-semibold">{p.patientName}</p>
                      <p className="text-xs text-gray-500">{p.date}</p>
                      <p className="font-bold">₱ {p.amount}</p>
                      <p className="text-orange-500">{p.status}</p>
                    </div>
                  ))
                ) : <p className="text-gray-500 text-sm">No pending payments</p>}
              </div>
            )}

            {/* Past Transactions */}
            {transactions.map((t) => (
              <div key={t.id} className="p-2 border rounded">
                <p className="font-semibold">{t.patientName}</p>
                <p className="text-xs text-gray-500">{t.date}</p>
                <p className="font-bold">₱ {Number(t.amount).toFixed(2)}</p>
                <p className="text-green-600">{t.status}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Modal */}
        {/* Receipt Modal */}
{showReceipt && selectedPatient && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto shadow-lg"
      id="receipt-content"
    >
      {/* 🧾 Receipt Header */}
      <div className="text-center mb-4">
        <img src="/images/New_Logo.png" alt="Company Logo" className="mx-auto w-32 mb-2" />
        <h2 className="text-lg font-bold">Jorge & Co Medical Center</h2>
        <p className="text-sm">University of Mindanao, Matina Davao City</p>
        <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
      </div>

      {/* Receipt Details */}
      <div className="mb-2 text-sm">
        <p><strong>Cashier/Nurse:</strong> {user?.first_name} {user?.last_name}</p>
        <p><strong>Patient:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
        <p><strong>Patient Balance:</strong> ₱{Number(selectedPatient.balance ?? 0).toFixed(2)}</p>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Cash Received:</strong> ₱{Number(amountReceived).toFixed(2)}</p>
      </div>

      <hr className="my-2" />

      {/* Items Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Item/Service</th>
            <th className="border px-2 py-1">Qty</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            return (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{qty}</td>
                <td className="border px-2 py-1">₱{price.toFixed(2)}</td>
                <td className="border px-2 py-1">₱{(price * qty).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Total and Change */}
      <div className="flex justify-between mt-2 font-semibold text-sm">
        <span>Total:</span>
        <span>₱{totalPrice.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span>Change:</span>
        <span>₱{(Number(amountReceived) - totalPrice).toFixed(2)}</span>
      </div>

      {/* Buttons (Hidden When Printing) */}
      <div className="mt-5 flex flex-col gap-2 print:hidden">
        <div className="flex justify-between gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            🖨️ Print Receipt
          </button>

          <button
            onClick={() => setShowReceipt(false)}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>

        <button
          disabled={!selectedPatient || cart.length === 0 || !amountReceived}
          onClick={() =>
            handleRecordPayment({
              patient_id: selectedPatient?.user_id,
              payment_method: paymentMethod,
              amount_received: amountReceived,
              total_price: totalPrice,
            })
          }
          className={`w-full py-2 rounded text-white ${
            !selectedPatient || cart.length === 0 || !amountReceived
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Record Payment
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
