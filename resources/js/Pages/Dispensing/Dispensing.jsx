import React from "react";
import Sidebar from "../../Components/Sidebar";
import { useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function Dispensing({ role, user, patients = [] }) {
  const { post, processing } = useForm();
  const activeLabel = "Dispensing";

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) post(route("logout"));
    });
  };

  const handlePatientClick = (id) => {
    Inertia.get(route("dispensing.patients.show", id), {}, {
      onSuccess: ({ props }) => {
        const { patient, dispense_logs } = props;
        showPatientModal(patient, dispense_logs);
      },
      onError: () => {
        Swal.fire("Error", "Failed to load patient details.", "error");
      },
    });
  };


  const handleDispense = async (patient, prescriptions) => {
    if (!prescriptions.length) {
      Swal.fire("No Prescriptions", "This patient has no prescriptions to dispense.", "info");
      return;
    }

    const options = prescriptions
      .map(
        (p) =>
          `<option value="${p.id}" data-name="${p.medication}" data-dosage="${p.dosage}">
             ${p.medication} — ${p.dosage} (${p.doctor_name})
           </option>`
      )
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Dispense Medicine",
      html: `
        <select id="medicineSelect" class="swal2-input" style="width:90%">
          <option value="">Select Prescribed Medicine</option>
          ${options}
        </select>
        <input id="quantityInput" type="number" class="swal2-input" placeholder="Quantity" style="width:90%">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: processing ? "Processing..." : "Dispense",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const select = document.getElementById("medicineSelect");
        const medicine_id = select.value;
        const medicine_name = select.selectedOptions[0]?.getAttribute("data-name");
        const dosage = select.selectedOptions[0]?.getAttribute("data-dosage");
        const quantity = document.getElementById("quantityInput").value;

        if (!medicine_id || !quantity) {
          Swal.showValidationMessage("Please select a medicine and enter quantity.");
          return false;
        }

        return { medicine_id, medicine_name, dosage, quantity };
      },
    });

    if (!formValues) return;

    post(route("medicine.dispense"), {
      patient_id: patient.id,
      medication_id: formValues.medicine_id,
      quantity: parseInt(formValues.quantity),
      onSuccess: () => {
        Swal.fire({
          icon: "success",
          title: "Medicine Dispensed",
          text: `${formValues.medicine_name} (${formValues.dosage}) x ${formValues.quantity} successfully dispensed!`,
          confirmButtonText: "OK",
        }).then(() => {

          Inertia.reload();
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: "error",
          title: "Failed to Dispense",
          text: "Check console for more details.",
        });
        console.error("Dispense errors:", errors);
      },
    });
  };


  const showPatientModal = (patient, dispenseLogs) => {
    const prescriptions = patient.prescriptions || [];
    const conditions = patient.medicalConditions || [];

    const condHTML =
      conditions.length > 0
        ? `<ul style="margin-top:8px;padding-left:20px">
            ${conditions.map((c) => `<li><b>${c.symptom || c.condition_name || "Condition"}</b></li>`).join("")}
          </ul>`
        : `<p>No recorded symptoms.</p>`;

    const prescHTML =
      prescriptions.length > 0
        ? `
        <table style="width:100%;border-collapse:collapse;text-align:left;margin-top:8px">
          <thead>
            <tr style="background:#ddd">
              <th style="border:1px solid #ccc;padding:5px">Medicine</th>
              <th style="border:1px solid #ccc;padding:5px">Dosage</th>
              <th style="border:1px solid #ccc;padding:5px">Instructions</th>
              <th style="border:1px solid #ccc;padding:5px">Doctor</th>
            </tr>
          </thead>
          <tbody>
            ${prescriptions.map(
              (pr) => `
              <tr>
                <td style="border:1px solid #ccc;padding:5px">${pr.medication}</td>
                <td style="border:1px solid #ccc;padding:5px">${pr.dosage}</td>
                <td style="border:1px solid #ccc;padding:5px">${pr.instructions}</td>
                <td style="border:1px solid #ccc;padding:5px">${pr.doctor_name}</td>
              </tr>`
            ).join("")}
          </tbody>
        </table>`
        : `<p>No prescriptions found.</p>`;

    const dispenseHTML =
      dispenseLogs.length > 0
        ? `
        <table style="width:100%;border-collapse:collapse;text-align:left;margin-top:8px">
          <thead>
            <tr style="background:#ddd">
              <th style="border:1px solid #ccc;padding:5px">Medicine</th>
              <th style="border:1px solid #ccc;padding:5px">Quantity</th>
              <th style="border:1px solid #ccc;padding:5px">Date Dispensed</th>
            </tr>
          </thead>
          <tbody>
            ${dispenseLogs.map(
              (d) => `
              <tr>
                <td style="border:1px solid #ccc;padding:5px">${d.medicine_name || "N/A"}</td>
                <td style="border:1px solid #ccc;padding:5px">${d.quantity}</td>
                <td style="border:1px solid #ccc;padding:5px">${d.dispensed_at}</td>
              </tr>`
            ).join("")}
          </tbody>
        </table>`
        : `<p>No dispensing records yet.</p>`;

    Swal.fire({
      title: `${patient.first_name} ${patient.last_name}`,
      html: `
        <p><b>Birthdate:</b> ${patient.birthdate}</p>
        <p><b>Gender:</b> ${patient.gender}</p>
        <p><b>Contact:</b> ${patient.contact_num}</p>
        <p><b>Address:</b> ${patient.address}</p>
        <hr style="margin:10px 0"/>
        <h3>Symptoms History:</h3>
        ${condHTML}
        <hr style="margin:10px 0"/>
        <h3>Prescriptions:</h3>
        ${prescHTML}
        <hr style="margin:10px 0"/>
        <h3>Dispensing History:</h3>
        ${dispenseHTML}
      `,
      width: 800,
      confirmButtonText: "Close",
      showCancelButton: true,
      cancelButtonText: " Dispense Medicine",
      didOpen: () => {
        const cancelBtn = Swal.getCancelButton();
        if (cancelBtn)
          cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            handleDispense(patient, prescriptions);
          });
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Dispensing Records</h1>
        {patients.length === 0 ? (
          <p className="text-gray-500">No patients found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => handlePatientClick(p.id)}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition"
              >
                <h2 className="text-lg font-bold">{p.first_name} {p.last_name}</h2>
                <p className="text-sm text-gray-600">Birthdate: {p.birthdate}</p>
                <p className="text-sm text-gray-600">Gender: {p.gender}</p>
                <p className="text-sm text-gray-600">Contact: {p.contact_num}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
