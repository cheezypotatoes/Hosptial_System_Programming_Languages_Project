import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: "",
    last_name: "",
    position: "",
    email: "",
    password: "",
    password_confirmation: "",
    specialization: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading overlay state

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Show loading overlay

    post(route("register.store"), {
      onSuccess: () => {
        setLoading(false); // Hide loading
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created successfully!",
          confirmButtonColor: "#4f46e5",
        });

        setData({
          first_name: "",
          last_name: "",
          position: "",
          email: "",
          password: "",
          password_confirmation: "",
          specialization: "",
        });
      },
      onError: () => {
        setLoading(false); // Hide loading
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: "Please check the form for errors.",
          confirmButtonColor: "#ef4444",
        });
      },
    });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-100">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">Registering...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 z-10">
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
              <option value="Nurse">Nurse</option>
              <option value="Inventory">Inventory</option>
            </select>
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          {/* Specialization (Doctor) */}
          {data.position === "Doctor" && (
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Specialization
              </label>
              <select
                value={data.specialization}
                onChange={(e) => setData("specialization", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">Select a specialization</option>
                 <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Neurology">Neurology</option>
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {processing ? "Registering..." : "Register"}
          </button>
        </form>

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
