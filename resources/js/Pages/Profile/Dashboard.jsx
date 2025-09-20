import React from "react";
import { useForm } from "@inertiajs/react";

export default function Dashboard({ user }) {
    const { post } = useForm();

    function handleLogout(e) {
        e.preventDefault();
        post(route("logout"));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Welcome, {user.first_name}!
                </h1>
                <p className="text-gray-700 mb-6">You are now logged in.</p>

                {/* Edit Physician link for doctors */}
                {user.position === "Doctor" && (
                    <a
                        href={route("physician.edit")}
                        className="block mb-4 text-blue-600 font-semibold hover:underline"
                    >
                        Edit Physician Data
                    </a>
                )}

                {/* Links for nurses */}
                {user.position === "Nurse" && (
                    <>
                        <a
                            href={route("nurse.edit")}
                            className="block mb-4 text-green-600 font-semibold hover:underline"
                        >
                            Edit Nurse Assignment
                        </a>

                        <a
                            href={route("nurse.patients.create")}
                            className="block mb-4 text-purple-600 font-semibold hover:underline"
                        >
                            Add Patient
                        </a>


                        <a
                            href={route("nurse.patients.index")}
                            className="block mb-4 text-blue-600 font-semibold hover:underline"
                        >
                            View Patient
                        </a>
                    </>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
