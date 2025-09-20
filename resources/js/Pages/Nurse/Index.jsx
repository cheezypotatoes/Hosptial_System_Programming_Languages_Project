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
            <div className="bg-white p-6 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Patients List
                </h1>

                <div className="mb-4 text-right">
                    <Link
                        href={route("nurse.patients.create")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add Patient
                    </Link>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left">
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">First Name</th>
                            <th className="px-4 py-2 border">Last Name</th>
                            <th className="px-4 py-2 border">Birthdate</th>
                            <th className="px-4 py-2 border">Gender</th>
                            <th className="px-4 py-2 border">Contact</th>
                            <th className="px-4 py-2 border">Address</th>
                            <th className="px-4 py-2 border">Created At</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border">{patient.id}</td>
                                    <td className="px-4 py-2 border">{patient.first_name}</td>
                                    <td className="px-4 py-2 border">{patient.last_name}</td>
                                    <td className="px-4 py-2 border">{patient.birthdate}</td>
                                    <td className="px-4 py-2 border">{patient.gender}</td>
                                    <td className="px-4 py-2 border">{patient.contact_num}</td>
                                    <td className="px-4 py-2 border">{patient.address}</td>
                                    <td className="px-4 py-2 border">
                                        {new Date(patient.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2 border space-x-2">
                                        <Link
                                            href={route("nurse.patients.edit", patient.id)}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(patient.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    No patients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
