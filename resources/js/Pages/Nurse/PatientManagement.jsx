import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import PatientRow from "../../Components/PatientRow";
import Swal from "sweetalert2";

export default function PatientManagement({ patients, role, user, flash }) {
  const { delete: destroy } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const { post } = useForm();

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

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this patient?")) {
      destroy(route("nurse.patients.destroy", id));
    }
  }

  function handleEdit(id) {
    window.location.href = route("nurse.patients.edit", id);
  }

  function handleAppointment(id) {
    window.location.href = route("nurse.patients.makeAppointment", id);
  }

  function handleViewAppointments(id) {
    window.location.href = route("nurse.patients.viewAppointments", id);
  }

  const activeLabel = "Patient Management";

  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar Component */}
      <Sidebar role={role} user={user} activeLabel={activeLabel} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {flash?.success && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
              {flash.success}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Patients List</h1>

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
                    <PatientRow
                      key={patient.id}
                      patient={patient}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onMakeAppointment={handleAppointment}
                      onViewAppointments={handleViewAppointments}
                    />
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
