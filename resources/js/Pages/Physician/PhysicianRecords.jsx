import React from "react";
import { Link } from "@inertiajs/react";

export default function PhysicianRecords({ upcomingAppointments, patient }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold border-b">🏥 Logo</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/patients" className="block p-2 rounded hover:bg-gray-200">
            Patient Management
          </Link>
          <Link href="/appointments" className="block p-2 rounded hover:bg-gray-200">
            Appointments
          </Link>
          <Link href="/physician/records" className="block p-2 rounded hover:bg-gray-200">
            Physician Record
          </Link>
          <Link href="/billing" className="block p-2 rounded hover:bg-gray-200">
            Billing
            
          </Link>
          <Link href="/medicine" className="block p-2 rounded hover:bg-gray-200">
            Medicine Inventory
          </Link>
          <Link href="/dispensing" className="block p-2 rounded hover:bg-gray-200">
            Dispensing
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Doctor’s Dashboard</h1>
          <input
            type="text"
            placeholder="Search patients, appointments"
            className="border rounded px-3 py-2"
          />
        </header>

        {/* Content */}
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
            {patient ? (
              <div>
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                <p>
                  {patient.age} years old, {patient.gender}
                </p>
                <p>Contact: {patient.contact}</p>

                <div className="mt-3">
                  <h4 className="font-semibold">Medical History</h4>
                  <p>{patient.medicalHistory}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Current Conditions</h4>
                  <p>{patient.currentConditions}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Medications</h4>
                  <p>{patient.medications}</p>
                </div>

                <div className="mt-3">
                  <h4 className="font-semibold">Medical Notes</h4>
                  <textarea
                    className="w-full border rounded p-2"
                    defaultValue={patient.notes}
                  ></textarea>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
                    Save Notes
                  </button>
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
