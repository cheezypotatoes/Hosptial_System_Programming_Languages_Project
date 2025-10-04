import React from "react";
import { useForm } from "@inertiajs/react";

export default function MakeAppointment({ patient, doctors }) {
    const { data, setData, post, processing, errors } = useForm({
        doctor_id: "",
        checkup_date: "",
        notes: "",
        fee: "",
        problem: "",       // New field for problem
        history: "",       // New field for medical history
        symptoms: "",      // New field for symptoms
        medication: "",    // New field for medication
    });

    function handleSubmit(e) {
        e.preventDefault();
        // Send all the data (including new fields) to the backend
        post(route("nurse.patients.storeAppointment", patient.id));
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Make Appointment for {patient.first_name} {patient.last_name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Doctor selection */}
                <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <select
                        name="doctor_id"
                        value={data.doctor_id}
                        onChange={e => setData("doctor_id", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.first_name} {doctor.last_name} - {doctor.specialization}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select the doctor you want to schedule an appointment with.</p>
                    {errors.doctor_id && <p className="text-red-500 text-sm">{errors.doctor_id}</p>}
                </div>

                {/* Checkup date */}
                <div>
                    <label className="block text-sm font-medium mb-1">Checkup Date & Time</label>
                    <input
                        type="datetime-local"
                        name="checkup_date"
                        value={data.checkup_date}
                        onChange={e => setData("checkup_date", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Pick a date and time for the appointment.</p>
                    {errors.checkup_date && <p className="text-red-500 text-sm">{errors.checkup_date}</p>}
                </div>

                {/* Problem */}
                <div>
                    <label className="block text-sm font-medium mb-1">Problem</label>
                    <input
                        type="text"
                        name="problem"
                        value={data.problem}
                        onChange={e => setData("problem", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Describe the main issue or reason for the appointment (e.g., pain, discomfort, etc.).</p>
                    {errors.problem && <p className="text-red-500 text-sm">{errors.problem}</p>}
                </div>

                {/* Medical History */}
                <div>
                    <label className="block text-sm font-medium mb-1">Medical History</label>
                    <textarea
                        name="history"
                        value={data.history}
                        onChange={e => setData("history", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Provide any relevant past medical history, treatments, or surgeries.</p>
                    {errors.history && <p className="text-red-500 text-sm">{errors.history}</p>}
                </div>

                {/* Symptoms */}
                <div>
                    <label className="block text-sm font-medium mb-1">Symptoms</label>
                    <textarea
                        name="symptoms"
                        value={data.symptoms}
                        onChange={e => setData("symptoms", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Describe the symptoms the patient is experiencing (e.g., fever, nausea, dizziness, etc.).</p>
                    {errors.symptoms && <p className="text-red-500 text-sm">{errors.symptoms}</p>}
                </div>

                {/* Medication */}
                <div>
                    <label className="block text-sm font-medium mb-1">Current Medication</label>
                    <input
                        type="text"
                        name="medication"
                        value={data.medication}
                        onChange={e => setData("medication", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">List any current medications the patient is taking (e.g., tablets, injections, supplements, etc.).</p>
                    {errors.medication && <p className="text-red-500 text-sm">{errors.medication}</p>}
                </div>

                {/* Fee */}
                <div>
                    <label className="block text-sm font-medium mb-1">Fee</label>
                    <input
                        type="number"
                        name="fee"
                        value={data.fee}
                        onChange={e => setData("fee", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        min="0"
                        step="0.01"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the expected fee for the checkup (e.g., consultation fee, procedure cost, etc.).</p>
                    {errors.fee && <p className="text-red-500 text-sm">{errors.fee}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Make Appointment
                </button>
            </form>
        </div>
    );
}
