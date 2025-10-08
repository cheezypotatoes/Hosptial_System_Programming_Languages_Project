import React from "react";
import Swal from "sweetalert2";
import { useForm } from "@inertiajs/react";

export default function MakeAppointment({ patient, doctors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        doctor_id: "",
        checkup_date: "",
        problem: "",
        history: "",
        symptoms: "",
        notes: "",
        fee: "",
    });

    function handleSubmit(e) {
        e.preventDefault();

        post(route("nurse.patients.storeAppointment", patient.id), {
            onSuccess: () => {
                Swal.fire({
                    title: "Appointment Created!",
                    text: "The appointment has been successfully added.",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                });
                reset();
            },
            onError: () => {
                Swal.fire({
                    title: "Error!",
                    text: "Please check the form and try again.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            },
        });
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
                        onChange={(e) => setData("doctor_id", e.target.value)}
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
                    {errors.doctor_id && (
                        <p className="text-red-500 text-sm">{errors.doctor_id}</p>
                    )}
                </div>

                {/* Checkup date */}
                <div>
                    <label className="block text-sm font-medium mb-1">Checkup Date & Time</label>
                    <input
                        type="datetime-local"
                        name="checkup_date"
                        value={data.checkup_date}
                        onChange={(e) => setData("checkup_date", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    {errors.checkup_date && (
                        <p className="text-red-500 text-sm">{errors.checkup_date}</p>
                    )}
                </div>

                {/* Problem */}
                <div>
                    <label className="block text-sm font-medium mb-1">Problem / Reason for Visit</label>
                    <textarea
                        name="problem"
                        value={data.problem}
                        onChange={(e) => setData("problem", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    />
                    {errors.problem && <p className="text-red-500 text-sm">{errors.problem}</p>}
                </div>

                {/* History */}
                <div>
                    <label className="block text-sm font-medium mb-1">Medical History</label>
                    <textarea
                        name="history"
                        value={data.history}
                        onChange={(e) => setData("history", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    />
                    {errors.history && <p className="text-red-500 text-sm">{errors.history}</p>}
                </div>

                {/* Symptoms */}
                <div>
                    <label className="block text-sm font-medium mb-1">Symptoms</label>
                    <textarea
                        name="symptoms"
                        value={data.symptoms}
                        onChange={(e) => setData("symptoms", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={3}
                    />
                    {errors.symptoms && (
                        <p className="text-red-500 text-sm">{errors.symptoms}</p>
                    )}
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea
                        name="notes"
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                    />
                    {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
                </div>

                {/* Fee */}
                <div>
                    <label className="block text-sm font-medium mb-1">Fee</label>
                    <input
                        type="number"
                        name="fee"
                        value={data.fee}
                        onChange={(e) => setData("fee", e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        min="0"
                        step="0.01"
                        required
                    />
                    {errors.fee && <p className="text-red-500 text-sm">{errors.fee}</p>}
                </div>

                {/* Submit */}
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
