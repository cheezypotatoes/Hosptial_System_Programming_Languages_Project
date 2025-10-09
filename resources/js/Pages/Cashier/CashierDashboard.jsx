import React, { useState, useEffect, useRef} from "react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from "../../Components/Sidebar";
import Swal from 'sweetalert2';

export default function CashierDashboard({ role, user, patients, servicesAndItems }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const printRef = useRef();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(false);
  const [servicePrice, setServicePrice] = useState(0);
  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

 const handleSelectPatient = (patient) => {
  if (selectedPatient?.id === patient.id) return;

  setSelectedPatient(patient);
  setCart([]);
  setAmountReceived("");

  if (patient.appointments?.length > 0) {
    setSelectedAppointment(patient.appointments[0]);
  } else {
    setSelectedAppointment(null);
  }
};

 function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  }

const handlePrint = () => {
  const logoPath = "/images/New_Logo.png";
  const companyName = "Jorge & Co Medical Center";
  const companyAddress = "University of Mindanao, Matina Davao City";
  const nurseName = user ? `${user.first_name} ${user.last_name}` : "N/A";
  const currentDate = new Date().toLocaleString();
  const totalBill = (Number(selectedAppointment?.balance ?? 0) + totalPrice).toFixed(2);

  const content = printRef.current.innerHTML;

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
          .footer { margin-top: 20px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoPath}" alt="Company Logo">
          <h2>${companyName}</h2>
          <p>${companyAddress}</p>
        </div>
        ${content}
        <div class="footer">
          <p><strong>Nurse:</strong> ${nurseName}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

const handleSelectAppointment = (appointmentId) => {
  if (!selectedPatient || !selectedPatient.appointments) return;
  const id = Number(appointmentId); 
  const appointment = selectedPatient.appointments.find((a) => a.id === id);
  if (appointment) {
    setSelectedAppointment(appointment);
    setCart([]);
    setAmountReceived("");
  }
};

  useEffect(() => {
    if (!selectedService) {
      setServicePrice(0);
      return;
    }
    const service = servicesAndItems.find((s) => `${s.type}_${s.id}` === selectedService);
    setServicePrice(service ? parseFloat(service.price) : 0);
  }, [selectedService]);

  const handleAddToCart = () => {
    if (!selectedService) return alert("Please select a service/item");
    const service = servicesAndItems.find((s) => `${s.type}_${s.id}` === selectedService);
    if (!service) return;

    const uniqueKey = `${service.type}_${service.id}`;
    const existingIndex = cart.findIndex((c) => `${c.type}_${c.id}` === uniqueKey);

    if (existingIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...service, quantity, price: parseFloat(service.price) }]);
    }

    setSelectedService("");
    setQuantity(1);
    setServicePrice(0);
  };

  const handleRemoveFromCart = (type, id) => {
    setCart(cart.filter((c) => !(c.type === type && c.id === id)));
  };

const handleShowReceipt = () => {
  if (!selectedPatient) return alert("Please select a patient!");
  if (!selectedAppointment) return alert("Please select an appointment!");
  if (cart.length === 0) return alert("Cart is empty!");
  if (!amountReceived) return alert("Please enter the amount received!");

  const totalBill = Number(selectedAppointment?.balance ?? 0) + totalPrice;
  const received = Number(amountReceived);

  if (received < totalBill) {
    return Swal.fire({
      icon: "error",
      title: "Insufficient Amount",
      text: `The amount received (₱${received.toFixed(2)}) cannot be less than the total bill (₱${totalBill.toFixed(2)}).`,
    });
  }

  setShowReceipt(true);
};

