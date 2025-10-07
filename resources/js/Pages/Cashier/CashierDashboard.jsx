import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar";

export default function CashierDashboard({ role, user }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showReceipt, setShowReceipt] = useState(false);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [servicesAndItems, setServicesAndItems] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // MOCK DATA
  const mockCategories = [
    {
      id: 1,
      name: "Consultation",
      services: [
        { id: 101, name: "General Checkup", price: 500 },
        { id: 102, name: "Specialist Consultation", price: 1200 }
      ],
      items: [
        { id: 201, name: "Vitamin C", price: 100 },
        { id: 202, name: "Painkiller", price: 50 }
      ]
    },
    {
      id: 2,
      name: "Laboratory",
      services: [
        { id: 103, name: "Blood Test", price: 800 },
        { id: 104, name: "Urine Test", price: 300 }
      ],
      items: [
        { id: 203, name: "Glucose Strip", price: 200 },
        { id: 204, name: "Syringe", price: 20 }
      ]
    }
  ];

  useEffect(() => {
    // Flatten services and items
    const combined = mockCategories.flatMap((cat) => [
      ...(cat.services || []).map((s) => ({ ...s, type: "service" })),
      ...(cat.items || []).map((i) => ({ ...i, type: "item" }))
    ]);
    setServicesAndItems(combined);

    // Mock patients with appointments
    setPatients([
      { 
        user_id: "P001", 
        first_name: "Juan", 
        last_name: "Dela Cruz", 
        appointments: [
          { id: "A001", date: "2025-10-01", balance: 0 },
          { id: "A002", date: "2025-10-05", balance: 150 }
        ]
      },
      { 
        user_id: "P002", 
        first_name: "Maria", 
        last_name: "Santos", 
        appointments: [
          { id: "A003", date: "2025-10-03", balance: 200 }
        ]
      },
      { 
        user_id: "P003", 
        first_name: "Pedro", 
        last_name: "Reyes", 
        appointments: [
          { id: "A004", date: "2025-10-02", balance: 150 }
        ]
      }
    ]);
  }, []);

  const handleSelectPatient = (patient) => {
    if (selectedPatient?.user_id === patient.user_id) return; // prevent re-reset
    setSelectedPatient(patient);
    setSelectedAppointment(null);
    setCart([]);
    setAmountReceived("");
  };

  const handleSelectAppointment = (appointmentId) => {
    if (!selectedPatient) return;
    const appointment = selectedPatient.appointments.find((a) => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setCart([]);
      setAmountReceived("");
    }
  };

  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");

    const service = servicesAndItems.find((s) => s.id.toString() === selectedService);
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

  const handleShowMockReceipt = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (!selectedAppointment) return alert("Please select an appointment!");
    if (cart.length === 0) return alert("Cart is empty!");
    if (!amountReceived) return alert("Please enter the amount received!");
    if (Number(amountReceived) < totalPrice)
      return alert("Amount received cannot be less than the total bill!");

    setShowReceipt(true);
  };

  const handleRecordPayment = () => {
    if (!selectedPatient) return alert("Select a patient!");
    if (!selectedAppointment) return alert("Select an appointment!");
    if (cart.length === 0) return alert("Cart is empty!");
    if (!amountReceived || Number(amountReceived) < totalPrice)
      return alert("Invalid amount received!");

    // Update appointment balance
    const updatedAppointment = { ...selectedAppointment };
    updatedAppointment.balance = (updatedAppointment.balance ?? 0) + totalPrice - Number(amountReceived);

    setSelectedAppointment(updatedAppointment);

    // Update patient appointments
    const updatedPatient = { ...selectedPatient };
    updatedPatient.appointments = updatedPatient.appointments.map((a) =>
      a.id === updatedAppointment.id ? updatedAppointment : a
    );
    setSelectedPatient(updatedPatient);

    alert(
      `Payment recorded for ${selectedPatient.first_name} ${selectedPatient.last_name} (Appointment: ${updatedAppointment.date}):\n` +
      `Total: ₱${totalPrice}\nReceived: ₱${amountReceived}\nNew Balance: ₱${updatedAppointment.balance}`
    );

    // Reset cart and amount
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
                <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p><strong>Appointment Date:</strong> {selectedAppointment.date}</p>

                <div className="mt-2 space-y-1">
                  <p><strong>Previous Balance:</strong> ₱{selectedAppointment.balance?.toFixed(2) ?? 0}</p>
                  <p><strong>Current Cart Total:</strong> ₱{totalPrice.toFixed(2)}</p>
                  <hr className="my-1 border-gray-300" />
                  <p className="font-semibold text-blue-800">
                    <strong>Total Bill:</strong> ₱{(selectedAppointment.balance + totalPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Add Services / Items */}
            <div>
              <h2 className="font-semibold mb-2">Add Services / Items</h2>

              <div className="flex items-center gap-4 mb-2">
                <select
                  className="border rounded px-3 py-2 flex-1"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="">Select Service/Item</option>
                  {servicesAndItems.map((s) => (
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
                  <span>{item.name} x {item.quantity}</span>
                  <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Total */}
              {cart.length > 0 && (
                <div className="flex justify-between items-center mt-3 font-semibold text-blue-800">
                  <span>Total Amount:</span>
                  <span>₱ {totalPrice.toFixed(2)}</span>
                </div>
              )}

              {/* Payment Buttons */}
              {cart.length > 0 && selectedAppointment && (
                <div className="flex gap-4 mt-4">
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

              {/* Appointment Dropdown */}
              {selectedPatient && (
                <div className="mt-2">
                  <label className="block text-xs font-semibold mb-1">Select Appointment:</label>
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={selectedAppointment?.id || ""}
                    onChange={(e) => handleSelectAppointment(e.target.value)}
                  >
                    <option value="">-- Choose Appointment --</option>
                    {selectedPatient.appointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.date} - Balance: ₱{a.balance.toFixed(2)}
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
