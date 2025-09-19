import React from "react";
import { useForm } from "@inertiajs/react";

export default function PhysicianEdit({ user, physician }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        specialization: physician?.specialization || "",
        contract_number: physician?.contract_number || "",
        room_number: physician?.room_number || "",
        starting_time: physician?.starting_time || "",
        end_time: physician?.end_time || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("physician.update"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Edit Physician Data</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name */}
                    <div>
                        <label className="block mb-1 font-semibold">First Name</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData("first_name", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block mb-1 font-semibold">Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData("last_name", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
                    </div>

                    {/* Specialization */}
                    <div>
                        <label className="block mb-1 font-semibold">Specialization</label>
                        <input
                            type="text"
                            value={data.specialization}
                            onChange={(e) => setData("specialization", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.specialization && <p className="text-red-500">{errors.specialization}</p>}
                    </div>

                    {/* Contract Number */}
                    <div>
                        <label className="block mb-1 font-semibold">Contract Number</label>
                        <input
                            type="text"
                            value={data.contract_number}
                            onChange={(e) => setData("contract_number", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.contract_number && <p className="text-red-500">{errors.contract_number}</p>}
                    </div>

                    {/* Room Number */}
                    <div>
                        <label className="block mb-1 font-semibold">Room Number</label>
                        <input
                            type="text"
                            value={data.room_number}
                            onChange={(e) => setData("room_number", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.room_number && <p className="text-red-500">{errors.room_number}</p>}
                    </div>

                    {/* Starting Time */}
                    <div>
                        <label className="block mb-1 font-semibold">Starting Time</label>
                        <input
                            type="time"
                            value={data.starting_time}
                            onChange={(e) => setData("starting_time", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.starting_time && <p className="text-red-500">{errors.starting_time}</p>}
                    </div>

                    {/* End Time */}
                    <div>
                        <label className="block mb-1 font-semibold">End Time</label>
                        <input
                            type="time"
                            value={data.end_time}
                            onChange={(e) => setData("end_time", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.end_time && <p className="text-red-500">{errors.end_time}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
