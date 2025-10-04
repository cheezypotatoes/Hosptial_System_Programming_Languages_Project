import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function AppointmentDetails({ appointment }) {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [medications, setMedications] = useState(appointment.medications || []);
  const [services, setServices] = useState(appointment.services || []);

  const { data, setData, post, processing } = useForm({
    notes,
    medications,
    services,
  });

  useEffect(() => {
    // Initialize medications and services from the appointment prop if they exist
    setMedications(appointment.medications || []);
    setServices(appointment.services || []);
  }, [appointment]);

  // Update form data when state changes
  useEffect(() => {
    setData('notes', notes);
  }, [notes, setData]);

  useEffect(() => {
    setData('medications', medications);
  }, [medications, setData]);

  useEffect(() => {
    setData('services', services);
  }, [services, setData]);

  // Handle adding new medication
  const handleAddMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', notes: '' },
    ]);
  };

  // Handle adding new service
  const handleAddService = () => {
    setServices([
      ...services,
      { id: Date.now(), name: '', description: '', cost: 0.00 },
    ]);
  };

  // Handle medication input change
  const handleMedicationChange = (index, e) => {
    const newMedications = [...medications];
    newMedications[index][e.target.name] = e.target.value;
    setMedications(newMedications);
  };

  // Handle service input change
  const handleServiceChange = (index, e) => {
    const newServices = [...services];
    newServices[index][e.target.name] = e.target.value;
    setServices(newServices);
  };

  // Handle removing a medication
  const handleRemoveMedication = (id) => {
    setMedications(medications.filter((med) => med.id !== id));
  };

  // Handle removing a service
  const handleRemoveService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  // Handle form submission
  const handleSubmit = () => {
    post(route('physician.appointments.store', appointment.id), {
      notes,
      medications,
      services,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  return (
    <div className="p-8 bg-[#14181c] min-h-screen text-black">
      <div className="max-w-5xl mx-auto bg-[#23272a] shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-[#3498db] mb-8">
          Appointment Details for {appointment.patient.first_name} {appointment.patient.last_name}
        </h1>

        {/* Appointment Notes */}
        <div className="space-y-6 mb-6">
          <div className="text-lg font-semibold text-[#cfd0d4]">Appointment Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)} // Sync local state with textarea input
            rows="4"
            className="w-full p-4 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
            placeholder="Enter any additional notes here..."
          />
        </div>

        {/* Medications */}
        <div className="space-y-6 mb-6">
          <div className="text-lg font-semibold text-[#cfd0d4]">Medications</div>
          {medications.map((med, index) => (
            <div key={med.id} className="bg-[#2a2f36] p-6 rounded-lg shadow-sm mb-4 space-y-4 border border-[#444c56]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Medication Name"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
                <input
                  type="text"
                  name="dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Dosage"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Frequency"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
                <input
                  type="text"
                  name="duration"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Duration"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
              </div>
              <textarea
                name="notes"
                value={med.notes}
                onChange={(e) => handleMedicationChange(index, e)}
                placeholder="Additional Notes"
                className="w-full p-4 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
              />
              {/* Remove Medication Button */}
              <button
                onClick={() => handleRemoveMedication(med.id)}
                className="mt-4 px-6 py-2 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition duration-200"
              >
                Remove Medication
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMedication}
            className="w-full px-6 py-3 bg-[#3498db] text-black rounded-lg font-semibold hover:bg-[#2980b9] transition duration-200"
          >
            Add Medication
          </button>
        </div>

        {/* Services */}
        <div className="space-y-6 mb-6">
          <div className="text-lg font-semibold text-[#cfd0d4]">Services</div>
          {services.map((service, index) => (
            <div key={service.id} className="bg-[#2a2f36] p-6 rounded-lg shadow-sm mb-4 space-y-4 border border-[#444c56]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, e)}
                  placeholder="Service Name"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
                <input
                  type="text"
                  name="description"
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, e)}
                  placeholder="Service Description"
                  className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
                />
              </div>
              <input
                type="number"
                name="cost"
                value={service.cost}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Cost"
                className="w-full px-4 py-3 border border-[#444c56] bg-[#1e262d] text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] transition duration-300"
              />
              {/* Remove Service Button */}
              <button
                onClick={() => handleRemoveService(service.id)}
                className="mt-4 px-6 py-2 bg-red-600 text-black rounded-lg font-semibold hover:bg-red-700 transition duration-200"
              >
                Remove Service
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddService}
            className="w-full px-6 py-3 bg-[#3498db] text-black rounded-lg font-semibold hover:bg-[#2980b9] transition duration-200"
          >
            Add Service
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={processing}
            className={`px-8 py-4 bg-green-600 text-black rounded-lg font-semibold hover:bg-green-700 transition duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
