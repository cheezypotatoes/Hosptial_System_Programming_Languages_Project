// Centralized API calls

export const fetchPatients = async (query = "") => {
  const url = query
    ? `http://localhost:8000/cashier/patients?q=${query}`
    : `http://localhost:8000/cashier/patients`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch patients");
  return res.json();
};

export const fetchServicesAndItems = async () => {
  const res = await fetch("http://localhost:8000/cashier/services-items");
  if (!res.ok) throw new Error("Failed to fetch services and items");
  return res.json();
};

export const fetchPendingPayments = async () => {
  const res = await fetch("http://localhost:8000/pending-payments");
  if (!res.ok) throw new Error("Failed to fetch pending payments");
  return res.json();
};

export const fetchTransactions = async (patientId = null) => {
  const url = patientId
    ? `http://localhost:8000/transactions?patient_id=${patientId}`
    : `http://localhost:8000/transactions`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};
