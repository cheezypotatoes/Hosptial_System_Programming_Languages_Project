import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useForm, router, usePage } from "@inertiajs/react";

export default function MedicineInventoryAdd({
  user = {},
  role = "",
  medicines = [],
  services = [],
  items = [],
}) {
  const { flash } = usePage().props;
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("medicine");

  const { data, setData, post, reset, processing } = useForm({
    name: "",
    stock: "",
    expiry: "",
    price: "",
    description: "",
    stock_quantity: "",
    category_id: "",
  });

  const activeLabel = "Medicine Inventory";

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      router.post(route("logout"));
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    let routeName = "";

    if (modalType === "medicine") routeName = "medicine.add.store";
    else if (modalType === "service") routeName = "service.add.store";
    else if (modalType === "item") routeName = "item.add.store";

    post(route(routeName), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setShowModal(false);
      },
      onError: (errors) => {
        console.error("Error adding:", errors);
      },
    });
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Inventory & Services</h1>
        <h1 className="text-3xl font-bold mb-6 text-[#1E40AF]">
          Welcome, {user.email || "Guest"}!
        </h1>
        <p className="text-gray-600 mb-4">Manage medicines, services, and items</p>

        {flash?.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {flash.error}
          </div>
        )}

        {/* Search & Add */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={() => {
              setShowModal(true);
              setModalType("medicine");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        {/* === Medicines Table === */}
        <h2 className="text-xl font-semibold mb-2">Medicines</h2>
        <table className="w-full border-collapse border bg-white shadow rounded mb-6">
          <thead>
            <tr className="bg-gray-200">
              {["Medicine Name", "Stock", "Expiry Date", "Status"].map((h) => (
                <th key={h} className="border px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(medicines || [])
              .filter((m) => m.name?.toLowerCase().includes(search.toLowerCase()))
              .map((m, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{m.name}</td>
                  <td className="border px-4 py-2">{m.stock}</td>
                  <td className="border px-4 py-2">{m.expiry}</td>
                  <td
                    className={`border px-4 py-2 ${
                      m.stock < 20 ? "text-red-600 font-semibold" : "text-green-600"
                    }`}
                  >
                    {m.stock < 20 ? "Low stock" : "In stock"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* === Services Table === */}
        <h2 className="text-xl font-semibold mb-2">Available Services</h2>
        <table className="w-full border-collapse border bg-white shadow rounded mb-6">
          <thead>
            <tr className="bg-gray-200">
              {["Service Name", "Price"].map((h) => (
                <th key={h} className="border px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(services || [])
              .filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()))
              .map((s, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{s.name}</td>
                  <td className="border px-4 py-2">₱{s.price}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* === Items Table === */}
        <h2 className="text-xl font-semibold mb-2">Other Items</h2>
        <table className="w-full border-collapse border bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              {["Item Name", "Stock", "Price"].map((h) => (
                <th key={h} className="border px-4 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(items || [])
              .filter((it) => it.name?.toLowerCase().includes(search.toLowerCase()))
              .map((it, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{it.name}</td>
                  <td className="border px-4 py-2">{it.stock}</td>
                  <td className="border px-4 py-2">₱{it.price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>

      {/* === Add Modal === */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
            <h2 className="text-lg font-semibold mb-4">
              Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>

            {/* Toggle Type Buttons */}
            <div className="flex gap-2 mb-4">
              {["medicine", "service", "item"].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded ${
                    modalType === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setModalType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* === FORM === */}
            <form onSubmit={handleAddItem} className="space-y-3">
              {/* Common Name */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {modalType === "medicine"
                    ? "Medicine Name"
                    : modalType === "service"
                    ? "Service Name"
                    : "Item Name"}
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              {/* Medicine Fields */}
              {modalType === "medicine" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock</label>
                    <input
                      type="number"
                      value={data.stock}
                      onChange={(e) => setData("stock", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={data.expiry}
                      onChange={(e) => setData("expiry", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </>
              )}

              {/* Service Fields */}
              {modalType === "service" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Price (₱)</label>
                  <input
                    type="number"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              )}

              {/* Item Fields */}
              {modalType === "item" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={data.stock_quantity}
                      onChange={(e) => setData("stock_quantity", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Price (₱)</label>
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) => setData("price", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {processing ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
