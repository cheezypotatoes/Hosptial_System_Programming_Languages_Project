import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function AppointmentDetails({ appointment, role, medicineNames, serviceNames }) {
  const [notes, setNotes] = useState(appointment.notes || '');
  const [medications, setMedications] = useState(appointment.medications || []);
  const [services, setServices] = useState(
    appointment.services
      ? appointment.services.map(s => ({ ...s, result: s.result || '' }))
      : []
  );

  // Autocomplete suggestions
  const [medSuggestions, setMedSuggestions] = useState([]);
  const [serviceSuggestions, setServiceSuggestions] = useState([]);

  const { data, setData, post, processing } = useForm({
    notes,
    medications,
    services,
  });

  // Sync state with form data
  useEffect(() => {
    setMedications(appointment.medications || []);
    setServices(
      appointment.services
        ? appointment.services.map(s => ({ ...s, result: s.result || '' }))
        : []
    );
  }, [appointment]);

  useEffect(() => setData('notes', notes), [notes, setData]);
  useEffect(() => setData('medications', medications), [medications, setData]);
  useEffect(() => setData('services', services), [services, setData]);

  // Add new medication
  const handleAddMedication = () => {
    if (role === 'nurse') return;
    setMedications([
      ...medications,
      { id: Date.now(), name: '', dosage: '', frequency: '', duration: '', notes: '' },
    ]);
  };

  // Add new service
  const handleAddService = () => {
    setServices([
      ...services,
      { id: Date.now(), name: '', description: '', result: '' },
    ]);
  };

  // Handle medication input change
  const handleMedicationChange = (index, e) => {
    if (role === 'nurse') return;
    const newMedications = [...medications];
    newMedications[index][e.target.name] = e.target.value;

    // Suggestions from controller data
    if (e.target.name === 'name') {
      setMedSuggestions(
        medicineNames.filter((m) =>
          m.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }

    setMedications(newMedications);
  };

  // Handle service input change
  const handleServiceChange = (index, e) => {
    const newServices = [...services];
    const { name, value } = e.target;

    if (role === 'nurse' && name !== 'result') return;

    newServices[index][name] = value;

    if (name === 'name') {
      setServiceSuggestions(
        serviceNames.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    setServices(newServices);
  };

  const handleSelectMedication = (index, name) => {
    const newMedications = [...medications];
    newMedications[index].name = name;
    setMedications(newMedications);
    setMedSuggestions([]);
  };

  const handleSelectService = (index, name) => {
    const newServices = [...services];
    newServices[index].name = name;
    setServices(newServices);
    setServiceSuggestions([]);
  };

  // Remove medication/service
  const handleRemoveMedication = (id) => {
    if (role === 'nurse') return;
    setMedications(medications.filter((med) => med.id !== id));
  };
  const handleRemoveService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  // Submit form with validation
  const handleSubmit = () => {
    // Check medications
    for (let i = 0; i < medications.length; i++) {
      const med = medications[i];
      if (!med.name || !med.dosage || !med.frequency || !med.duration) {
        alert(`Please fill out all fields for medication #${i + 1}`);
        return;
      }
    }

    // Check services
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      if (!service.name || !service.description) {
        alert(`Please fill out all fields for service #${i + 1}`);
        return;
      }
    }

    // All validations passed, submit form
    post(route('physician.appointments.store', appointment.id), {
      notes,
      medications,
      services,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const isEditable = (field) => {
    if (role === 'nurse') {
      if (field === 'notes' || field === 'medications') return false;
      if (field === 'services') return true;
    }
    return true;
  };

  return (
    <div className="p-8 bg-white min-h-screen text-gray-900">
      <div className="max-w-5xl mx-auto bg-gray-100 shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">
          Appointment Details for {appointment.patient.first_name} {appointment.patient.last_name}
        </h1>

        {/* Notes */}
        <div className="space-y-6 mb-6">
          <div className="text-lg font-semibold text-gray-700">Appointment Notes</div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            disabled={!isEditable('notes')}
            autoComplete="off"
            className={`w-full p-4 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
              ${!isEditable('notes') ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter any additional notes here..."
          />
        </div>

        {/* Medications */}
        <div className="space-y-6 mb-6">
          <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
            <span>Medications</span>
          </div>
          {medications.map((med, index) => (
            <div key={med.id} className="bg-white p-6 rounded-lg shadow mb-4 space-y-4 border border-gray-300 relative">
              <input
                type="text"
                name="name"
                value={med.name}
                onChange={(e) => handleMedicationChange(index, e)}
                placeholder="Medication Name"
                disabled={!isEditable('medications')}
                autoComplete="off"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
                  ${!isEditable('medications') ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {medSuggestions.length > 0 && med.name && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-y-auto z-10 rounded-lg shadow">
                  {medSuggestions.map((m, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectMedication(index, m)}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Dosage"
                  disabled={!isEditable('medications')}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Frequency"
                  disabled={!isEditable('medications')}
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="text"
                name="duration"
                value={med.duration}
                onChange={(e) => handleMedicationChange(index, e)}
                placeholder="Duration"
                disabled={!isEditable('medications')}
                autoComplete="off"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <textarea
                name="notes"
                value={med.notes}
                onChange={(e) => handleMedicationChange(index, e)}
                placeholder="Additional Notes"
                disabled={!isEditable('medications')}
                autoComplete="off"
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
              {isEditable('medications') && (
                <button
                  onClick={() => handleRemoveMedication(med.id)}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Remove Medication
                </button>
              )}
            </div>
          ))}
          {isEditable('medications') && (
            <button
              type="button"
              onClick={handleAddMedication}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              Add Medication
            </button>
          )}
        </div>

        {/* Services */}
        <div className="space-y-6 mb-6">
          <div className="text-lg font-semibold text-gray-700">Services</div>
          {services.map((service, index) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow mb-4 space-y-4 border border-gray-300 relative">
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Service Name"
                disabled={role === 'nurse'}
                autoComplete="off"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
                  ${role === 'nurse' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {serviceSuggestions.length > 0 && service.name && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-y-auto z-10 rounded-lg shadow">
                  {serviceSuggestions.map((s, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectService(index, s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              <textarea
                name="description"
                value={service.description}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Service Description"
                disabled={role === 'nurse'}
                autoComplete="off"
                className={`w-full p-4 border border-gray-300 rounded-lg ${role === 'nurse' ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <textarea
                name="result"
                value={service.result}
                onChange={(e) => handleServiceChange(index, e)}
                placeholder="Result"
                autoComplete="off"
                className="w-full p-4 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => handleRemoveService(service.id)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-200"
              >
                Remove Service
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddService}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Add Service
          </button>
        </div>

        {/* Submit */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={processing}
            className={`px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
