// resources/js/api/cashierApi.js

// Fetch merged services + medicines
export async function fetchServicesAndItems() {
  const res = await fetch("/cashier/services-items");
  if (!res.ok) throw new Error("Failed to fetch services and items");
  return await res.json();
}

// Search patients
export async function searchPatients(query) {
  const res = await fetch(`/cashier/search-patients?q=${query}`);
  if (!res.ok) throw new Error("Failed to search patients");
  return await res.json();
}

// Fetch recent transactions
export async function fetchTransactions() {
  const res = await fetch("/cashier/transactions");
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return await res.json();
}

// Generate bill
export async function generateBill(data) {
  const res = await fetch("/cashier/generate-bill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate bill");
  return await res.json();
}

// Record payment
export async function recordPayment(data) {
  const res = await fetch("/cashier/record-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to record payment");
  return await res.json();
}
