// PatientRow.jsx
import React from "react";
import ActionMenu from "./ActionMenu"; // Import the ActionMenu

const PatientRow = ({ patient, onDelete, onEdit, onMakeAppointment }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.id}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.first_name}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.last_name}</td>
      <td className="px-4 py-2 border text-sm text-gray-800">{patient.birthdate}</td>
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
        />
      </td>
    </tr>
  );
};

export default PatientRow;
