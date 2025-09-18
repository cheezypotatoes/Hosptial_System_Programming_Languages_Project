import React from "react";
import { useForm } from "@inertiajs/react";

export default function Dashboard({ user }) {
    const { post } = useForm(); // useForm handles POST requests

    function handleLogout(e) {
        e.preventDefault();
        post(route("logout")); // Logs out via Laravel route
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
                <h1 className="text-3xl font-bold mb-4">
                    Welcome, {user.first_name}!
                </h1>
                <p className="text-gray-700 mb-6">You are now logged in.</p>
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
