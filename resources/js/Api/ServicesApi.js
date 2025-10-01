export async function fetchServicesAndItems() {
  try {
    const res = await fetch("http://localhost:8000/cashier/services-items");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();

    // Ensure it returns an array
    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Error fetching services/items:", err);
    return [];
  }
}

export async function fetchPatients() {
  try {
    const res = await fetch("http://localhost:8000/cashier/patients");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();

    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Error fetching patients:", err);
    return [];
  }
}

export async function fetchPendingPayments() {
  try {
    const res = await fetch("http://localhost:8000/pending-payments");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();

    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    return [];
  }
}

export async function fetchTransactions() {
  try {
    const res = await fetch("http://localhost:8000/transactions");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();

    return Array.isArray(data) ? data : data.data || [];
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return [];
  }
}
