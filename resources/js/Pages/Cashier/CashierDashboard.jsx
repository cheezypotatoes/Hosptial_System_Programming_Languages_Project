import React, { useState, useEffect } from "react";
import Sidebar from '../../Components/Sidebar';

export default function CashierDashboard(role) {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState(null); // patient info
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [servicesAndItems, setServicesAndItems] = useState([]);
  
  useEffect(() => {
    fetch("/cashier/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        // Flatten services & items into one array
        const combined = data.flatMap(cat => [
          ...cat.services.map(s => ({ ...s, type: "service" })),
          ...cat.items.map(i => ({ ...i, type: "item" }))
        ]);
        setServicesAndItems(combined);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);
  
  
  
    // Filter patients based on the search input
  // Derived data (filters)
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
    return fullName.includes(patientSearch.toLowerCase());
  });
  
  
    // ✅ Filter services/items separately
    const filteredServicesAndItems = servicesAndItems.filter((entry) =>
      entry.name.toLowerCase().includes(serviceSearch.toLowerCase().trim())
    );
  
    // Show receipt when ready
    const handleShowReceipt = () => {
      if (!selectedPatient) return alert("Please select a patient!");
      if (cart.length === 0) return alert("Cart is empty!");
      setShowReceipt(true);
    };
  

const handleCloseReceipt = () => setShowReceipt(false);

  const searchPatients = (query) => {
  if (!query) return setPatients([]);

  fetch(`http://localhost:8000/nurse/cashier/patients?q=${query}`)
    .then((res) => res.json())
    .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
    .catch((err) => console.error("Error fetching patients:", err));
};


useEffect(() => {

// Patients
fetch(`http://localhost:8000/nurse/cashier/patients`)
  .then((res) => res.json())
  .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
  .catch((err) => console.error("Error fetching patients:", err));

  // Pending Payments
  fetch("http://localhost:8000/pending-payments")
    .then((res) => res.json())
    .then((data) => {
      console.log("Pending payments:", data); // Debug
      setPendingPayments(Array.isArray(data) ? data : data.data || []);
    })
    .catch(console.error);

  // Transactions
  fetch("http://localhost:8000/transactions")
    .then((res) => res.json())
    .then((data) => {
      console.log("Transactions fetched:", data); // Debug
      setTransactions(Array.isArray(data) ? data : data.data || []);
    })
    .catch(console.error);
}, []);




  // Select patient and load past transactions
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCart([]); // reset cart for new patient

    // Fetch patient-specific transactions if your API supports it
    fetch(`http://localhost:8000/transactions?patient_id=${patient.user_id}`)
      .then((res) => res.json())
      .then(setTransactions)
      .catch((err) => console.error(err));
  };

  // Add item/service to cart
  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");

    const service = services.find(
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
// State for search
const [serviceSearch, setServiceSearch] = useState("");

// Derived filtered list (prevents crash)
const filteredServices = services.filter((s) =>
  s.name?.toLowerCase().includes(serviceSearch.toLowerCase())
);

const activeLabel = "Billing"; 
  const handleRemoveFromCart = (id) => setCart(cart.filter((c) => c.id !== id));
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  const handleLogout = () => alert("Logout functionality not implemented yet.");

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
       {/* Pass the user role (position in lowercase) to Sidebar */}
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />


      {/* Main Content */}
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

  {/* Service Search */}
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
      {filteredServices.map((s) => (
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
                <input type="number" placeholder="Amount Received" value={amountReceived} onChange={(e) => setAmountReceived(e.target.value)} className="border rounded px-3 py-2 flex-1" />
                <select className="border rounded px-3 py-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option>Cash</option>
                  <option>Card</option>
                  <option>GCash</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button onClick={handleRecordPayment} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Record Payment</button>
              <button
                    onClick={handleShowReceipt}
                    className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
                  >
                    Print Receipt
                  </button>

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

            {/* Recent Transactions */}
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

        {showReceipt && (
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
        <button
          onClick={handleCloseReceipt}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
