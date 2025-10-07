import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";

export default function CashierDashboard({ role, user, patients, servicesAndItems }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedService, setSelectedService] = useState(""); // default empty string
  const [customPrice, setCustomPrice] = useState("");

  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Select patient
  const handleSelectPatient = (patient) => {
    if (selectedPatient?.id === patient.id) return;
    setSelectedPatient(patient);
    setSelectedAppointment(null);
    setCart([]);
    setAmountReceived("");
  };

  // Select appointment
  const handleSelectAppointment = (appointmentId) => {
    if (!selectedPatient) return;
    const appointment = selectedPatient.appointments.find(
      (a) => String(a.id) === String(appointmentId)
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setCart([]);
      setAmountReceived("");
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");

    const service = servicesAndItems.find((s) => `${s.type}_${s.id}` === selectedService);
    if (!service) return;

    const price = customPrice ? parseFloat(customPrice) : parseFloat(service.price);
    const uniqueKey = `${service.type}_${service.id}`;

    const existingIndex = cart.findIndex((c) => `${c.type}_${c.id}` === uniqueKey);
    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      updatedCart[existingIndex].price = price;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...service, quantity, price }]);
    }

    // Reset select safely
    setSelectedService("");
    setQuantity(1);
    setCustomPrice("");
  };

  const handleRemoveFromCart = (type, id) => {
    setCart(cart.filter((c) => !(c.type === type && c.id === id)));
  };

  // Receipt preview
  const handleShowMockReceipt = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (!selectedAppointment) return alert("Please select an appointment!");
    if (cart.length === 0) return alert("Cart is empty!");
    if (!amountReceived) return alert("Please enter the amount received!");
    if (Number(amountReceived) < totalPrice)
      return alert("Amount received cannot be less than the total bill!");
    setShowReceipt(true);
  };

  // Record payment
  const handleRecordPayment = () => {
    if (!selectedPatient) return alert("Select a patient!");
    if (!selectedAppointment) return alert("Select an appointment!");
    if (cart.length === 0) return alert("Cart is empty!");
    if (!amountReceived || Number(amountReceived) < totalPrice)
      return alert("Invalid amount received!");

    const updatedAppointment = { ...selectedAppointment };
    updatedAppointment.balance =
      (updatedAppointment.balance ?? 0) + totalPrice - Number(amountReceived);
    setSelectedAppointment(updatedAppointment);

    const updatedPatient = { ...selectedPatient };
    updatedPatient.appointments = updatedPatient.appointments.map((a) =>
      a.id === updatedAppointment.id ? updatedAppointment : a
    );
    setSelectedPatient(updatedPatient);

    alert(
      `Payment recorded for ${selectedPatient.full_name} (Appointment: ${updatedAppointment.checkup_date}):\n` +
        `Total: ₱${totalPrice.toFixed(2)}\nReceived: ₱${Number(amountReceived).toFixed(2)}\nNew Balance: ₱${updatedAppointment.balance.toFixed(2)}`
    );

    setCart([]);
    setAmountReceived("");
    setShowReceipt(false);
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Cashier Dashboard</h1>
        </header>

        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="col-span-2 space-y-6">
            {/* Patient Info */}
            {selectedPatient && selectedAppointment && (
              <div className="border rounded p-4 mb-4">
                <h2 className="font-semibold">Patient Info</h2>
                <p>
                  <strong>Name:</strong> {selectedPatient.full_name}
                </p>
                <p>
                  <strong>Appointment Date:</strong> {selectedAppointment.checkup_date}
                </p>

                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Previous Balance:</strong> ₱
                    {Number(selectedAppointment.balance ?? 0).toFixed(2)}
                  </p>
                  <p>
                    <strong>Current Cart Total:</strong> ₱{totalPrice.toFixed(2)}
                  </p>
                  <hr className="my-1 border-gray-300" />
                  <p className="font-semibold text-blue-800">
                    <strong>Total Bill:</strong> ₱
                    {(Number(selectedAppointment.balance ?? 0) + totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Add Services / Items */}
            <div>
              <h2 className="font-semibold mb-2">Add Services / Items</h2>

              <div className="flex items-center gap-2 mb-2">
                <select
                  className="border rounded px-3 py-2 flex-1"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select Service/Item</option>
                  {servicesAndItems.map((s) => (
                    <option key={`${s.type}_${s.id}`} value={`${s.type}_${s.id}`}>
                      {s.name} - ₱{s.price} ({s.type})
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

                <input
                  type="number"
                  placeholder="Price"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="border rounded px-3 py-2 w-24"
                />

                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>

              {/* Cart Items */}
              {cart.length > 0 && (
                <div className="border rounded p-2">
                  {cart.map((item) => (
                    <div
                      key={`${item.type}_${item.id}`}
                      className="flex justify-between items-center py-1 border-b last:border-b-0"
                    >
                      <span>
                        {item.name} x {item.quantity} ({item.type})
                      </span>
                      <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveFromCart(item.type, item.id)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="flex justify-between items-center mt-3 font-semibold text-blue-800">
                    <span>Total Amount:</span>
                    <span>₱ {totalPrice.toFixed(2)}</span>
                  </div>

                  {/* Payment */}
                  <div className="flex gap-4 mt-4">
                    <input
                      type="number"
                      placeholder="Amount Received"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="border rounded px-3 py-2 w-40"
                    />
                    <button
                      onClick={handleShowMockReceipt}
                      className="flex-1 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Show Receipt
                    </button>

                    <button
                      onClick={handleRecordPayment}
                      className="flex-1 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                    >
                      Record Payment & Update Balance
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Select Patient */}
            <div className="border rounded p-4 max-h-96 overflow-y-auto">
              <h2 className="font-semibold mb-3">Select Patient</h2>
              {patients.map((p) => (
                <div
                  key={p.id}
                  className={`p-2 border rounded cursor-pointer mb-2 ${
                    selectedPatient?.id === p.id
                      ? "bg-blue-200 border-blue-400"
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => handleSelectPatient(p)}
                >
                  <p className="font-semibold">{p.full_name}</p>
                </div>
              ))}

              {/* Appointment Dropdown */}
              {selectedPatient && selectedPatient.appointments.length > 0 && (
                <div className="mt-2">
                  <label className="block text-xs font-semibold mb-1">
                    Select Appointment:
                  </label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={selectedAppointment?.id ?? ""}
                    onChange={(e) => handleSelectAppointment(e.target.value)}
                  >
                    <option value="">-- Choose Appointment --</option>
                    {selectedPatient.appointments.map((a) => (
                      <option key={a.id} value={String(a.id)}>
                        {a.checkup_date} - ₱{Number(a.balance ?? 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}