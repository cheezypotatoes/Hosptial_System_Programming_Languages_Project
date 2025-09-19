import React from "react";
import { useForm } from "@inertiajs/react";

export default function NurseEdit({ user, nurse }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        assigned_to: nurse?.assigned_to || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("nurse.update"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Edit Profile & Assignment</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">First Name</label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData("first_name", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.first_name && (
                            <p className="text-red-500">{errors.first_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Last Name</label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData("last_name", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.last_name && (
                            <p className="text-red-500">{errors.last_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Assigned To</label>
                        <input
                            type="text"
                            value={data.assigned_to}
                            onChange={(e) => setData("assigned_to", e.target.value)}
                            className="w-full border px-3 py-2 rounded-lg"
                        />
                        {errors.assigned_to && (
                            <p className="text-red-500">{errors.assigned_to}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
                    >
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}
