import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function PatientAppointments({ patient, appointments }) {
    const { delete: destroy } = useForm();
    const { post } = useForm();

    function handleDelete(appointmentId) {
        if (confirm("Are you sure you want to delete this appointment?")) {
            destroy(route("nurse.appointments.destroy", appointmentId));
        }
    }

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  }
    const activeLabel = "Appointment";

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Main content */}
            <main className="flex-1 p-8">
                <div className="bg-white p-6 rounded-2xl shadow-2xl">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        Appointments for {patient.first_name} {patient.last_name}
                    </h1>

                    <div className="mb-4 text-right">
                        <Link
                            href={route("nurse.patients.index")}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            Back to Patients
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-left">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Doctor Name</th>
                                    <th className="px-4 py-2 border">Doctor Email</th>
                                    <th className="px-4 py-2 border">Checkup Date & Time</th>
                                    <th className="px-4 py-2 border">Notes</th>
                                    <th className="px-4 py-2 border">Fee</th>
                                    <th className="px-4 py-2 border">Created At</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map((appt) => (
                                        <tr key={appt.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 border">{appt.id}</td>
                                            <td className="px-4 py-2 border">
                                                {appt.doctor
                                                    ? `${appt.doctor.first_name} ${appt.doctor.last_name}`
                                                    : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border">{appt.doctor?.email || "N/A"}</td>
                                            <td className="px-4 py-2 border">
                                                {new Date(appt.checkup_date).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 border">{appt.notes || "-"}</td>
                                            <td className="px-4 py-2 border">${appt.fee}</td>
                                            <td className="px-4 py-2 border">
                                                {new Date(appt.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2 border space-x-2 flex flex-col sm:flex-row sm:space-x-2 sm:space-y-0">
                                                <button
                                                    onClick={() => handleDelete(appt.id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-gray-600"
                                        >
                                            No appointments found for this patient.
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
