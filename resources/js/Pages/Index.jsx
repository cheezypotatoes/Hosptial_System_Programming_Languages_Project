import React from "react";
import { Link } from "@inertiajs/react";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to My App</h1>

      <div className="space-x-6">
        <Link
          href={route("login")}
          className="px-4 py-2 text-black font-medium hover:underline"
        >
          Login
        </Link>

        <Link
          href={route("register")}
          className="px-4 py-2 text-black font-medium hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
