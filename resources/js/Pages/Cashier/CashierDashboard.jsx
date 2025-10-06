import React, { useState, useEffect } from "react";
import Sidebar from '../../Components/Sidebar';

export default function CashierDashboard({ role, user }) {
  const [search, setSearch] = useState(""); // patient search
  const [serviceSearch, setServiceSearch] = useState(""); // service/item search

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

  // Fetch categories + flatten services/items
  useEffect(() => {
    fetch("/cashier/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        const combined = data.flatMap(cat => [
          ...cat.services.map(s => ({ ...s, type: "service" })),
          ...cat.items.map(i => ({ ...i, type: "item" })),
        ]);
        setServicesAndItems(combined);
        setServices(combined);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch initial data
  useEffect(() => {
    // Patients
    fetch(`http://localhost:8000/nurse/cashier/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Error fetching patients:", err));

    // Pending Payments
    fetch("http://localhost:8000/pending-payments")
      .then((res) => res.json())
      .then((data) => setPendingPayments(Array.isArray(data) ? data : data.data || []))
      .catch(console.error);

    // Transactions
    fetch("http://localhost:8000/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(Array.isArray(data) ? data : data.data || []))
      .catch(console.error);
  }, []);

  // Filter patients based on search input
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
    const id = `${p.user_id ?? ""}`;
    return fullName.includes(search.toLowerCase()) || id.includes(search);
  });

  // Filter services/items
  const filteredServicesAndItems = servicesAndItems.filter((entry) =>
    entry.name.toLowerCase().includes(serviceSearch.toLowerCase().trim())
  );

  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handlers
  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  }


  const handlePrintReceipt = () => {
  if (!selectedPatient) return alert("Please select a patient!");
  if (cart.length === 0) return alert("Cart is empty!");

  const logoPath = "/images/New_Logo.png"; // your logo path
  const companyName = "Jorge & Co Medical Center";
  const companyAddress = "University of Mindanao, Matina Davao City";
  const nurseName = user ? `${user.first_name} ${user.last_name}` : "N/A";
  const currentDate = new Date().toLocaleString();

  const printWindow = window.open("", "", "width=900,height=650");
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2, h3 { margin: 2px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          table, th, td { border: 1px solid #333; }
          th, td { padding: 8px; text-align: left; }
          .header { text-align: center; margin-bottom: 20px; }
          .header img { width: 160px; display: block; margin: 0 auto 5px; }
          .info { margin-bottom: 15px; }
          .footer { margin-top: 20px; font-size: 14px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoPath}" alt="Company Logo">
          <h2>${companyName}</h2>
          <p>${companyAddress}</p>
        </div>
        <div class="info">
          <p><strong>Cashier/Nurse:</strong> ${nurseName}</p>
          <p><strong>Patient:</strong> ${selectedPatient.first_name} ${selectedPatient.last_name}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        </div>
        <hr>
        <table>
          <thead>
            <tr>
              <th>Item/Service</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cart.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₱${item.price.toFixed(2)}</td>
                <td>₱${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <strong>Total: ₱${totalPrice.toFixed(2)}</strong>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCart([]);
    fetch(`http://localhost:8000/transactions?patient_id=${patient.user_id}`)
      .then((res) => res.json())
      .then(setTransactions)
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
  const handleShowReceipt = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (cart.length === 0) return alert("Cart is empty!");
    setShowReceipt(true);
  };
  const handleCloseReceipt = () => setShowReceipt(false);

  const handleGenerateBill = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (cart.length === 0) return alert("Cart is empty!");
    alert(`Bill Generated for ${selectedPatient.first_name} ${selectedPatient.last_name}: ₱${totalPrice}`);
  };

  const handleRecordPayment = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (!amountReceived || amountReceived < totalPrice) return alert("Insufficient payment.");
    alert(`Payment of ₱${amountReceived} via ${paymentMethod} recorded for ${selectedPatient.first_name}`);
  };

  // Patient search API (optional, dynamic search)
  const searchPatients = (query) => {
    if (!query) return setPatients([]);
    fetch(`http://localhost:8000/nurse/cashier/patients?q=${query}`)
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Error fetching patients:", err));
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
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

        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="col-span-2 space-y-6">
            {/* Selected Patient Info */}
            {selectedPatient && (
              <div className="border rounded p-4 mb-4">
                <h2 className="font-semibold">Patient Info</h2>
                <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p><strong>Balance:</strong> ₱{selectedPatient.balance ?? 0}</p>
              </div>
            )}

            {/* Add Services / Items */}
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

              {/* Cart */}
              <div className="mt-4 border p-3 rounded">
                {cart.length === 0 ? <p className="text-gray-500">No items added.</p> : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                      <span>{item.name} x {item.quantity}</span>
                      <span>₱ {item.price * item.quantity}</span>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="text-red-600">Remove</button>
                    </div>
                  ))
                )}
                {cart.length > 0 && (
                  <div className="flex justify-between mt-2 font-semibold">
                    <span>Total:</span>
                    <span>₱ {totalPrice}</span>
                  </div>
                )}
              </div>

              <button onClick={handleGenerateBill} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Generate Bill</button>
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
                <button onClick={handleRecordPayment} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Record Payment</button>
                <button onClick={handlePrintReceipt} className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"> Print Receipt </button>

              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Search Results */}
            {filteredPatients.length > 0 ? (
              <div className="border rounded p-4 max-h-64 overflow-y-auto">
                <h2 className="font-semibold mb-3">Select Patient</h2>
                <div className="space-y-2">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.user_id}
                      className="p-2 border rounded cursor-pointer hover:bg-blue-100"
                      onClick={() => handleSelectPatient(p)}
                    >
                      {p.first_name} {p.last_name} - ID: {p.user_id}
                    </div>
                  ))}
                </div>
              </div>
            ) : search ? (
              <p className="text-gray-500">No patients found</p>
            ) : null}

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
            {selectedPatient && (
              <div className="border rounded p-4">
                <h2 className="font-semibold mb-3">Past Transactions</h2>
                {transactions.length > 0 ? transactions.map((t) => (
                  <div key={t.id} className="p-2 border rounded">
                    <p className="font-semibold">{t.patientName}</p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                    <p className="font-bold">₱ {t.amount}</p>
                    <p className="text-green-600">{t.status}</p>
                  </div>
                )) : <p className="text-gray-500 text-sm">No past transactions</p>}
              </div>
            )}
          </div>
        </div>

        {/* Receipt Modal */}
        {showReceipt && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Receipt</h2>
              <p><strong>Patient:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
              <hr className="my-2" />
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₱{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={handleCloseReceipt} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
