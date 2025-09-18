import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route("login.store"));
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData("remember", e.target.checked)}
                            className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Remember me</label>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-indigo-600 text-black py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {processing ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Register link */}
                <p className="text-sm text-center mt-6 text-gray-700">
                    Don't have an account?{" "}
                    <Link
                        href={route("register")}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
