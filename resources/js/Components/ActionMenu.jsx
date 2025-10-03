import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";

const ActionMenu = ({ patientId, onEdit, onDelete, onMakeAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the action menu visibility
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="bg-gray-300 text-sm text-gray-700 p-2 rounded hover:bg-gray-400"
        aria-label="Action Menu"
      >
        <MdMoreHoriz className="text-xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
          <ul className="py-2">
            <li>
              <button
                onClick={() => onEdit(patientId)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={() => onDelete(patientId)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
              >
                Delete
              </button>
            </li>
            {/* Add Make Appointment Option */}
            <li>
              <button
                onClick={() => onMakeAppointment(patientId)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
              >
                Make Appointment
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
