import React from 'react';
import { useForm, Link } from '@inertiajs/react'; // ✅ Import Link
import Sidebar from '@/Components/Sidebar';
import AppointmentActionMenu from '@/Components/AppointmentActionMenu';

export default function ViewSpecificPatientAppointments({ patient, appointments, role }) {
  const { delete: destroy } = useForm();

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
      destroy(route('nurse.appointments.destroy', id));
    }
  }

  function handleViewInfo(appointmentId) {
    window.location.href = `/physician/appointments/${patient.id}/${appointmentId}`;
  }

  function handleLogout(e) {
    e.preventDefault();
    Inertia.post(route('/logout'));
  }

  const activeLabel = "Appointment Management";

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">

          {/* Back Button */}
          <div className="mb-4">
            <Link
              href={route("nurse.patients.index")}
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
            >
              ← Back to Patients
            </Link>
          </div>

          {/* Patient Info Header */}
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Appointments for {patient.first_name} {patient.last_name}
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            Patient ID: {patient.id} | Gender: {patient.gender} | DOB: {new Date(patient.dob).toLocaleDateString()}
          </p>

          {/* Appointments Table */}
          <div className="overflow-x-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 mb-8">
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Appointment Date</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Symptoms</th>
                  <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {appointment.doctor_first_name} {appointment.doctor_last_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        {new Date(appointment.checkup_date).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800">{appointment.symptoms}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">
                        <AppointmentActionMenu
                          appointmentId={appointment.id}
                          onViewInfo={handleViewInfo}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-600">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Patient Services Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Patient Services</h2>
            <div className="overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments[0]?.services?.length > 0 ? (
                    appointments[0].services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-4 py-2 text-sm text-gray-800">{service.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {new Date(service.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800">{service.description}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-600">
                        No services found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prescribed Medicines Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Prescribed Medicines</h2>
            <div className="overflow-x-auto max-h-64 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Medicine</th>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Dosage</th>
                    <th className="px-4 py-2 border text-left text-sm font-semibold text-gray-700">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments[0]?.medications?.length > 0 ? (
                    appointments[0].medications.map((medicine) => (
                      <tr key={medicine.id}>
                        <td className="px-4 py-2 text-sm text-gray-800">{medicine.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{medicine.dosage}</td>
                        <td className="px-4 py-2 text-sm text-gray-800">{medicine.frequency}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-600">
                        No medicines prescribed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
