import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { router, useForm } from "@inertiajs/react";

export default function Dispensing({ role, user }) {
  const { post } = useForm();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("All"); // ✅ date filter
  const printRef = useRef();

  const activeLabel = "Dispensing";

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) post(route("logout"));
  }

  useEffect(() => {
    axios
      .get("/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const matches = patients.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(matches);
  };

  const fetchPatientData = (found) => {
    axios
      .get(`/patients/${found.id}/prescriptions`)
      .then((res) => {
        axios
          .get(`/patients/${found.id}/medical-conditions`)
          .then((condRes) => {
            setSelectedPatient({
              ...found,
              prescriptions: res.data,
              medical_conditions: condRes.data,
            });
            setSuggestions([]);
            setSelectedDate("All"); // reset filter on new search
          })
          .catch(() => {
            setSelectedPatient({ ...found, prescriptions: res.data, medical_conditions: [] });
            setSuggestions([]);
          });
      })
      .catch(() => {
        setSelectedPatient(found);
        setSuggestions([]);
      });
  };

  const handleSearch = () => {
    const found = patients.find((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    if (found) {
      fetchPatientData(found);
    } else {
      setSelectedPatient(null);
    }
  };

  const handlePrint = () => {
    const logoPath = "/images/New_Logo.png";
    const companyName = "Jorge & Co Medical Center";
    const companyAddress = "University of Mindanao, Matina Davao City";

    const nurseName = user ? `${user.first_name} ${user.last_name}` : "N/A";
    const currentDate = new Date().toLocaleString();

    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=900,height=650");

    printWindow.document.write(`
      <html>
        <head>
          <title>Patient Record</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2, h3 { margin-top: 2px; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table, th, td { border: 1px solid #333; }
            th, td { padding: 8px; text-align: left; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 160px; display: block; margin: 0 auto 5px; }
            .footer { margin-top: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoPath}" alt="Company Logo">
            <h2>${companyName}</h2>
            <p>${companyAddress}</p>
          </div>
          <div class="footer">
            <p><strong>Nurse:</strong> ${nurseName}</p>
            <p><strong>Date:</strong> ${currentDate}</p>
          </div>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // ✅ Get all unique dates from prescriptions + symptoms
  const allDates = selectedPatient
    ? Array.from(
        new Set([
          ...(selectedPatient.prescriptions?.map((p) => p.date_prescribed) || []),
          ...(selectedPatient.medical_conditions?.map((c) => c.date) || []),
        ])
      )
    : [];

  // ✅ Apply filter to both prescriptions and symptoms
  const filteredPrescriptions =
    selectedDate === "All"
      ? selectedPatient?.prescriptions || []
      : selectedPatient?.prescriptions?.filter((p) => p.date_prescribed === selectedDate) || [];

  const filteredConditions =
    selectedDate === "All"
      ? selectedPatient?.medical_conditions || []
      : selectedPatient?.medical_conditions?.filter((c) => c.date === selectedDate) || [];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between bg-white p-4 shadow relative">
          <div className="flex items-center gap-2 w-full max-w-lg">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full border rounded px-3 py-2"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                  {suggestions.map((p) => (
                    <li
                      key={p.id}
                      onClick={() => {
                        setSearch(`${p.first_name} ${p.last_name}`);
                        fetchPatientData(p);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                    >
                      {p.first_name} {p.last_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>

        <div className="p-6">
          {selectedPatient ? (
            <>
              {/* ✅ Print + Date Filter */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  🖨️ Print Patient Data
                </button>

                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="All">All Dates</option>
                  {allDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div ref={printRef}>
                <h2 className="text-lg font-bold mb-4">Patient Info:</h2>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </p>
                <p>
                  <span className="font-semibold">Birthdate:</span>{" "}
                  {selectedPatient.birthdate}
                </p>

                {/* ✅ Filtered Symptoms */}
                <h3 className="mt-4 text-md font-bold">Symptoms History:</h3>
                {filteredConditions.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {filteredConditions.map((cond, i) => (
                      <li key={`${cond.symptom}-${cond.date}-${i}`}>
                        <strong>{cond.symptom}</strong> — {cond.date}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No symptoms history found for this date.</p>
                )}

                {/* ✅ Filtered Prescriptions */}
                <h3 className="mt-4 text-md font-bold">Prescriptions:</h3>
                {filteredPrescriptions.length > 0 ? (
                  <table className="w-full border border-gray-300 bg-gray-100 rounded">
                    <thead>
                      <tr className="bg-gray-300 text-left">
                        <th className="p-2 border">Medication</th>
                        <th className="p-2 border">Dosage</th>
                        <th className="p-2 border">Instructions</th>
                        <th className="p-2 border">Doctor</th>
                        <th className="p-2 border">Date Prescribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrescriptions.map((pres, index) => (
                        <tr key={index}>
                          <td className="p-2 border">{pres.medication}</td>
                          <td className="p-2 border">{pres.dosage}</td>
                          <td className="p-2 border">{pres.instructions}</td>
                          <td className="p-2 border">{pres.doctor_name}</td>
                          <td className="p-2 border">{pres.date_prescribed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No prescriptions found for this date.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">🔍 Search for a patient to view their medical records.</p>
          )}
        </div>
      </div>
    </div>
  );
}
