import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
    first_name: "",
    last_name: "",
    position: "",
    email: "",
    password: "",
    password_confirmation: "",
    });

  function handleSubmit(e) {
    e.preventDefault();
    post(route("register.store"));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
          Create Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={data.first_name}
              onChange={(e) => setData("first_name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => setData("last_name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

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


          {/* Position */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Position
            </label>
            <select
              value={data.position}
              onChange={(e) => setData("position", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              <option value="">Select a position</option>
              <option value="Doctor">Doctor</option>
              <option value="Cashier">Cashier</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="LabTech">LabTech</option>
            </select>
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 text-black py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-sm text-center mt-6 text-gray-700">
          Already have an account?{" "}
          <Link
            href={route("login")}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
