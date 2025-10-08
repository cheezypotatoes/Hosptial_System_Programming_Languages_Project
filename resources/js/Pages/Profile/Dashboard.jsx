import React from "react";
import { useForm } from "@inertiajs/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '../../Components/Sidebar';

export default function Dashboard({ user, role, appointmentsTodayCount, upcomingAppointmentsCount , lowStockCount}) {
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
  
  const activeLabel = "Dashboard"; // Example of active label

  return (
    <div className="flex min-h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      {/* Pass the user role (position in lowercase) to Sidebar */}
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto" role="main" tabIndex={-1}>
        {/* Top bar */}
        <header className="bg-[#3B82F6] shadow px-6 py-4 flex justify-between items-center flex-shrink-0">
          <label htmlFor="search" className="sr-only">Search patients, appointments</label>
          <input
            id="search"
            type="search"
            placeholder="Search patients, appointments..."
            className="w-1/3 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring focus:ring-[#2563EB] text-[#1E3A8A]"
            aria-label="Search patients, appointments"
          />
          <div className="flex items-center gap-4 text-[#BFDBFE]">
            <button title="Notifications" aria-label="View notifications" className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white rounded">
              🔔
            </button>
            <span className="font-semibold" aria-live="polite">{user.first_name}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-[#1E40AF]">Welcome, {user.first_name}! as {role}</h1>

              {/* Dashboard Cards */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" aria-label="Dashboard summary cards">
      {[ 
        { label: "Patients Today", value: appointmentsTodayCount },
        { label: "Upcoming Appointments", value: upcomingAppointmentsCount },
        { label: "Medicine Stock Alerts", value: lowStockCount }, // dynamic value
      ].map(({ label, value }) => (
        <article key={label} className="bg-white shadow-md p-4 rounded" tabIndex={0} aria-label={`${label}: ${value}`}>
          <h3 className="font-semibold text-[#1E40AF]">{label}</h3>
          <p className="text-2xl mt-2 font-bold">{value}</p>
        </article>
      ))}
    </section>


          {/* Insights Row */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10" aria-label="Insights">
            {/* Performance Insights */}
            <article className="bg-white p-4 rounded shadow" tabIndex={0} aria-label="Performance Insights Line Chart">
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
            <article className="bg-white p-4 rounded shadow flex flex-col items-center justify-center" tabIndex={0} aria-label="Appointment Status Distribution Pie Chart">
              <h3 className="font-semibold text-[#1E40AF] mb-4">Appointment Status Distribution</h3>
              {/* Your Pie Chart SVG goes here */}
            </article>
          </section>

         
        </main>
      </div>
    </div>
  );
}
