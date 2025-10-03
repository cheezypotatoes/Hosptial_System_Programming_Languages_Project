import React, { useState, useEffect } from "react";
import Select from "rc-select";
import "rc-select/assets/index.css"; // Import rc-select styles
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { FaFileInvoiceDollar, FaPills, FaNotesMedical } from "react-icons/fa";
import Logo from "@/../images/New_Logo.png";

export default function CashierDashboard() {
  const [search, setSearch] = useState(""); // search query for patients
  const [patients, setPatients] = useState([]); // list of all patients
  const [selectedPatient, setSelectedPatient] = useState(null); // selected patient
  const [cart, setCart] = useState([]); // items added to the cart
  const [selectedService, setSelectedService] = useState(""); // selected service/item
  const [quantity, setQuantity] = useState(1); // quantity of service/item
  const [amountReceived, setAmountReceived] = useState(""); // amount received from patient
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // payment method
  const [showReceipt, setShowReceipt] = useState(false); // show/hide receipt

  // Fetch patients from the API on initial load
  useEffect(() => {
    fetch("http://localhost:8000/nurse/cashier/patients")
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // Filter patients based on the search input
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
    const searchTerm = search.toLowerCase().trim();
    return fullName.includes(searchTerm) || p.user_id?.toString() === searchTerm;
  });

  // Handle patient selection from the dropdown
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCart([]); // reset cart when a new patient is selected
    setSearch(""); // reset search input when a patient is selected
  };

  // Show receipt when ready
  const handleShowReceipt = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (cart.length === 0) return alert("Cart is empty!");
    setShowReceipt(true);
  };

  // Close receipt view
  const handleCloseReceipt = () => setShowReceipt(false);

  // Handle adding a service/item to the cart
  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");
    // For simplicity, assume `services` and `items` are already fetched
    const service = { id: selectedService, name: "Sample Service", price: 100 }; // Example service/item
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

  // Calculate total price of cart
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle payment recording
  const handleRecordPayment = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (!amountReceived || amountReceived < totalPrice) return alert("Insufficient payment.");
    alert(`Payment of ₱${amountReceived} via ${paymentMethod} recorded for ${selectedPatient.first_name}`);
  };

  // Handle logout (placeholder)
  const handleLogout = () => alert("Logout functionality not implemented yet.");

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
          <span className="flex items-center text-xl font-bold text-white space-x-2">
            <img src={Logo} alt="MedBoard Logo" className="h-12 w-12 object-contain" />
            <span>Jorge & Co. Med</span>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-[#BFDBFE]">
          {[{ href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> }, { href: route("nurse.patients.index"), label: "Patient Management", icon: <MdPerson /> }, { href: route("physician.records"), label: "Physician Record", icon: <MdOutlinePersonPin /> }, { href: route('cashier.dashboard'), label: "Billing", icon: <FaFileInvoiceDollar /> }, { href: route('medicine.inventory'), label: "Medicine Inventory", icon:<MdInventory /> }, { href: route('nurse.assistant.dashboard'), label: "Nurse Assistant", icon: <FaNotesMedical /> }, { href: route('dispensing'), label: "Dispensing", icon: < FaPills /> }]
            .map(({ href, label, icon }) => (
              <a key={label} href={href} className={`flex items-center gap-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${label === "Billing" ? "bg-[#2563EB] text-white font-semibold" : "hover:bg-[#2563EB] hover:text-white"}`} aria-current={label === "Billing" ? "page" : undefined}>
                {icon && <span className="text-lg">{icon}</span>}
                <span>{label}</span>
              </a>
            ))}
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700">
            <BiLogOutCircle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4 w-full">
            <h1 className="text-xl font-bold">Cashier Dashboard</h1>
            {/* Patient Search Combobox */}
            <Select
              showSearch
              value={selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : ""}
              onSearch={(value) => setSearch(value)} // Update search value
              onChange={(value) => {
                const patient = patients.find((p) => `${p.first_name} ${p.last_name}` === value);
                handleSelectPatient(patient);
              }}
              placeholder="Search patients"
              style={{ width: "100%" }}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {filteredPatients.map((patient) => (
                <Select.Option key={patient.user_id} value={`${patient.first_name} ${patient.last_name}`}>
                  {patient.first_name} {patient.last_name} - ID: {patient.user_id}
                </Select.Option>
              ))}
            </Select>
          </div>
        </header>

        <div className="p-6 grid grid-cols-3 gap-6">
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded px-3 py-2 w-full mb-2"
              />
              <div className="flex items-center gap-4">
                <select
                  className="border rounded px-3 py-2 flex-1"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select Service/Item</option>
                  <option value="1">Sample Service - ₱100</option>
                  <option value="2">Sample Item - ₱50</option>
                  {/* Add more options as needed */}
                </select>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                  className="border rounded px-3 py-2 w-20"
                  min={1}
                />

                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="mt-6 border rounded p-4">
                <h3 className="font-semibold mb-2">Cart Summary</h3>
                <ul className="space-y-2">
                  {cart.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity} - ₱{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <strong>Total:</strong> ₱{totalPrice}
                </div>
                <div className="mt-4 flex gap-4">
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Amount Received"
                    className="border rounded px-3 py-2 w-32"
                  />
                  <select
                    className="border rounded px-3 py-2 w-32"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>

                  <button
                    onClick={handleRecordPayment}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Receipt View */}
          {showReceipt && (
            <div className="col-span-1 bg-white p-6 border rounded shadow">
              <h3 className="font-semibold mb-4">Receipt</h3>
              <p><strong>Patient:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
              <p><strong>Total:</strong> ₱{totalPrice}</p>
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
              <p><strong>Amount Received:</strong> ₱{amountReceived}</p>
              <button onClick={handleCloseReceipt} className="mt-4 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                Close Receipt
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
