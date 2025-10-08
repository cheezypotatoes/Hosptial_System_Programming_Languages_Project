import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { router } from "@inertiajs/react";

export default function CashierDashboard({ role, user, patients, servicesAndItems }) {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [amountReceived, setAmountReceived] = useState("");
  const [amountForFee, setAmountForFee] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [showZeroFeeOnly, setShowZeroFeeOnly] = useState(false);
  const [processing, setProcessing] = useState(false);

  const activeLabel = "Billing";
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredPatients = showZeroFeeOnly
    ? patients.filter((p) =>
        p.appointments.some((a) => Number(a.fee) === 0)
      )
    : patients;

  const handleSelectPatient = (patient) => {
    if (selectedPatient?.id === patient.id) return;
    setSelectedPatient(patient);
    setSelectedAppointment(null);
    setCart([]);
    setAmountReceived("");
    setAmountForFee("");
  };

  const handleSelectAppointment = (appointmentId) => {
    if (!selectedPatient) return;
    const appointment = selectedPatient.appointments.find(
      (a) => String(a.id) === String(appointmentId)
    );
    if (appointment) {
      setSelectedAppointment(appointment);
      setCart([]);
      setAmountReceived("");
      setAmountForFee("");
    }
  };

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

    setSelectedService("");
    setQuantity(1);
    setCustomPrice("");
  };

  const handleRemoveFromCart = (type, id) => {
    setCart(cart.filter((c) => !(c.type === type && c.id === id)));
  };

  const handleShowReceipt = () => {
  if (!selectedPatient) return alert("Please select a patient!");
  if (!selectedAppointment) return alert("Please select an appointment!");
  if (cart.length === 0) return alert("Cart is empty!");
  if (!amountReceived) return alert("Please enter the amount received!");
  if (Number(amountReceived) < totalPrice) return alert("Amount received cannot be less than the total bill!");

  const companyName = "Jorge & Co Medical Center";
  const companyAddress = "University of Mindanao, Matina Davao City";
  const nurseName = user ? `${user.first_name} ${user.last_name}` : "N/A";
  const currentDate = new Date().toLocaleString();
  const totalBill = (Number(selectedAppointment?.balance ?? 0) + totalPrice).toFixed(2);

  // Create the HTML content for the receipt
  const content = `
    <div style="padding: 20px;">
      <div style="font-size: 14px;">
        <p><strong>Patient Name:</strong> ${selectedPatient.full_name}</p>
        <p><strong>Appointment Date:</strong> ${selectedAppointment.checkup_date}</p>
        <p><strong>Current Fee/Balance:</strong> ₱${Number(selectedAppointment.fee ?? 0).toFixed(2)}</p>
        
        <h3>Services & Items:</h3>
        <ul>
          ${cart.map(item => `
            <li>${item.name} x ${item.quantity} - ₱${(item.price * item.quantity).toFixed(2)}</li>
          `).join('')}
        </ul>

        <p><strong>Total:</strong> ₱${totalBill}</p>
        <p><strong>Amount Received:</strong> ₱${Number(amountReceived).toFixed(2)}</p>
        <p><strong>Change:</strong> ₱${(Number(amountReceived) - totalBill).toFixed(2)}</p>
        
        <p><strong>Nurse:</strong> ${nurseName}</p>
        <p><strong>Date:</strong> ${currentDate}</p>
      </div>
    </div>
  `;

  // Open a print window and write the receipt HTML
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
          <img src="/images/New_Logo.png" alt="Company Logo">
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

const generateFeePaymentReceipt = (amountPaid, currentFee, finalFee, change) => {
  const companyName = "Jorge & Co Medical Center";
  const companyAddress = "University of Mindanao, Matina Davao City";
  const nurseName = user ? `${user.first_name} ${user.last_name}` : "N/A";
  const currentDate = new Date().toLocaleString();

  const feePaymentReceipt = `
    <div style="padding: 20px;">
      <div style="font-size: 14px;">
        <h2>Fee Payment Receipt</h2>
        <p><strong>Patient Name:</strong> ${selectedPatient.full_name}</p>
        <p><strong>Appointment Date:</strong> ${selectedAppointment.checkup_date}</p>
        <p><strong>Original Fee:</strong> ₱${currentFee.toFixed(2)}</p>
        <p><strong>Amount Paid:</strong> ₱${amountPaid.toFixed(2)}</p>
        <p><strong>New Fee/Balance:</strong> ₱${finalFee.toFixed(2)}</p>
        <p><strong>Change:</strong> ₱${change.toFixed(2)}</p>

        <p><strong>Nurse:</strong> ${nurseName}</p>
        <p><strong>Date:</strong> ${currentDate}</p>
      </div>
    </div>
  `;

  // Open a print window for the fee payment receipt
  const printWindow = window.open("", "", "width=900,height=650");
  printWindow.document.write(`
    <html>
      <head>
        <title>Fee Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { margin: 2px 0; }
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
          <img src="/images/New_Logo.png" alt="Company Logo">
          <h2>${companyName}</h2>
          <p>${companyAddress}</p>
        </div>
        ${feePaymentReceipt}
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



  const handleRecordPayment = () => {
    if (!selectedPatient) return alert("Please select a patient!");
    if (!selectedAppointment) return alert("Please select an appointment!");
    
    // Only check for fee payment, not cart
    if (!amountForFee) return alert("Please enter the amount for fee payment!");
    
    const currentFee = Number(selectedAppointment.fee ?? 0);
    const amountPaid = Number(amountForFee);
    
    // Check if amount received is valid
    if (amountPaid <= 0) return alert("Amount received must be greater than 0!");
    
    // Calculate new fee after payment
    const newFee = currentFee - amountPaid;
    const change = newFee < 0 ? Math.abs(newFee) : 0;
    const finalFee = Math.max(0, newFee);

    const payload = {
      appointment_id: selectedAppointment.id,
      patient_id: selectedPatient.id,
      amount_received: amountPaid,
      payment_method: "Cash",
    };

    console.log("📤 Sending payload:", payload);
    console.log(`Current Fee: ₱${currentFee.toFixed(2)}`);
    console.log(`Amount Paid: ₱${amountPaid.toFixed(2)}`);
    console.log(`New Fee: ₱${finalFee.toFixed(2)}`);
    console.log(`Change: ₱${change.toFixed(2)}`);

    setProcessing(true);

    router.post('/cashier/record-payment', payload, {
      onSuccess: (page) => {

        // Find the updated patient
        const updatedPatient = page.props.patients.find(p => p.id === selectedPatient.id);

        // Find the updated appointment
        const updatedAppointment = updatedPatient.appointments.find(a => a.id === selectedAppointment.id);

        // Update local states
        setSelectedPatient(updatedPatient);
        setSelectedAppointment(updatedAppointment);

        // Clear fee input
        setAmountForFee("");
        setProcessing(false);

        console.log("✅ Success:", page);

        generateFeePaymentReceipt(amountPaid, currentFee, finalFee, change);
        
        // Check if there's payment data in the response
        if (page.props.payment_data) {
          const { new_fee, change, amount_received } = page.props.payment_data;
          
          let message = `Payment recorded successfully!\n`;
          message += `Amount Received: ₱${amount_received.toFixed(2)}\n`;
          message += `New Fee/Balance: ₱${new_fee.toFixed(2)}`;
          
          if (change > 0) {
            message += `\nChange: ₱${change.toFixed(2)}`;
          }
          
          alert(message);
        } else {
          alert("Payment recorded successfully!");
        }
        
        // Clear only the fee payment input
        setAmountForFee("");
        setProcessing(false);
        
        // Refresh patient data to show updated fees
        router.reload({ only: ['patients'] });
      },
      onError: (errors) => {
        console.error("❌ Error:", errors);
        const errorMessage = errors?.message || Object.values(errors).flat().join(', ') || "Unknown error occurred";
        alert("Failed to record payment: " + errorMessage);
        setProcessing(false);
      }
    });
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold">Cashier Dashboard</h1>
        </header>

        <div className="p-6 grid grid-cols-3 gap-6 overflow-y-auto">
          <div className="col-span-2 space-y-6 max-h-full overflow-y-auto pr-2">
            {selectedPatient && selectedAppointment && (
              <div className="border rounded p-4 mb-4 bg-white">
                <h2 className="font-semibold text-lg mb-3">Patient Info</h2>
                <p>
                  <strong>Name:</strong> {selectedPatient.full_name}
                </p>
                <p>
                  <strong>Appointment Date:</strong> {selectedAppointment.checkup_date}
                </p>

                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-xl font-bold text-blue-800">
                    Current Fee/Balance: ₱{Number(selectedAppointment.fee ?? 0).toFixed(2)}
                  </p>
                </div>

                {cart.length > 0 && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">
                      Services Total: ₱{cart.filter(item => item.type === 'service').reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-yellow-800">
                      Medicines Total: ₱{cart.filter(item => item.type === 'medicine').reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                    <p className="text-sm font-semibold text-yellow-800 border-t border-yellow-300 pt-1 mt-1">
                      Cart Total: ₱{totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      * Cart items are not recorded in database
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <h2 className="font-semibold mb-2">Add Services / Items (For Reference)</h2>

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

              {cart.length > 0 && (
                <div className="border rounded p-2 bg-white">
                  <div className="mb-3 pb-2 border-b">
                    <h3 className="font-semibold text-blue-700">Services:</h3>
                    {cart.filter(item => item.type === 'service').length > 0 ? (
                      cart.filter(item => item.type === 'service').map((item) => (
                        <div
                          key={`${item.type}_${item.id}`}
                          className="flex justify-between items-center py-1"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => handleRemoveFromCart(item.type, item.id)}
                            className="text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-1">No services</p>
                    )}
                    <p className="text-sm font-semibold text-blue-700 mt-1">
                      Subtotal: ₱{cart.filter(item => item.type === 'service').reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="mb-3 pb-2 border-b">
                    <h3 className="font-semibold text-green-700">Medicines:</h3>
                    {cart.filter(item => item.type === 'medicine').length > 0 ? (
                      cart.filter(item => item.type === 'medicine').map((item) => (
                        <div
                          key={`${item.type}_${item.id}`}
                          className="flex justify-between items-center py-1"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₱ {Number(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => handleRemoveFromCart(item.type, item.id)}
                            className="text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-1">No medicines</p>
                    )}
                    <p className="text-sm font-semibold text-green-700 mt-1">
                      Subtotal: ₱{cart.filter(item => item.type === 'medicine').reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-3 font-semibold text-blue-800 text-lg">
                    <span>Cart Total (Reference):</span>
                    <span>₱ {totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <input
                      type="number"
                      placeholder="Amount Received (for receipt)"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="border rounded px-3 py-2 w-40"
                    />
                    <button
                      onClick={handleShowReceipt}
                      className="flex-1 py-2 rounded text-white bg-gray-600 hover:bg-gray-700"
                    >
                      Show Receipt
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t-4 border-green-500 mt-6 pt-6">
  <h2 className="font-semibold mb-2 text-green-700">Pay Appointment Fee</h2>

  {selectedAppointment ? (
    selectedAppointment.fee > 0 ? (
      <div className="border rounded p-4 bg-green-50">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Amount to Pay (Fee Only)
            </label>
            <input
              type="number"
              placeholder="Enter amount for fee payment"
              value={amountForFee}
              onChange={(e) => setAmountForFee(e.target.value)}
              className="border rounded px-3 py-2 w-full"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-600 mt-1">
              Current Fee Balance: ₱{Number(selectedAppointment.fee ?? 0).toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleRecordPayment}
            disabled={processing || !amountForFee}
            className="w-full py-3 rounded text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 font-semibold"
          >
            {processing ? "Processing..." : "Record Fee Payment"}
          </button>
        </div>
      </div>
    ) : (
      <p className="text-red-500">This appointment has no fee to pay.</p>
    )
  ) : (
    <p className="text-gray-500 italic">Please select a patient and appointment first</p>
  )}
</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded p-4 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Select Patient</h2>
              </div>

              {showZeroFeeOnly && (
                <p className="text-xs text-blue-700 mb-2 italic">
                  Showing only patients with ₱0 fee appointments
                </p>
              )}

              {filteredPatients.map((p) => (
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
                        {a.checkup_date} - Fee: ₱{Number(a.fee ?? 0).toFixed(2)}
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