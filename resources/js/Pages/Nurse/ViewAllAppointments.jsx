import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import ActionMenuSimple from '@/Components/ActionMenuSimple';
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function ViewAllAppointments({ appointments, role }) {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState('');

  // Delete function
  function handleDelete(id) {
    destroy(route('nurse.appointments.destroy', id));
  }

  // Redirect to View appointment details
  function handleViewAppointment(appointmentId) {
    const appointment = appointments.find((a) => a.id === appointmentId);
    if (!appointment) return;

    const patientId = appointment.patient?.id || appointment.patient_id;
    console.log(`Viewing appointment ${appointmentId} for patient ${patientId}`);

    // Navigate to the appointment view page
    window.location.href = `/physician/appointments/${patientId}/${appointmentId}`;
  }

  const activeLabel = 'Appointments'; // highlight the active menu item

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor_last_name.toLowerCase().includes(searchTerm.toLowerCase())
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
  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar Component */}
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Appointments List</h1>

          {/* Search bar */}
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Appointment Date</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Symptoms</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Actions</th>
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
                        {appointment.doctor_first_name} {appointment.doctor_last_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {new Date(appointment.checkup_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">{appointment.symptoms}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {/* ✅ Simplified Action Menu (only View + Delete) */}
                        <ActionMenuSimple
                          appointmentId={appointment.id}
                          onDelete={handleDelete}
                          onView={handleViewAppointment}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-600">
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
