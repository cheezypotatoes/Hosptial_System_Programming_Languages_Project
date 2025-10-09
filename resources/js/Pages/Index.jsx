import React from "react";
import { Link } from "@inertiajs/react";
import Logo from "@/../images/New_Logo.png";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-500 px-4">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src={Logo} alt="Jorge & Co Logo" className="w-50 h-50 mb-4 object-contain" />
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
          Jorge & Co Medical Center
        </h1>
        <p className="text-white text-center mt-2 text-lg md:text-xl">
          Quality Healthcare, Caring Hands
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        <Link
          href={route("login")}
          className="w-48 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-blue-50 transition text-center" >
          Login
        </Link>

        <Link
          href={route("register")}
          className="w-48 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition text-center" >
          Register
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-white text-center text-sm opacity-80">
        &copy; {new Date().getFullYear()} Jorge & Co Medical Center. All rights reserved.
      </footer>
    </div>
  );
}
