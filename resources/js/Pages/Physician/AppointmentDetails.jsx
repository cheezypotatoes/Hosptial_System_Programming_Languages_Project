import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';

export default function AppointmentDetails({ appointment, role, user, medicineNames, serviceNames }) {
  const [notes, setNotes] = useState(appointment.notes || '');

  const [medications, setMedications] = useState(
    appointment.medications.map(m => ({ ...m, tempId: Date.now() + Math.random() })) || []
  );

  const [services, setServices] = useState(
    appointment.services.map(s => ({ ...s, tempId: Date.now() + Math.random() })) || []
  );

  const { data, setData, post, processing } = useForm({ notes, medications, services });

  useEffect(() => setData('notes', notes), [notes, setData]);
  useEffect(() => setData('medications', medications), [medications, setData]);
  useEffect(() => setData('services', services), [services, setData]);

  const addMedication = () => {
    if (role === 'nurse') return;

    const tempId = Date.now();
    const newMed = { tempId, name: '', dosage: '', frequency: '', duration: '', notes: '' };
    setMedications([...medications, newMed]);
  };

  const handleRemoveMedication = (tempId) => {
    if (role === 'nurse') return;
    setMedications(medications.filter(m => m.tempId !== tempId));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };

  const addService = () => {
    setServices([...services, { tempId: Date.now(), name: '', description: '', cost: '', result: '' }]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;
    setServices(updated);
  };

  const handleRemoveService = (tempId) => {
    setServices(services.filter(s => s.tempId !== tempId));
  };

  const handleSubmit = () => {
    if (!notes.trim()) {
      Swal.fire({ icon: 'warning', title: 'Notes Required', text: 'Please enter notes for this appointment before saving.' });
      return;
    }

    const invalidMed = medications.find(m => !m.name.trim());
    if (invalidMed) {
      Swal.fire({ icon: 'warning', title: 'Medication Required', text: 'Please select a name for all medications.' });
      return;
    }

    post(route('physician.appointments.store', appointment.id), {
      onSuccess: () => {
        Swal.fire({ icon: 'success', title: 'Saved!', text: 'Appointment details successfully saved!', confirmButtonColor: '#3085d6' })
          .then(() => Inertia.visit(route('physician.appointments.index')));
      },
      onError: () => {
        Swal.fire({ icon: 'error', title: 'Error!', text: 'There was a problem saving the appointment. Please try again.', confirmButtonColor: '#d33' });
      },
    });
  };

  const isEditable = (field) => role !== 'nurse' || field === 'services';

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 relative">
      {processing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-white text-xl font-semibold animate-pulse">Saving appointment...</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-10 border border-gray-200 relative z-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Appointment Details</h1>

        <div className="mb-6">
          <button onClick={() => Inertia.visit(route('physician.appointments.index'))} className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400 transition">Back</button>
        </div>

        {/* Patient Info */}
        {user && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient Information</h2>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" value={user.name} readOnly className="border rounded px-2 py-2 bg-gray-100 cursor-not-allowed" />
              <input type="text" value={user.age} readOnly className="border rounded px-2 py-2 bg-gray-100 cursor-not-allowed" />
              <input type="text" value={user.contact_number} readOnly className="border rounded px-2 py-2 bg-gray-100 cursor-not-allowed" />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-10">
          <label className="block text-gray-700 font-semibold mb-2">Appointment Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} disabled={!isEditable('notes')} rows={4} placeholder="Enter notes for this appointment..." className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isEditable('notes') ? 'opacity-50 cursor-not-allowed' : ''}`} />
        </div>

        {/* Medications */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Medications</h2>
          {medications.map((med, i) => (
            <div key={med.tempId} className="grid grid-cols-5 gap-3 mb-3 items-center">
              <select value={med.name} onChange={(e) => handleMedicationChange(i, 'name', e.target.value)} className="border rounded px-2 py-2 col-span-1 focus:ring-2 focus:ring-blue-400" disabled={!isEditable('medications')}>
                <option value="">Select Medication</option>
                {medicineNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handleMedicationChange(i, 'dosage', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-400" disabled={!isEditable('medications')} />
              <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handleMedicationChange(i, 'frequency', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-400" disabled={!isEditable('medications')} />
              <input type="text" placeholder="Duration" value={med.duration} onChange={(e) => handleMedicationChange(i, 'duration', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-blue-400" disabled={!isEditable('medications')} />
              <button onClick={() => handleRemoveMedication(med.tempId)} className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition">Remove</button>
            </div>
          ))}
          {isEditable('medications') && <button onClick={addMedication} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Add Medication</button>}
        </div>

        {/* Services */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Services</h2>
          {services.map((s, i) => (
            <div key={s.tempId} className="grid grid-cols-5 gap-3 mb-3 items-center">
              <select value={s.name} onChange={(e) => handleServiceChange(i, 'name', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-green-400">
                <option value="">Select Service</option>
                {serviceNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <input type="text" placeholder="Description" value={s.description} onChange={(e) => handleServiceChange(i, 'description', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-green-400" />
              <input type="text" placeholder="Result" value={s.result} onChange={(e) => handleServiceChange(i, 'result', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-green-400" />
              <input type="number" placeholder="Cost" value={s.cost} onChange={(e) => handleServiceChange(i, 'cost', e.target.value)} className="border rounded px-2 py-2 focus:ring-2 focus:ring-green-400" />
              <button onClick={() => handleRemoveService(s.tempId)} className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition">Remove</button>
            </div>
          ))}
          <button onClick={addService} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">Add Service</button>
        </div>

        <div className="text-center">
          <button onClick={handleSubmit} disabled={processing} className={`px-10 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
