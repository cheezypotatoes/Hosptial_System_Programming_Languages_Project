import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";

export default function MedicineInventory() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [medicineList, setMedicineList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [itemList, setItemList] = useState([]); // ✅ new items table
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("medicine"); // medicine / service / item

  const [newItem, setNewItem] = useState({
    name: "",
    stock: "",
    expiry: "",
    price: "",
  });

  const activeLabel = "Medicine Inventory";

  // Fetch all data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/medicine/data", {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setRole(response.data.role);

        // Medicines
        setMedicineList(
          response.data.medicines.map((med) => ({
            name: med.name,
            stock: med.stock,
            expiry: med.expiry,
            status: med.stock < 20 ? "Low stock" : "In stock",
          }))
        );

        // Services
        setServiceList(response.data.services);

        // Items
        setItemList(response.data.items || []); // assuming API returns items array
      }
    } catch (error) {
      console.error("❌ Failed to fetch data:", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        modalType === "medicine"
          ? "http://localhost:8000/medicine/store"
          : modalType === "service"
          ? "http://localhost:8000/service/store"
          : "http://localhost:8000/item/store"; // new items endpoint

      const response = await axios.post(endpoint, newItem);

      if (response.data.success) {
        alert(
          `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} added successfully!`
        );
        setShowModal(false);
        setNewItem({ name: "", stock: "", expiry: "", price: "" });

        // Refresh appropriate list
        if (modalType === "medicine") fetchData();
        else if (modalType === "service") fetchData();
        else fetchData(); // for items
      }
    } catch (error) {
      console.error(`❌ Failed to add ${modalType}:`, error);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      post(route("logout"));
    }
  };

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Inventory & Services</h1>
        <h1 className="text-3xl font-bold mb-6 text-[#1E40AF]">
          Welcome, {user ? `${user.first_name} ${user.last_name}` : "Guest"}!
        </h1>
        <p className="text-gray-600 mb-4">Manage medicines, services, and items</p>

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

        {/* Medicines Table */}
        <h2 className="text-xl font-semibold mb-2">Medicines</h2>
        <table className="w-full border-collapse border bg-white shadow rounded mb-6">
          <thead>
            <tr className="bg-gray-200">
              {["Medicine Name", "Stock", "Expiry Date", "Status"].map((header) => (
                <th key={header} className="border px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {medicineList
              .filter((med) => med.name.toLowerCase().includes(search.toLowerCase()))
              .map((med, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{med.name}</td>
                  <td className="border px-4 py-2">{med.stock}</td>
                  <td className="border px-4 py-2">{med.expiry}</td>
                  <td
                    className={`border px-4 py-2 ${
                      med.status === "Low stock" ? "text-red-600 font-semibold" : "text-green-600"
                    }`}
                  >
                    {med.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Services Table */}
        <h2 className="text-xl font-semibold mb-2">Available Services</h2>
        <table className="w-full border-collapse border bg-white shadow rounded mb-6">
          <thead>
            <tr className="bg-gray-200">
              {["Service Name", "Price"].map((header) => (
                <th key={header} className="border px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {serviceList
              .filter((srv) => srv.name.toLowerCase().includes(search.toLowerCase()))
              .map((srv, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{srv.name}</td>
                  <td className="border px-4 py-2">₱{srv.price}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Items Table */}
        <h2 className="text-xl font-semibold mb-2">Other Items</h2>
        <table className="w-full border-collapse border bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              {["Item Name", "Stock", "Price"].map((header) => (
                <th key={header} className="border px-4 py-2 text-left">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itemList
              .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.stock}</td>
                  <td className="border px-4 py-2">₱{item.price}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
            <h2 className="text-lg font-semibold mb-4">
              Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              {["medicine", "service", "item"].map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded ${
                    modalType === type ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setModalType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              {/* Name Field */}
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
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder={`Enter ${modalType} name`}
                  required
                />
              </div>

              {/* Medicine-specific fields */}
              {modalType === "medicine" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter number of available stocks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={newItem.expiry}
                      onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </>
              )}

              {/* Service-specific fields */}
              {modalType === "service" && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Price (₱)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter price in pesos"
                  />
                </div>
              )}

             {/* Item-specific fields */}
              {modalType === "item" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={newItem.stock_quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, stock_quantity: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter stock quantity"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Total count of this item in the inventory.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Price (₱)</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Enter price in pesos"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Price per unit of this item.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      placeholder="Optional: Add a description"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional description for this item.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <input
                      type="text"
                      value={newItem.category || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      placeholder="Optional: Enter category name"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional category for this item.
                    </p>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
