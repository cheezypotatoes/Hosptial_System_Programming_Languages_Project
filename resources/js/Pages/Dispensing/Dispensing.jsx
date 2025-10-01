import React, { useState } from "react";
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory} from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import {  FaFileInvoiceDollar, FaPills, FaNotesMedical } from "react-icons/fa";

import Logo from "@/../images/New_Logo.png";

export default function Dispensing() {
  const [search, setSearch] = useState("");
  const [medicineList] = useState([
    { name: "Paracetamol 500mg", stock: 120, expiry: "2025-09-11", status: "In stock" },
    { name: "Amoxicillin 250mg", stock: 30, expiry: "2024-09-11", status: "Low stock" },
    { name: "Ibuprofen", stock: 85, expiry: "2026-09-11", status: "In stock" },
    { name: "Omeprazole 20mg", stock: 15, expiry: "2025-09-11", status: "Low stock" },
    { name: "Cough Syrup", stock: 50, expiry: "2024-09-11", status: "In stock" },
  ]);

  const [dispensing, setDispensing] = useState({
    patientId: "",
    medicine: "",
    dosage: "",
    quantity: "",
  });

  const [recentDispensing, setRecentDispensing] = useState([
    { patient: "Juan Dela Cruz", medicine: "Paracetamol 500mg", quantity: "2 Tablets", time: "10:30 AM" },
    { patient: "Maria Santos", medicine: "Amoxicillin 250mg", quantity: "1 Capsule", time: "09:15 AM" },
  ]);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => alert("Logout functionality not implemented yet.");

  const handleDispense = () => {
    if (!dispensing.patientId || !dispensing.medicine || !dispensing.quantity) {
      alert("Please fill in patient ID, medicine, and quantity.");
      return;
    }
    setShowConfirm(true); // open modal
  };

  const confirmDispense = () => {
    const newRecord = {
      patient: dispensing.patientId,
      medicine: dispensing.medicine,
      quantity: `${dispensing.quantity} units`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setRecentDispensing([newRecord, ...recentDispensing]);
    setDispensing({ patientId: "", medicine: "", dosage: "", quantity: "" });
    setShowConfirm(false);
    alert("Medicine dispensed successfully!");
  };

  const activeLabel = "Dispensing";

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
          <span className="flex items-center text-xl font-bold text-white space-x-2">
            <img src={Logo} alt="Hospital Logo" className="h-12 w-12 object-contain" />
            <span>MedCare Hospital</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-[#BFDBFE]">
          {[
              { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
               { href: route("nurse.patients.index"), label: "Patient Management", icon: <MdPerson /> },
               { href: route("physician.records"), label: "Physician Record", icon: <MdOutlinePersonPin /> },
               { href: route('cashier.dashboard'), label: "Billing", icon: <FaFileInvoiceDollar /> },
               { href: route('medicine.inventory'), label: "Medicine Inventory", icon:<MdInventory /> },
               { href: route('nurse.assistant.dashboard'), label: "Nurse Assistant", icon: <FaNotesMedical /> },
               { href: route('dispensing'), label: "Dispensing", icon: < FaPills /> },
          ].map(({ href, label, icon }) => (
            <a
              key={label}
              href={href}
              className={`flex items-center gap-x-2 p-2 rounded transition ${
                label === activeLabel
                  ? "bg-[#2563EB] text-white font-semibold"
                  : "hover:bg-[#2563EB] hover:text-white"
              }`}
              aria-current={label === activeLabel ? "page" : undefined}
            >
              {icon && <span className="text-lg">{icon}</span>}
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold"
          >
            <BiLogOutCircle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Medicine Dispensing</h1>
        <p className="text-gray-600 mb-4">Dispense medicines to patients and track recent activity.</p>

        {/* Search Medicines */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Filter</button>
        </div>

        {/* Medicine List */}
        <table className="w-full border-collapse border mb-8">
          <thead>
            <tr className="bg-gray-200">
              {["Medicine Name", "Stock", "Expiry Date", "Status"].map((header) => (
                <th key={header} className="border px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicineList
              .filter((med) => med.name.toLowerCase().includes(search.toLowerCase()))
              .map((med, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{med.name}</td>
                  <td className="border px-4 py-2">{med.stock}</td>
                  <td className="border px-4 py-2">{med.expiry}</td>
                  <td className="border px-4 py-2">{med.status}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Dispensing Form & Recent Records */}
        <div className="grid grid-cols-2 gap-6">
          {/* Record Dispensing */}
          <div className="bg-white p-4 rounded shadow space-y-4">
            <h2 className="font-semibold text-lg">Record Dispensing</h2>
            <input
              type="text"
              placeholder="Patient ID"
              value={dispensing.patientId}
              onChange={(e) => setDispensing({ ...dispensing, patientId: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Medicine"
              value={dispensing.medicine}
              onChange={(e) => setDispensing({ ...dispensing, medicine: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 2 tablets once a day)"
              value={dispensing.dosage}
              onChange={(e) => setDispensing({ ...dispensing, dosage: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={dispensing.quantity}
              onChange={(e) => setDispensing({ ...dispensing, quantity: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
            <button
              onClick={handleDispense}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Dispense Medicine
            </button>
          </div>

          {/* Recent Dispensing */}
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold text-lg">Recent Dispensing Activity</h2>
            {recentDispensing.length > 0 ? (
              recentDispensing.map((record, idx) => (
                <div key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                  <div>
                    <p className="font-semibold">{record.patient}</p>
                    <p className="text-sm">{record.medicine} | {record.quantity}</p>
                  </div>
                  <span className="text-sm text-gray-500">{record.time}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No dispensing records yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Dispensing</h3>
            <p className="text-sm mb-4">
              Are you sure you want to dispense <b>{dispensing.quantity}</b> of{" "}
              <b>{dispensing.medicine}</b> to Patient <b>{dispensing.patientId}</b>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDispense}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
