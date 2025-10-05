import React, { useState, useRef, useEffect } from "react";
import { MdMoreHoriz } from "react-icons/md";

const AppointmentActionMenu = ({ appointmentId, onViewInfo, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="bg-gray-200 p-2 rounded hover:bg-gray-300 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Appointment Actions"
      >
        <MdMoreHoriz className="text-xl" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded shadow-md z-50"
          role="menu"
          aria-orientation="vertical"
        >
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  onViewInfo(appointmentId);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100"
                role="menuitem"
              >
                View Info
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onDelete(appointmentId);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                role="menuitem"
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

export default AppointmentActionMenu;