const handleRecordPayment = () => {
  if (!selectedPatient) return Swal.fire("Error", "Select a patient!", "error");
  if (!selectedAppointment) return Swal.fire("Error", "Select an appointment!", "error");
  if (cart.length === 0) return Swal.fire("Error", "Cart is empty!", "error");
  if (!amountReceived) return Swal.fire("Error", "Please enter amount received!", "error");

  const totalBill = Number(selectedAppointment?.balance ?? 0) + totalPrice;
  const received = Number(amountReceived);

  if (received < totalBill) {
    return Swal.fire({
      icon: "error",
      title: "Insufficient Amount",
      text: `Amount received (₱${received.toFixed(2)}) cannot be less than total bill (₱${totalBill.toFixed(2)}).`,
    });
  }

  const data = {
    patient_id: selectedPatient.id,
    appointment_id: selectedAppointment.id,
    items: cart.map(item => ({
      type: item.type,
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: totalBill,
    amount_received: received,
    payment_method: "cash",
  };

  setLoading(true);

  axios.post("/nurse/cashier/record-payment", data)
    .then((res) => {
      setLoading(false);
      Swal.fire({
        title: "Success",
        text: "Payment recorded successfully!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });

      setCart([]);
      setAmountReceived("");
      setShowReceipt(false);
    })
    .catch((err) => {
      setLoading(false);
      Swal.fire("Error", "Failed to record payment", "error");
      console.error(err);
    });
};

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
       <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Cashier Dashboard</h1>
        </header>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow flex items-center gap-2">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
            <span>Processing payment...</span>
          </div>
        </div>
      )}

        <div className="p-6 grid grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="col-span-2 space-y-6">
            {/* Patient Info */}
            {selectedPatient && selectedAppointment && (
              <div className="border rounded p-4 mb-4">
                <h2 className="font-semibold">Patient Info</h2>
                <p><strong>Name:</strong> {selectedPatient.full_name}</p>
                <p><strong>Appointment Date:</strong> {selectedAppointment.checkup_date}</p>
                <div className="mt-2 space-y-1">
                  <p><strong>Previous Balance:</strong> ₱{Number(selectedAppointment.balance ?? 0).toFixed(2)}</p>
                  <p><strong>Current Cart Total:</strong> ₱{totalPrice.toFixed(2)}</p>
                  <hr className="my-1 border-gray-300" />
                  <p className="font-semibold text-blue-800">
                    <strong>Total Bill:</strong> ₱{(Number(selectedAppointment.balance ?? 0) + totalPrice).toFixed(2)}
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
                      {s.name} ({s.type})
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
                  value={servicePrice}
                  disabled
                  className="border rounded px-3 py-2 w-24 bg-gray-200"
                />

                <button
                  onClick={handleAddToCart}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>

              {/* Cart */}
                  {cart.length > 0 && (
                    <div className="border rounded p-2">
                      {cart.map((item) => (
                        <div key={`${item.type}_${item.id}`} className="flex justify-between items-center py-1 border-b last:border-b-0">
                          <span>{item.name} x {item.quantity} ({item.type})</span>
                          <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => handleRemoveFromCart(item.type, item.id)} className="text-red-600">Remove</button>
                        </div>
                      ))}

                      <div className="flex justify-between items-center mt-3 font-semibold text-blue-800">
                        <span>Cart Total:</span>
                        <span>₱ {totalPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center mt-1 font-semibold text-red-700">
                        <span>Previous Balance:</span>
                        <span>₱ {Number(selectedAppointment?.balance ?? 0).toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center mt-1 font-bold text-green-800">
                        <span>Total Bill:</span>
                        <span>₱ {(Number(selectedAppointment?.balance ?? 0) + totalPrice).toFixed(2)}</span>
                      </div>

                      <div className="flex gap-4 mt-4">
                        <input
                          type="number"
                          placeholder="Amount Received"
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
                          className="border rounded px-3 py-2 w-40"
                        />
                        <button onClick={handleShowReceipt} className="flex-1 py-2 rounded text-white bg-gray-600 hover:bg-gray-700">Show Receipt</button>
                        <button onClick={handleRecordPayment} className="flex-1 py-2 rounded text-white bg-green-600 hover:bg-green-700">Record Payment</button>
                      </div>
                    </div>
                  )}

            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            <div className="border rounded p-4 max-h-96 overflow-y-auto">
              <h2 className="font-semibold mb-3">Select Patient</h2>
                      {patients.map((p) => {
                              const allPaid = p.appointments.every(a => a.status === "paid");
                              if (allPaid) return null; 
                              return (
                                <div
                                  key={p.id}
                                  className={`p-2 border rounded mb-2 cursor-pointer ${selectedPatient?.id === p.id ? "bg-blue-200 border-blue-400" : "hover:bg-blue-100"}`}
                                  onClick={() => handleSelectPatient(p)}
                                >
                                  <p className="font-semibold">{p.full_name}</p>
                          </div>
                      );
                })}

    {selectedPatient && selectedPatient.appointments.length > 0 && (
      <div className="mt-2">
        <label className="block text-xs font-semibold mb-1">Select Appointment:</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={selectedAppointment?.id ?? ""}
          onChange={(e) => handleSelectAppointment(e.target.value)}
        >
          <option value="">-- Choose Appointment --</option>
          {selectedPatient.appointments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.checkup_date} - {a.status === 'paid' ? (
                <span className="text-green-600 font-semibold">Paid</span>
              ) : (
                `₱${Number(a.balance ?? 0).toFixed(2)}`
              )}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
 </div>

       {/* Receipt Modal */}
            {showReceipt && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded p-6 w-96">
                  {/* Printable content */}
                  <div ref={printRef}>
                    <div className="text-center mb-4">
                      <img src="/images/New_Logo.png" alt="Logo" className="w-32 mx-auto mb-2" />
                      <h2 className="text-lg font-bold">Jorge & Co Medical Center</h2>
                      <p>University of Mindanao, Matina Davao City</p>
                    </div>

                    <p><strong>Patient:</strong> {selectedPatient.full_name}</p>
                    <p><strong>Appointment:</strong> {selectedAppointment.checkup_date}</p>

                    <table className="w-full mt-2 border-collapse border border-gray-600">
                      <thead>
                        <tr>
                          <th className="border px-2 py-1">Item/Service</th>
                          <th className="border px-2 py-1">Qty</th>
                          <th className="border px-2 py-1">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={`${item.type}_${item.id}`}>
                            <td className="border px-2 py-1">{item.name}</td>
                            <td className="border px-2 py-1">{item.quantity}</td>
                            <td className="border px-2 py-1">₱ {Number(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-2 flex justify-between font-semibold">
                      <span>Previous Balance:</span>
                      <span>₱ {Number(selectedAppointment?.balance ?? 0).toFixed(2)}</span>
                    </div>

                    <div className="mt-1 flex justify-between font-semibold">
                      <span>Cart Total:</span>
                      <span>₱ {totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="mt-1 flex justify-between font-bold text-green-800">
                      <span>Total Bill:</span>
                      <span>₱ {(Number(selectedAppointment?.balance ?? 0) + totalPrice).toFixed(2)}</span>
                    </div>

                    <div className="mt-1 flex justify-between font-semibold text-blue-800">
                      <span>Amount Received:</span>
                      <span>₱ {Number(amountReceived).toFixed(2)}</span>
                    </div>

                    <div className="mt-1 flex justify-between font-semibold text-red-700">
                      <span>Change:</span>
                      <span>₱ {(Number(amountReceived) - (Number(selectedAppointment?.balance ?? 0) + totalPrice)).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Buttons outside of printable content */}
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={() => setShowReceipt(false)} 
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button 
                      onClick={handlePrint} 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            )}
      </main>
    </div>
  );
}
