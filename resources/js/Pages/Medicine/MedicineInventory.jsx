import React, { useState, useEffect } from "react";
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { FaFileInvoiceDollar, FaPills } from "react-icons/fa";

import Logo from "@/../images/New_Logo.png";

export default function MedicineInventory() {
  const [search, setSearch] = useState("");
  const [medicineList, setMedicineList] = useState([
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

  const handleLogout = () => alert("Logout functionality not implemented yet.");


  const [recentDispensing, setRecentDispensing] = useState([
    { patient: "Rexcel Lusica", medicine: "Paracetamol 500mg", quantity: "2 Tablets", time: "10:30 AM" },
    { patient: "Rexcel Lusica", medicine: "Paracetamol 500mg", quantity: "2 Tablets", time: "10:30 AM" },
    { patient: "Rexcel Lusica", medicine: "Paracetamol 500mg", quantity: "2 Tablets", time: "10:30 AM" },
  ]);

const activeLabel = "Medicine Inventory"; 

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar */}
      <aside
        className="w-64 bg-[#1E40AF] shadow-lg flex flex-col"
        aria-label="Primary Navigation"
      >
        <div
          className="h-16 flex items-center justify-center border-b border-blue-700"
          role="banner"
        >
         <span
            className="flex items-center text-xl font-bold text-white space-x-2"
            aria-label="MedBoard Logo and Title"
          >
            <img
              src = {Logo}   
              alt="MedBoard Logo"
              className="margin-left-5 h-12 w-12 object-contain"
            />
            <span>Jorge & Co. Med</span>
          </span>
        </div>

                
          <nav
  className="flex-1 p-4 space-y-2 text-sm font-medium text-[#BFDBFE]"
  role="navigation"
  aria-label="Main menu"
>
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
      className={`flex items-center gap-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${
        label === activeLabel
          ? "bg-[#2563EB] text-white font-semibold"
          : "hover:bg-[#2563EB] hover:text-white"
      }`}
      aria-current={label === activeLabel ? "page" : undefined} // for accessibility
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
    </a>
  ))}
</nav>


              {/* Logout link fixed at bottom */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition font-semibold"
            aria-label="Logout"
            type="button"
          >
            <BiLogOutCircle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-2">Medicine Inventory</h1>
        <p className="text-gray-600 mb-4">Manage and track all pharmaceutical stock</p>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Filter</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Medicine</button>
        </div>

        {/* Medicine Table */}
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              {["Medicine Name", "Stock", "Expiry Date", "Status", "Actions"].map((header) => (
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
                    <td className="border px-4 py-2 flex gap-2">
                        <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">View</button>
                        <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">Dispense</button>
                    </td>
                    </tr>
                ))}

          </tbody>
        </table>

        {/* Record Dispensing */}
        <div className="mt-8 grid grid-cols-2 gap-6">
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
              placeholder="Quantity Dispensed"
              value={dispensing.quantity}
              onChange={(e) => setDispensing({ ...dispensing, quantity: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* Recent Dispensing */}
          <div className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="font-semibold text-lg">Recent Dispensing Activity</h2>
            {recentDispensing.map((record, idx) => (
              <div key={idx} className="bg-gray-100 p-2 rounded flex justify-between">
                <div>
                  <p className="font-semibold">{record.patient}</p>
                  <p className="text-sm">{record.medicine} | {record.quantity}</p>
                </div>
                <span className="text-sm text-gray-500">{record.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
