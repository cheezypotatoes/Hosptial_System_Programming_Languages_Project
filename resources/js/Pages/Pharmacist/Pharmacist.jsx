import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";

export default function Pharmacist({ user: initialUser, role: initialRole }) {
  const [user] = useState(initialUser); // user comes from Inertia props
  const [role] = useState(initialRole);
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const activeLabel = "Pharmacist Dashboard";

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "/pharmacist/prescriptions",
        { withCredentials: true }
      );
      if (response.data.success) {
        setPrescriptions(response.data.prescriptions);
      }
    } catch (error) {
      console.error("❌ Failed to load prescriptions. Check server logs.", error);
      alert("Failed to load prescriptions. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (id) => {
    if (!window.confirm("Mark this prescription as dispensed?")) return;

    try {
      const response = await axios.post(
        `/pharmacist/dispense/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("✅ Prescription dispensed successfully!");
        fetchPrescriptions();
      }
    } catch (error) {
      console.error("❌ Failed to dispense prescription:", error);
      alert("Failed to dispense prescription.");
    }
  };

  const handleDispenseAll = async (patientName) => {
    if (!window.confirm(`Dispense all pending prescriptions for ${patientName}?`))
      return;

    try {
      const pending = prescriptions.filter(
        (p) => p.patient_name === patientName && (p.status ?? "pending") === "pending"
      );

      for (const pres of pending) {
        await axios.post(`/pharmacist/dispense/${pres.id}`, {}, { withCredentials: true });
      }

      alert(`✅ All pending prescriptions for ${patientName} dispensed!`);
      fetchPrescriptions();
    } catch (error) {
      console.error("❌ Failed to dispense prescriptions:", error);
      alert("Failed to dispense prescriptions.");
    }
  };

  // Group prescriptions by patient
  const groupedByPatient = prescriptions.reduce((acc, pres) => {
    acc[pres.patient_name] = acc[pres.patient_name] || [];
    acc[pres.patient_name].push(pres);
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#1E40AF]">Pharmacist Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome, {user ? `${user.first_name} ${user.last_name}` : "Pharmacist"}!
          Review and dispense prescribed medicines.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by patient name or medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={fetchPrescriptions}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                {["Patient Name", "Medicine", "Dosage", "Prescribed By", "Status", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="border px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading prescriptions...
                  </td>
                </tr>
              ) : search ? (
                Object.entries(groupedByPatient)
                  .filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
                  .map(([patientName, presList]) => (
                    <React.Fragment key={patientName}>
                      {presList.map((pres, i) => (
                        <tr key={pres.id} className="odd:bg-white even:bg-gray-50">
                          {i === 0 && (
                            <td rowSpan={presList.length} className="border px-4 py-2 font-semibold">
                              {patientName}
                            </td>
                          )}
                          <td className="border px-4 py-2">{pres.medicine_name}</td>
                          <td className="border px-4 py-2">{pres.dosage}</td>
                          <td className="border px-4 py-2">{pres.doctor_name}</td>
                          <td
                            className={`border px-4 py-2 font-semibold ${
                              pres.status === "dispensed" ? "text-green-600" : "text-yellow-600"
                            }`}
                          >
                            {pres.status.charAt(0).toUpperCase() + pres.status.slice(1)}
                          </td>
                          {i === 0 && (
                            <td rowSpan={presList.length} className="border px-4 py-2">
                              {presList.some((p) => p.status === "pending") ? (
                                <button
                                  onClick={() => handleDispenseAll(patientName)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                >
                                  Dispense All
                                </button>
                              ) : (
                                <button
                                  disabled
                                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm cursor-not-allowed"
                                >
                                  Dispensed
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))
              ) : (
                prescriptions.map((pres) => (
                  <tr key={pres.id} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-4 py-2">{pres.patient_name}</td>
                    <td className="border px-4 py-2">{pres.medicine_name}</td>
                    <td className="border px-4 py-2">{pres.dosage}</td>
                    <td className="border px-4 py-2">{pres.doctor_name}</td>
                    <td
                      className={`border px-4 py-2 font-semibold ${
                        pres.status === "dispensed" ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {pres.status.charAt(0).toUpperCase() + pres.status.slice(1)}
                    </td>
                    <td className="border px-4 py-2">
                      {pres.status === "pending" ? (
                        <button
                          onClick={() => handleDispense(pres.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Dispense
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm cursor-not-allowed"
                        >
                          Dispensed
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
