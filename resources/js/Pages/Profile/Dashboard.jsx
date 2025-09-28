import React from "react";
import { useForm } from "@inertiajs/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Dashboard({ user }) {
  const { post } = useForm();

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  }

  const performanceData = [
    { day: "Mon", patients: 45 },
    { day: "Tue", patients: 62 },
    { day: "Wed", patients: 53 },
    { day: "Thu", patients: 78 },
    { day: "Fri", patients: 85 },
    { day: "Sat", patients: 40 },
    { day: "Sun", patients: 30 },
  ];
const activeLabel = "Dashboard"; // or pass this as a prop/state

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Sidebar */}
      <aside
        className="w-64 bg-[#1E40AF] shadow-lg flex flex-col"
        aria-label="Primary Navigation"
      >
        <div
          className="h-16 flex items-center justify-center border-b border-blue-700"
          role="banner"
        >
          <span
            className="text-xl font-bold text-[#BFDBFE]"
            aria-label="MedBoard Logo and Title"
          >
             MedBoard
          </span>
        </div>

                
            <nav
            className="flex-1 p-4 space-y-2 text-sm font-medium text-[#BFDBFE]"
            role="navigation"
            aria-label="Main menu"
            >  
          {[
            { href: route("dashboard"), label: "Dashboard", icon: "" },
            { href: route("nurse.patients.index"), label: "Patient Management", icon: "" },
            { href: "#", label: "Physician Record", icon: "" },
            { href: "#", label: "Billing", icon: "" },
            { href: "#", label: "Medicine Inventory", icon: "" },
            { href: "#", label: "Dispensing", icon: "" },
          ].map(({ href, label, icon }) => (
                    <a
                key={label}
                href={href}
                className={`block p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${
                    label === activeLabel
                    ? "bg-[#2563EB] text-white font-semibold"
                    : "hover:bg-[#2563EB] hover:text-white"
                }`}
                aria-current={label === activeLabel ? "page" : undefined} // for accessibility
                >
                <span aria-hidden="true">{icon}</span> {label}
                </a>
          ))}
        </nav>

        {/* Logout link fixed at bottom */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition font-semibold"
            aria-label="Logout"
            type="button"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto" role="main" tabIndex={-1}>
        {/* Topbar */}
        <header className="bg-[#3B82F6] shadow px-6 py-4 flex justify-between items-center">
          <label htmlFor="search" className="sr-only">Search patients, appointments</label>
          <input
            id="search"
            type="search"
            placeholder="Search patients, appointments..."
            className="w-1/3 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-[#2563EB] text-[#1E3A8A]"
            aria-label="Search patients, appointments"
          />
          <div className="flex items-center gap-4 text-[#BFDBFE]">
            <button
              title="Notifications"
              aria-label="View notifications"
              className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white rounded"
            >
              🔔
            </button>
            <span className="font-semibold" aria-live="polite">{user.first_name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-[#1E40AF]">Welcome, {user.first_name}!</h1>

          {/* Conditional Links */}
          {user.position === "Doctor" && (
            <a
              href={route("physician.edit")}
              className="block mb-4 text-[#2563EB] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              🩺 Edit Physician Data
            </a>
          )}
          {user.position === "Nurse" && (
            <>
              <a
                href={route("nurse.edit")}
                className="block mb-2 text-[#2563EB] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                 Edit Nurse Assignment
              </a>
              <a
                href={route("nurse.patients.create")}
                className="block mb-2 text-[#2563EB] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                 Add Patient
              </a>
              <a
                href={route("nurse.patients.index")}
                className="block mb-4 text-[#2563EB] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                 View Patients
              </a>
            </>
          )}

          {/* Dashboard Cards */}
          <section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            aria-label="Dashboard summary cards"
          >
            {[
              { label: "Patients Today", value: 143 },
              { label: "Upcoming Appointments", value: 69 },
              { label: "Billing Section", value: 25 },
              { label: "Medicine Stock Alerts", value: 67 },
            ].map(({ label, value }) => (
              <article
                key={label}
                className="bg-white shadow-md p-4 rounded"
                tabIndex={0}
                aria-label={`${label}: ${value}`}
              >
                <h3 className="font-semibold text-[#1E40AF]">{label}</h3>
                <p className="text-2xl mt-2 font-bold">{value}</p>
              </article>
            ))}
          </section>

          {/* Insights Row */}
          <section
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
            aria-label="Insights"
          >
            {/* Performance Insights */}
            <article
              className="bg-white p-4 rounded shadow"
              tabIndex={0}
              aria-label="Performance Insights Line Chart"
            >
              <h3 className="font-semibold text-[#1E40AF] mb-4">Performance Insights</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData} role="img" aria-label="Line chart showing patients per day">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" stroke="#1E3A8A" />
                  <YAxis stroke="#1E3A8A" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#2563EB" />
                </LineChart>
              </ResponsiveContainer>
            </article>

            {/* Appointment Status Distribution */}
            <article
              className="bg-white p-4 rounded shadow flex flex-col items-center justify-center"
              tabIndex={0}
              aria-label="Appointment Status Distribution Pie Chart"
            >
              <h3 className="font-semibold text-[#1E40AF] mb-4">Appointment Status Distribution</h3>

              {/* Pie Chart SVG with ARIA */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                role="img"
                aria-labelledby="pieTitle pieDesc"
                aria-describedby="legendDesc"
              >
                <title id="pieTitle">Appointment Status Distribution</title>
                <desc id="pieDesc">Pie chart showing Confirmed, Pending, and Cancelled appointments</desc>
                <circle cx="100" cy="100" r="90" stroke="#ddd" strokeWidth="10" fill="none" />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#2563EB"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="440 140"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  stroke="#60A5FA"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="140 440"
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  stroke="#1E40AF"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="70 490"
                  transform="rotate(-90 100 100)"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy="7"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#1E3A8A"
                >
                  70%
                </text>
              </svg>

              {/* Inline Legend */}
              <div
                className="mt-4 flex gap-6 text-sm text-[#1E3A8A]"
                id="legendDesc"
              >
                <div className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-[#2563EB] mr-2 rounded"></span>
                  Confirmed
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-[#60A5FA] mr-2 rounded"></span>
                  Pending
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 inline-block bg-[#1E40AF] mr-2 rounded"></span>
                  Cancelled
                </div>
              </div>
            </article>
          </section>

          {/* Recent Activities */}
          <section aria-label="Recent Activities and Alerts" className="mb-10">
            <h3 className="font-semibold text-[#1E40AF] mb-4">Recent Activities & Alerts</h3>
            <table
              className="min-w-full table-auto bg-white shadow rounded"
              role="table"
              aria-describedby="activitiesDesc"
            >
              <caption id="activitiesDesc" className="sr-only">
                Table showing recent activities and their status
              </caption>
              <thead className="bg-blue-100">
                <tr>
                  <th scope="col" className="p-2 border text-[#1E40AF]">Event</th>
                  <th scope="col" className="p-2 border text-[#1E40AF]">Time</th>
                  <th scope="col" className="p-2 border text-[#1E40AF]">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr tabIndex={0}>
                  <td className="p-2 border">New patient: John D. Dough</td>
                  <td className="p-2 border">5 mins ago</td>
                  <td className="p-2 border">New</td>
                </tr>
                <tr tabIndex={0}>
                  <td className="p-2 border">Updated medical notes: Jane Smith</td>
                  <td className="p-2 border">15 mins ago</td>
                  <td className="p-2 border">Updated</td>
                </tr>
                <tr tabIndex={0}>
                  <td className="p-2 border">Appointment confirmed: Mommy Oni</td>
                  <td className="p-2 border">30 mins ago</td>
                  <td className="p-2 border">Completed</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
