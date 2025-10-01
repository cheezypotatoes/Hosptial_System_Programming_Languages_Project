import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import {
  MdDashboard,
  MdPerson,
  MdOutlinePersonPin,
  MdOutlineInventory,
  MdLocalPharmacy,
} from "react-icons/md";
import { BiMoneyWithdraw, BiLogOutCircle } from "react-icons/bi";

import Logo from "@/../images/New_Logo.png";

export default function PhysicianRecords({
  upcomingAppointments,
  patient,
  filters,
  searchResults = [], // pass results from backend
}) {
  const { data, setData, get } = useForm({
    search: filters.search || "",
  });

  const activeLabel = "Physician Record"; 

  const [selectedPatient, setSelectedPatient] = useState(patient || null);

  
  function handleSearch(e) {
    e.preventDefault();
    get("/physician/records", { preserveState: true });
  }

  function handleSelectPatient(p) {
    setSelectedPatient(p);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
          <span className="flex items-center text-xl font-bold text-white space-x-2">
            <img
              src={Logo}
              alt="MedBoard Logo"
              className="h-12 w-12 object-contain"
            />
            <span>Jorge & Co. Med</span>
          </span>
        </div>

        {/* Navigation */}
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
            <Link
              key={label}
              href={href}
            className={`flex items-center gap-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${
              label === activeLabel
                ? "bg-[#2563EB] text-white font-semibold"
                : "hover:bg-[#2563EB] hover:text-white"
            }`}
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout link */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={() => console.log("Logout clicked")}
            className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition font-semibold"
          >
            <BiLogOutCircle className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header with search */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Doctor’s Dashboard</h1>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={data.search}
              onChange={(e) => setData("search", e.target.value)}
              placeholder="Search patients by name or ID"
              className="border rounded px-3 py-2 flex-1"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded"
            >
              Search
            </button>
          </form>

          {/* Search results (small cards) */}
          {searchResults.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleSelectPatient(res)}
                  className="p-4 bg-white rounded shadow cursor-pointer hover:bg-blue-50 border"
                >
                  <h3 className="font-semibold">{res.name}</h3>
                  <p className="text-sm text-gray-600">ID: {res.id}</p>
                  <p className="text-sm text-gray-600">
                    {res.age} yrs • {res.gender}
                  </p>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">Upcoming Appointments</h2>
            {upcomingAppointments?.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <div key={appt.id} className="p-2 border-b">
                  <p className="font-semibold">{appt.patientName}</p>
                  <p className="text-sm">{appt.time}</p>
                  <p className="text-xs text-gray-500">{appt.reason}</p>
                </div>
              ))
            ) : (
              <p>No appointments scheduled.</p>
            )}
          </section>

          {/* Patient Record */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">Patient Record</h2>
            {selectedPatient ? (
              <div>
                <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                <p>
                  {selectedPatient.age} years old, {selectedPatient.gender}
                </p>
                <p>Contact: {selectedPatient.contact}</p>

                <div className="mt-3">
                  <h4 className="font-semibold">Medical History</h4>
                  <p>{selectedPatient.medicalHistory}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Current Conditions</h4>
                  <p>{selectedPatient.currentConditions}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Medications</h4>
                  <p>{selectedPatient.medications}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Medical Notes</h4>
                  <textarea
                    className="w-full border rounded p-2"
                    defaultValue={selectedPatient.notes}
                  ></textarea>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <p>Select a patient to view record.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
