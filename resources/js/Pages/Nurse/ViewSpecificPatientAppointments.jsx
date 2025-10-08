import React from 'react';
import { useForm, router } from '@inertiajs/react'; // ✅ FIXED import
import Sidebar from '@/Components/Sidebar';
import AppointmentActionMenu from '@/Components/AppointmentActionMenu';

export default function ViewSpecificPatientAppointments({ patient, appointments, role }) {
  const { delete: destroy } = useForm();

  // ✅ Delete appointment handler
  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
      destroy(route('nurse.appointments.destroy', id));
    }
  }

  // ✅ View appointment info
  function handleViewInfo(appointmentId) {
    window.location.href = `/physician/appointments/${patient.id}/${appointmentId}`;
  }

  // ✅ Logout handler (fixed)
  function handleLogout(e) {
    e.preventDefault();
    router.post(route('logout'));
  }

  const activeLabel = "Appointment Management";

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {/* Header */}
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Appointments for {patient.first_name} {patient.last_name}
          </h1>
          <p className="text-xl text-center text-gray-600 mb-8">
            Patient ID: {patient.id} | Gender: {patient.gender} | DOB:{patient.birthdate}
          
          </p>

          {/* Appointment List */}
          {appointments.length === 0 ? (
            <p className="text-center text-gray-600">No appointments found.</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="mb-10 border border-gray-300 rounded-xl shadow-sm p-6 bg-gray-50"
              >
                {/* Appointment Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Appointment on {new Date(appointment.checkup_date).toLocaleString()}
                  </h2>
                  <AppointmentActionMenu
                    appointmentId={appointment.id}
                    onViewInfo={handleViewInfo}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Appointment Details */}
                <p className="text-gray-700 mb-2">
                  <strong>Doctor:</strong> {appointment.doctor_first_name}{" "}
                  {appointment.doctor_last_name}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Symptoms:</strong> {appointment.symptoms || "N/A"}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Notes:</strong> {appointment.notes || "No notes provided."}
                </p>

                {/* Services */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Services</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border text-left">Service</th>
                          <th className="px-4 py-2 border text-left">Description</th>
                          <th className="px-4 py-2 border text-left">Cost</th>
                          <th className="px-4 py-2 border text-left">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointment.services?.length > 0 ? (
                          appointment.services.map((service) => (
                            <tr key={service.id} className="bg-white hover:bg-gray-50">
                              <td className="px-4 py-2 border">{service.name}</td>
                              <td className="px-4 py-2 border">{service.description}</td>
                              <td className="px-4 py-2 border">₱{service.cost}</td>
                              <td className="px-4 py-2 border">{service.result || "—"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-3 text-gray-600"
                            >
                              No services found for this appointment.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Medications */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    Prescribed Medicines
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 border text-left">Medicine</th>
                          <th className="px-4 py-2 border text-left">Dosage</th>
                          <th className="px-4 py-2 border text-left">Frequency</th>
                          <th className="px-4 py-2 border text-left">Duration</th>
                          <th className="px-4 py-2 border text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointment.medications?.length > 0 ? (
                          appointment.medications.map((med) => (
                            <tr key={med.id} className="bg-white hover:bg-gray-50">
                              <td className="px-4 py-2 border">{med.name}</td>
                              <td className="px-4 py-2 border">{med.dosage}</td>
                              <td className="px-4 py-2 border">{med.frequency}</td>
                              <td className="px-4 py-2 border">{med.duration}</td>
                              <td className="px-4 py-2 border">{med.notes || "—"}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center py-3 text-gray-600"
                            >
                              No medicines prescribed for this appointment.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
