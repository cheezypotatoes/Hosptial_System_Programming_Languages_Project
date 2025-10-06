import React, { useState } from "react";
import { MdMoreHoriz } from "react-icons/md";

const ActionMenuSimple = ({ appointmentId, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu when clicking outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".action-menu")) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="relative action-menu">
      <button
        onClick={toggleMenu}
        className="bg-gray-300 text-sm text-gray-700 p-2 rounded hover:bg-gray-400"
        aria-label="Action Menu"
      >
        <MdMoreHoriz className="text-xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {/* View Button */}
            <li>
              <button
                onClick={() => onView(appointmentId)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100"
              >
                View
              </button>
            </li>

            {/* Delete Button */}
            <li>
              <button
                onClick={() => onDelete(appointmentId)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionMenuSimple;
