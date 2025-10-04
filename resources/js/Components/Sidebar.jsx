import React from 'react';
import { MdDashboard, MdPerson, MdOutlinePersonPin, MdInventory } from "react-icons/md";
import { FaFileInvoiceDollar, FaPills, FaNotesMedical } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import Logo from "@/../images/New_Logo.png";

const Sidebar = ({ role, activeLabel, handleLogout }) => {
  // Define dynamic menu items based on role
  const menuItems = {
    admin: [
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
      { href: route("nurse.patients.index"), label: "Patient Management", icon: <MdPerson /> },
      { href: route("physician.records"), label: "Physician Record", icon: <MdOutlinePersonPin /> },
      { href: route('cashier.dashboard'), label: "Billing", icon: <FaFileInvoiceDollar /> },
      { href: route('medicine.inventory'), label: "Medicine Inventory", icon: <MdInventory /> },
      // { href: route('nurse.assistant.dashboard'), label: "Nurse Assistant", icon: <FaNotesMedical /> },
      { href: route('dispensing'), label: "Dispensing", icon: <FaPills /> },
    ],
    nurse: [
           
      
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
      { href: route("nurse.appointments.viewAll"), label: "Appointments", icon: <MdDashboard /> },
      { href: route("nurse.patients.index"), label: "Patient Management", icon: <MdPerson /> },
       // { href: route('nurse.assistant.dashboard'), label: "Nurse Assistant", icon: <FaNotesMedical /> },
      { href: route('dispensing'), label: "Dispensing", icon: <FaPills /> },
    ],
    assistant: [
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
      { href: route("nurse.patients.index"), label: "Patient Management", icon: <MdPerson /> },
      { href: route('dispensing'), label: "Dispensing", icon: <FaPills /> },
    ],
    cashier: [
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
      { href: route('cashier.dashboard'), label: "Billing", icon: <FaFileInvoiceDollar /> },
    ],
    physician: [
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
      { href: route("physician.records"), label: "Physician Record", icon: <MdOutlinePersonPin /> },
    ],
    default: [
      { href: route("dashboard"), label: "Dashboard", icon: <MdDashboard /> },
    ],
  };

  // Select the menu items based on the role, or default if no role matches
  const currentMenu = menuItems[role] || menuItems['default'];

  return (
    <aside className="w-64 bg-[#1E40AF] shadow-lg flex flex-col" aria-label="Primary Navigation">
      <div className="h-16 flex items-center justify-center border-b border-blue-700" role="banner">
        <span className="flex items-center space-x-2 text-xl font-bold text-white" aria-label="MedBoard Logo and Title">
          <img src={Logo} alt="MedBoard Logo" className="h-12 w-12 object-contain" />
          <span>Jorge & Co. Med</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2 text-sm font-medium text-[#BFDBFE] overflow-y-auto" role="navigation" aria-label="Main menu">
        {currentMenu.map(({ href, label, icon }) => (
          <a
            key={label}
            href={href}
            className={`flex items-center gap-x-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#BFDBFE] transition ${
              label === activeLabel
                ? "bg-[#2563EB] text-white font-semibold"
                : "hover:bg-[#2563EB] hover:text-white"
            }`}
            aria-current={label === activeLabel ? "page" : undefined}
          >
            {icon && <span className="text-lg">{icon}</span>}
            <span>{label}</span>
          </a>
        ))}
      </nav>

      {/* Logout link fixed at bottom */}
      <div className="p-4 border-t border-blue-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-x-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400 transition font-semibold"
          aria-label="Logout"
          type="button"
        >
          <BiLogOutCircle className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
