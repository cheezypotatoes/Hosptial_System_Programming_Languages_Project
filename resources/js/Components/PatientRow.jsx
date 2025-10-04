import React from "react";
import ActionMenu from "./ActionMenu"; // Import the ActionMenu

const PatientRow = ({ patient, onDelete, onEdit, onMakeAppointment, onViewAppointments }) => {
  // Format birthdate directly here
  const formattedBirthdate = new Date(patient.birthdate).toLocaleDateString("en-US", {
    weekday: "short", // "Mon"
    year: "numeric", // "2025"
    month: "short", // "Oct"
    day: "numeric", // "1"
  });

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.id}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.first_name}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.last_name}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{formattedBirthdate}</td> {/* Formatted birthdate */}
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.gender}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.contact_num}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.address}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">
        {new Date(patient.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-2 border space-x-2 flex items-center justify-start">
        <ActionMenu
          patientId={patient.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onMakeAppointment={onMakeAppointment}
          onViewAppointments={onViewAppointments} // Passing the new prop
        />
      </td>
    </tr>
  );
};

export default PatientRow;
