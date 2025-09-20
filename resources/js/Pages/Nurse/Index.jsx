import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Index({ patients }) {
    const { delete: destroy } = useForm();

    function handleDelete(id) {
        if (confirm("Are you sure you want to delete this patient?")) {
            destroy(route("nurse.patients.destroy", id));
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Patients List</h1>

                <div className="mb-4 flex justify-between items-center">
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
                                {["ID", "First Name", "Last Name", "Birthdate", "Gender", "Contact", "Address", "Created At", "Actions"].map((col) => (
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
                            {patients.length > 0 ? (
                                patients.map((patient) => (
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
        </div>
    );
}
