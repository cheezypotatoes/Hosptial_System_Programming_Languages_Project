import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { router } from "@inertiajs/react";


export default function Dispensing({ role, user}) {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const printRef = useRef(); 

  const activeLabel = "Dispensing";

  function handleLogout(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      router.post(route("logout"));
    }
  }


  // 🔹 Fetch all patients
  useEffect(() => {
    axios
      .get("/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("Error fetching patients:", err));
  }, []);

  // 🔹 Handle typing search
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

  // 🔹 Search button (manual)
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

  // 🔹 Print function
const handlePrint = () => {
  const logoPath = "/images/New_Logo.png";
  const companyName = "Jorge & Co Medical Center";
    const companyAddress = "University of Mindanao, Matina Davao City";

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
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoPath}" alt="Company Logo">
          <h2>${companyName}</h2>
          <p>${companyAddress}</p>
        </div>
        ${content}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};


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

        {/* 🔹 Patient info + results */}
        <div className="p-6">
          {selectedPatient ? (
            <>
              {/* Print button */}
              <button
                onClick={handlePrint}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                🖨️ Print Patient Data
              </button>

              {/* Content to print */}
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

                <h3 className="mt-4 text-md font-bold">Medical Conditions:</h3>
                {selectedPatient.medical_conditions?.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {selectedPatient.medical_conditions.map((cond, i) => (
                      <li key={i}>
                        {cond.condition_name} ({cond.status}) - {cond.notes}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No medical conditions found.</p>
                )}

              <h3 className="mt-4 text-md font-bold">Prescriptions:</h3>
                  {selectedPatient.prescriptions?.length > 0 ? (
                    <table className="w-full border border-gray-300 bg-gray-100 rounded">
                      <thead>
                        <tr className="bg-gray-300 text-left">
                          <th className="p-2 border">Medication</th>
                          <th className="p-2 border">Dosage</th>
                          <th className="p-2 border">Instructions</th>
                          <th className="p-2 border">Doctor</th> 
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPatient.prescriptions.map((pres, index) => (
                          <tr key={index}>
                            <td className="p-2 border">{pres.medication}</td>
                            <td className="p-2 border">{pres.dosage}</td>
                            <td className="p-2 border">{pres.instructions}</td>
                            <td className="p-2 border">{pres.doctor_name}</td> 
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500">No prescriptions found.</p>
                  )}

              </div>
            </>
          ) : (
            <p className="text-gray-500">
              🔍 Search for a patient to view their medical records.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
