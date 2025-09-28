import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: "",
    last_name: "",
    birthdate: "",
    gender: "",
    contact_num: "",
    address: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route("nurse.patients.index"));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Back Button */}
        <div className="mb-4">
          <Link
            href={route("nurse.patients.index")}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <span className="mr-2 text-xxl">&#8592;</span> 
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Add New Patient</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-left font-medium">First Name</label>
            <input
              type="text"
              value={data.first_name}
              onChange={(e) => setData("first_name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.first_name && (
              <p className="text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-left font-medium">Last Name</label>
            <input
              type="text"
              value={data.last_name}
              onChange={(e) => setData("last_name", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>

          {/* Birthdate */}
          <div>
            <label className="block text-left font-medium">Birthdate</label>
            <input
              type="date"
              value={data.birthdate}
              onChange={(e) => setData("birthdate", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.birthdate && (
              <p className="text-red-500 text-sm">{errors.birthdate}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-left font-medium">Gender</label>
            <select
              value={data.gender}
              onChange={(e) => setData("gender", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-left font-medium">Contact Number</label>
            <input
              type="text"
              value={data.contact_num}
              onChange={(e) => setData("contact_num", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
            {errors.contact_num && (
              <p className="text-red-500 text-sm">{errors.contact_num}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-left font-medium">Address</label>
            <textarea
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              rows="3"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {processing ? "Saving..." : "Save Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}
