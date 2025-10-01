import React, { useState } from "react";
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { FaFileInvoiceDollar, FaPills } from "react-icons/fa";

import Logo from "@/../images/New_Logo.png";

const mockAppointments = [
  {
    id: "2032031",
    name: "Jorge Macabenta",
    time: "10:40 AM",
    reason: "Banana tree incident",
    medicalHistory: ["Childhood asthma (Ongoing)", "Sakit sa kilog (Ongoing)"],
    currentConditions: ["Mild hypertension"],
    medications: ["Loperamide 10mg (daily)"],
    contact: "09234657891",
    age: 69,
    gender: "Male",
    physician: "Doc. Mikey",
    date: "9/15/2030",
  },
  {
    id: "2032032",
    name: "Bren Ciano",
    time: "1:40 PM",
    reason: "Banana tree mishap",
  },
  {
    id: "2032033",
    name: "Rexcel Lusica",
    time: "2:40 PM",
    reason: "Boulevard incident",
  },
];

export default function AssistantDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(mockAppointments[0]);
  const [activeLabel, setActiveLabel] = useState("Nurse Assistant");

  const filteredAppointments = mockAppointments.filter((appt) =>
    appt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // Add logout functionality here
    alert("Logged out!");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col" aria-label="Primary Navigation">
        <div className="h-16 flex items-center justify-center border-b border-blue-700" role="banner">
          <span className="flex items-center text-xl font-bold text-white space-x-2">
            <img src={Logo} alt="MedBoard Logo" className="h-12 w-12 object-contain" />
            <span>Jorge & Co. Med</span>
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
              onClick={() => setActiveLabel(label)}
              className={`flex items-center gap-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${
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

        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition font-semibold"
          >
            <BiLogOutCircle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Assistant Dashboard</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search patient's by name, ID, or condition..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full mb-6"
        />

        <div className="flex gap-6">
          {/* Upcoming Appointments */}
          <div className="w-1/3">
            <h2 className="font-semibold mb-4">Upcoming Appointments</h2>
            <div className="flex flex-col gap-2">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id + appt.time}
                  className={`border p-2 rounded cursor-pointer ${
                    selectedPatient?.id === appt.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedPatient(appt)}
                >
                  <p className="font-semibold">{appt.name}</p>
                  <p className="text-sm">{appt.time}</p>
                  <p className="text-xs text-gray-600">{appt.reason}</p>
                  <p className="text-xs text-gray-400">ID: {appt.id}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Record */}
          {selectedPatient && (
            <div className="w-2/3 border p-4 rounded">
              <h2 className="font-semibold mb-2">{selectedPatient.name}</h2>
              <p>ID: {selectedPatient.id}</p>
              {selectedPatient.age && selectedPatient.gender && (
                <p>
                  {selectedPatient.age} years old, {selectedPatient.gender}
                </p>
              )}
              {selectedPatient.contact && <p>Contact: {selectedPatient.contact}</p>}
              {selectedPatient.physician && selectedPatient.date && (
                <p>
                  Scheduled to: {selectedPatient.physician} / {selectedPatient.date}
                </p>
              )}

              {selectedPatient.medicalHistory?.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4">Medical History</h3>
                  <ul className="list-disc list-inside">
                    {selectedPatient.medicalHistory.map((history, idx) => (
                      <li key={idx}>{history}</li>
                    ))}
                  </ul>
                </>
              )}

              {selectedPatient.currentConditions?.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4">Current Conditions</h3>
                  <ul className="list-disc list-inside">
                    {selectedPatient.currentConditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                </>
              )}

              {selectedPatient.medications?.length > 0 && (
                <>
                  <h3 className="font-semibold mt-4">Medications</h3>
                  <ul className="list-disc list-inside">
                    {selectedPatient.medications.map((med, idx) => (
                      <li key={idx}>{med}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-6 flex gap-4">
                <button className="px-4 py-2 bg-gray-300 rounded">Change Physician</button>
                <button className="px-4 py-2 bg-gray-300 rounded">Reschedule Patient</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
