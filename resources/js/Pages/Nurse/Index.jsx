import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory} from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import {  FaFileInvoiceDollar, FaPills, FaNotesMedical } from "react-icons/fa";

import Logo from "@/../images/New_Logo.png";

export default function Index({ patients }) {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState("");

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
      destroy(route("nurse.patients.destroy", id));
    }
  }

  const activeLabel = "Patient Management"; // highlight the active menu item

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
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
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={() => alert("Implement logout")}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition font-semibold"
          >
              <BiLogOutCircle className="text-lg" />
               <span>Logout</span>
    
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Patients List
          </h1>

          {/* Search bar and Add Patient */}
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search by first or last name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <Link
              href={route("nurse.patients.create")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Add Patient
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "ID",
                    "First Name",
                    "Last Name",
                    "Birthdate",
                    "Gender",
                    "Contact",
                    "Address",
                    "Created At",
                    "Actions",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 border text-left text-sm font-semibold text-gray-700"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.id}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.first_name}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.last_name}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.birthdate}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.gender}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.contact_num}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">{patient.address}</td>
                      <td className="px-4 py-2 border text-sm text-gray-800">
                        {new Date(patient.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border space-y-1 flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0">
                        <Link
                          href={route("nurse.patients.edit", patient.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm text-center"
                        >
                          Edit
                        </Link>

                        <Link
                          href={route("nurse.patients.makeAppointment", { patient: patient.id })}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm text-center"
                        >
                          Make Appointment
                        </Link>

                        <Link
                          href={route("nurse.patients.viewAppointments", { patient: patient.id })}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm text-center"
                        >
                          View Appointments
                        </Link>

                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-600">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
