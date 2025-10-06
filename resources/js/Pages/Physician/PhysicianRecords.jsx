import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from "@/Components/Sidebar";

export default function PhysicianRecords({ upcomingAppointments, role, user, patient: initialPatient,searchResults: initialSearchResults, }) {
  const { data, setData } = useForm({ search: "" });
  const [searchResults, setSearchResults] = useState(initialSearchResults || []);
  const [selectedPatient, setSelectedPatient] = useState(initialPatient || null);
  const activeLabel = "Physician Record";
// Fixed
const medicalConditions = selectedPatient?.medical_conditions || [];
const appointmentMeds = selectedPatient?.appointment_medications || [];

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      Inertia.post(route("logout"));
    }
  }

 // DEBUG function
const logPatientData = (patient, stage) => {
  console.log(`--- DEBUG [${stage}] ---`);
  console.log("Patient object:", patient);
  console.log("Medical conditions:", patient?.medical_conditions);
  console.log("Prescriptions:", patient?.prescriptions);
  console.log("Appointment medications:", patient?.appointment_medications);
  console.log("-----------------------");
};


  // Search patients dynamically
  function handleSearch(e) {
    e.preventDefault();
    console.log("Searching patients for:", data.search);

    Inertia.get(
      "/physician/records",
      { search: data.search },
      {
        preserveState: true,
        onSuccess: (page) => {
          console.log("Search results returned from backend:", page.props.searchResults);
          setSearchResults(page.props.searchResults || []);
        },
        onError: (errors) => {
          console.error("Error during search:", errors);
        },
      }
    );
  }

  // Fetch full patient record when selected
  function handleSelectPatient(patient, e) {
    if (e) e.preventDefault();
    console.log("Patient clicked:", patient);

    Inertia.get(
      "/physician/records",
      { patient_id: patient.id },
      {
        preserveState: true,
        onSuccess: (page) => {
          console.log("Full patient record fetched successfully:", page.props.patient);
          setSelectedPatient(page.props.patient || null);
          setSearchResults([]);
          logPatientData(page.props.patient, "After fetch");
        },
        onError: (errors) => {
          console.error("Error fetching patient record:", errors);
        },
      }
    );
  }

  useEffect(() => {
    if (initialPatient) {
      setSelectedPatient(initialPatient);
      logPatientData(initialPatient, "Initial load");
    }
  }, [initialPatient]);

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Doctor’s Dashboard</h1>
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <input
              type="text"
              value={data.search}
              onChange={(e) => setData("search", e.target.value)}
              placeholder="Search patients by name or ID"
              className="border rounded px-3 py-2 w-full"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 mt-2 mr-2 bg-blue-600 text-white px-3 py-1 rounded"
            >
              Search
            </button>

            {searchResults.length > 0 && (
              <ul className="absolute z-10 bg-white w-full border mt-1 rounded shadow max-h-60 overflow-y-auto">
                {searchResults.map((p) => (
                  <li
                    key={p.id}
                    onClick={(e) => handleSelectPatient(p, e)}
                    className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                  >
                    {p.name} (ID: {p.id}) - {p.age} yrs • {p.gender}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </header>

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <section className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-3">Upcoming Appointments</h2>
            {upcomingAppointments?.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <div key={appt.id} className="p-2 border-b">
                  <p className="font-semibold">{appt.patientName}</p>
                  <p className="text-sm">{appt.time}</p>
                  <p className="text-xs text-gray-500">{appt.reason}</p>
                </div>
              ))
            ) : (
              <p>No appointments scheduled.</p>
            )}
          </section>

    {/* Patient Record */}
<section className="bg-white p-4 rounded shadow">
  <h2 className="font-bold mb-3">Patient Record</h2>
  {selectedPatient ? (
    <div>
      <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
      <p>
        {selectedPatient.age} years old, {selectedPatient.gender}
      </p>
      <p>Contact: {selectedPatient.contact}</p>

      {/* Medical History */}
      <div className="mt-3">
        <h4 className="font-semibold">Medical History</h4>
        <ul className="list-disc ml-5">
          {selectedPatient.medical_conditions?.length > 0 ? (
            selectedPatient.medical_conditions.map((c) => (
              <li key={c.id}>
                {c.condition_name} ({c.status}) - Diagnosed: {c.diagnosed_date}
              </li>
            ))
          ) : (
            <li>No past conditions.</li>
          )}
        </ul>
      </div>

      {/* Prescriptions */}
      <div className="mt-3">
        <h4 className="font-semibold">Prescriptions</h4>
        <ul className="list-disc ml-5">
          {selectedPatient.prescriptions?.length > 0 ? (
            selectedPatient.prescriptions.map((p) => (
              <li key={p.id}>
                {p.medication} ({p.dosage}) by {p.doctor_name} on {p.prescribed_date}
              </li>
            ))
          ) : (
            <li>No past prescriptions.</li>
          )}
        </ul>
      </div>

      {/* Appointment Medications */}
      <div className="mt-3">
        <h4 className="font-semibold">Appointment Medications</h4>
        <ul className="list-disc ml-5">
          {selectedPatient.appointment_medications?.length > 0 ? (
            selectedPatient.appointment_medications.map((m) => (
              <li key={m.id}>
                {m.name} - Dosage: {m.dosage}, Frequency: {m.frequency}, Duration: {m.duration}
              </li>
            ))
          ) : (
            <li>No appointment medications.</li>
          )}
        </ul>
      </div>

      {/* Medical Notes */}
      <div className="mt-3">
        <h4 className="font-semibold">Medical Notes</h4>
        <textarea
          className="w-full border rounded p-2"
          defaultValue={selectedPatient.notes || ""}
        ></textarea>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Save Notes</button>
      </div>
    </div>
  ) : (
    <p>Select a patient to view record.</p>
    
  )}
</section>

        </div>
      </main>
    </div>
  );
}
