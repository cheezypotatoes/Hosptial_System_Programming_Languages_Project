import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function Appointments({ role, physician, appointments }) {
  const [searchTerm, setSearchTerm] = useState('');
 const { post } = useForm();

  // Filter appointments based on the search term (by patient name)
  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.patient.first_name} ${appointment.patient.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  }

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar Component */}
      <Sidebar role={role} activeLabel={"TEST"} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Appointments for Dr. {physician.first_name} {physician.last_name}
          </h1>

          {/* Search Bar */}
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Appointments Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">
                    Patient Name
                  </th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">
                    Appointment Date
                  </th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">
                    Problem
                  </th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">
                    Symptoms
                  </th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {appointment.patient.first_name} {appointment.patient.last_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {new Date(appointment.checkup_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">{appointment.problem}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">{appointment.symptoms}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        <Link
                          href={`/physician/appointments/${appointment.patient.id}/${appointment.id}`}  // Pass both patientId and appointmentId
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
