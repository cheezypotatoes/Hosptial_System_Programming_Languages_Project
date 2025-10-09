import React, { useState } from "react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { ArrowLeft, ClipboardList, Pill, User, Send } from "lucide-react";

export default function PatientDetails() {
  const { patient, dispense_logs } = usePage().props;
  const { post, reset } = useForm();
  const [selectedPrescription, setSelectedPrescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleDispense = (e) => {
    e.preventDefault();

    if (!selectedPrescription || !quantity) {
      console.warn("Incomplete form: Select prescription and enter quantity.");
      alert("Please select a medicine and enter quantity before dispensing.");
      return;
    }

    console.log("Dispense confirmed:", {
      patient_id: patient.id,
      prescription_id: selectedPrescription,
      quantity,
    });

    post(
      route("dispense.store"),
      {
        patient: `${patient.first_name} ${patient.last_name}`,
        prescription_id: selectedPrescription, 
        quantity,
      },
      {
        onSuccess: (page) => {
          console.log("Medicine dispensed successfully:", page.props);
          alert("Medicine dispensed successfully!");
          reset();
          setSelectedPrescription("");
          setQuantity("");
        },
        onError: (errors) => {
          console.error("Failed to dispense medicine:", errors);
          alert("Failed to dispense medicine. Check console for details.");
        },
      }
    );
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-700">
          Patient details not found.
        </h2>
        <Link
          href={route("dispensing")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Back to Dispensing
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head title={`${patient.first_name} ${patient.last_name} - Details`} />

      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Link
              href={route("dispensing")}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={22} />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-800">Patient Details</h1>
          </div>
        </div>

        {/* Patient Info */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {patient.first_name} {patient.last_name}
              </h2>
              <p className="text-sm text-gray-500">
                {patient.gender} • {patient.birthdate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Contact:</span> {patient.contact_num}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {patient.address}
            </p>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Pill className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Prescriptions</h3>
          </div>

          {patient.prescriptions.length > 0 ? (
            <table className="min-w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Medicine</th>
                  <th className="px-4 py-2 text-left">Dosage</th>
                  <th className="px-4 py-2 text-left">Instructions</th>
                  <th className="px-4 py-2 text-left">Prescribed By</th>
                </tr>
              </thead>
              <tbody>
                {patient.prescriptions.map((pres) => (
                  <tr key={pres.id} className="border-t">
                    <td className="px-4 py-2">{pres.medication}</td>
                    <td className="px-4 py-2">{pres.dosage}</td>
                    <td className="px-4 py-2">{pres.instructions}</td>
                    <td className="px-4 py-2">{pres.doctor_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No prescriptions available.</p>
          )}
        </div>

        {/* Dispense Form */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Send className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Dispense Medicine</h3>
          </div>

          <form onSubmit={handleDispense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Prescription
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={selectedPrescription}
                onChange={(e) => setSelectedPrescription(e.target.value)}
              >
                <option value="">-- Select Medicine --</option>
                {patient.prescriptions.map((pres) => (
                  <option key={pres.id} value={pres.id}>
                    {pres.medication} ({pres.dosage})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Dispense Medicine
            </button>
          </form>
        </div>

        {/* Dispense Logs */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClipboardList className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Dispense Logs</h3>
          </div>

          {dispense_logs.length > 0 ? (
            <ul className="space-y-3 text-sm text-gray-700">
              {dispense_logs.map((log) => (
                <li key={log.id} className="border-b pb-2">
                  <span className="font-medium">{log.medicine_name}</span> — <span>{log.quantity} pcs</span>{" "}
                  on <span className="text-gray-500">{new Date(log.dispensed_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No recent dispense logs.</p>
          )}
        </div>
      </div>
    </>
  );
}
