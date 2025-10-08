import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function Appointments({ role, physician, appointments }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { post } = useForm();

  const filteredAppointments = appointments.filter(a =>
    `${a.patient.first_name} ${a.patient.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleLogout = (e) => {
       e.preventDefault();
       Swal.fire({
         title: "Are you sure?",
         text: "Do you want to logout?",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "Yes, logout",
         cancelButtonText: "Cancel",
       }).then((result) => {
         if (result.isConfirmed) post(route("logout"));
       });
     };
  
  const activeLabel = "View All Appointments";

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Appointments for Dr. {physician.first_name} {physician.last_name}
          </h1>

          {/* Search */}
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Search appointments"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Patient Name</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Appointment Date</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Problem</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">History</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {appt.patient.first_name} {appt.patient.last_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {new Date(appt.checkup_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {appt.problem || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {appt.history || '-'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        <Link
                          href={`/physician/appointments/${appt.patient.id}/${appt.id}`}
                          className="text-blue-500 hover:text-blue-700 font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-600">
                      No appointments found.
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
