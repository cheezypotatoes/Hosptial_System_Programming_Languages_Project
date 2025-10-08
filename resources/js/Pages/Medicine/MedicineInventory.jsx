import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import { useForm, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function MedicineInventoryAdd() {
  const { flash, user, role, medicines, services, items, categories } = usePage().props;

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("medicine");

  const { data, setData, post, processing, reset } = useForm({
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

  // Determine backend route
  let routeName = "";
  if (modalType === "medicine") routeName = route("medicine.store");
  else if (modalType === "service") routeName = route("service.store");
  else if (modalType === "item") routeName = route("item.store");

  Swal.fire({
    title: `Adding ${modalType}...`,
    text: "Hang tight! We're saving your record 😊",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

  // Prepare payload
  const payload = { ...data };

  // Cast numeric fields and adjust for items
  if (modalType === "medicine") {
    payload.stock = Number(payload.stock);
    payload.price = Number(payload.price);
  } else if (modalType === "service") {
    payload.price = Number(payload.price);
    payload.category_id = payload.category_id ? Number(payload.category_id) : null;
  } else if (modalType === "item") {
    payload.stock = Number(payload.stock_quantity); // backend expects 'stock'
    delete payload.stock_quantity;
    payload.price = Number(payload.price);
  }

  post(routeName, {
    data: payload,
    preserveScroll: true,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: `${modalType.charAt(0).toUpperCase() + modalType.slice(1)} Added! 🎉`,
        text: "Your new record has been successfully saved.",
        timer: 1800,
        showConfirmButton: false,
      });

      reset();             // clear form
      setShowModal(false); // close modal

      // Reload Inertia props without full page reload
      setTimeout(() => router.reload(), 1800);
    },
    onError: (errors) => {
      console.error(errors);
      Swal.fire({
        icon: "error",
        title: "Oops 😞",
        text: "Please check your input and try again.",
      });
    },
  });
};



  const filterData = (list) =>
    list.filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-[#E6F0FA] font-sans text-[#1E3A8A]">
      <Sidebar role={role} activeLabel={activeLabel} handleLogout={handleLogout} />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2">Inventory & Services</h1>
        <h1 className="text-3xl font-bold mb-6 text-[#1E40AF]">
          Welcome, {user?.first_name || "Guest"}!
        </h1>

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
            + Add
          </button>
        </div>

    {/* Medicines Table */}
<h2 className="text-xl font-semibold mb-2">Medicines</h2>
<table className="w-full border-collapse border bg-white shadow rounded mb-6">
  <thead>
    <tr className="bg-gray-200">
      <th className="border px-4 py-2">Medicine Name</th>
      <th className="border px-4 py-2">Stock</th>
      <th className="border px-4 py-2">Expiry Date</th>
      <th className="border px-4 py-2">Status</th>
  
    </tr>
  </thead>
  <tbody>
    {filterData(medicines).length > 0 ? (
      filterData(medicines).map((m, i) => (
        <tr key={i} className="odd:bg-white even:bg-gray-50">
          <td className="border px-4 py-2">{m.name}</td>
          <td className="border px-4 py-2">{m.stock}</td>
          <td className="border px-4 py-2">{m.expiry}</td>
          <td className={`border px-4 py-2 ${m.stock < 20 ? "text-red-600 font-semibold" : "text-green-600"}`}>
            {m.stock < 20 ? "Low stock" : "In stock"}
          </td>
          
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center py-4 text-gray-500">No medicines available.</td>
      </tr>
    )}
  </tbody>
</table>

{/* Services Table */}
<h2 className="text-xl font-semibold mb-2">Services</h2>
<table className="w-full border-collapse border bg-white shadow rounded mb-6">
  <thead>
    <tr className="bg-gray-200">
      <th className="border px-4 py-2">Service Name</th>
      <th className="border px-4 py-2">Category</th>
      <th className="border px-4 py-2">Price</th>
      <th className="border px-4 py-2">Description</th>
    </tr>
  </thead>
  <tbody>
    {filterData(services).length > 0 ? (
      filterData(services).map((s, i) => (
        <tr key={i} className="odd:bg-white even:bg-gray-50">
          <td className="border px-4 py-2">{s.name}</td>
          <td className="border px-4 py-2">{s.category?.name || s.category || "-"}</td>
          <td className="border px-4 py-2">₱{s.price}</td>
          <td className="border px-4 py-2">{s.description || "-"}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" className="text-center py-4 text-gray-500">No services available.</td>
      </tr>
    )}
  </tbody>
</table>

{/* Items Table */}
<h2 className="text-xl font-semibold mb-2">Items</h2>
<table className="w-full border-collapse border bg-white shadow rounded">
  <thead>
    <tr className="bg-gray-200">
      <th className="border px-4 py-2">Item Name</th>
      <th className="border px-4 py-2">Category</th>
      <th className="border px-4 py-2">Stock</th>
      <th className="border px-4 py-2">Price</th>
      <th className="border px-4 py-2">Description</th>
    </tr>
  </thead>
  <tbody>
    {filterData(items).length > 0 ? (
      filterData(items).map((it, i) => (
        <tr key={i} className="odd:bg-white even:bg-gray-50">
          <td className="border px-4 py-2">{it.name}</td>
          <td className="border px-4 py-2">{it.category?.name || it.category || "-"}</td>
          <td className="border px-4 py-2">{it.stock}</td>
          <td className="border px-4 py-2">₱{it.price}</td>
          <td className="border px-4 py-2">{it.description || "-"}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5" className="text-center py-4 text-gray-500">No items available.</td>
      </tr>
    )}
  </tbody>
</table>


        {/* === Modal === */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
      <h2 className="text-lg font-semibold mb-4">
        Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
      </h2>

      {/* Type Switch Buttons */}
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

      <form onSubmit={handleAddItem} className="space-y-3">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* === Service Fields === */}
        {modalType === "service" && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Category
              </label>
              <select
                value={data.category_id}
                onChange={(e) => setData("category_id", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Price (₱)
              </label>
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

        {/* === Medicine Fields === */}
        {modalType === "medicine" && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Stock
              </label>
              <input
                type="number"
                value={data.stock}
                onChange={(e) => setData("stock", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Price (₱)
              </label>
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData("price", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={data.expiry}
                onChange={(e) => setData("expiry", e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </>
        )}

        {/* === Item Fields === */}
        {modalType === "item" && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={data.stock_quantity}
                onChange={(e) => setData("stock_quantity", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Price (₱)
              </label>
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

        {/* ✅ Common Description Field for all */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="w-full border rounded px-3 py-2 h-20 resize-none"
            placeholder={`Enter ${modalType} description...`}
          ></textarea>
        </div>

        {/* Buttons */}
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

      </main>
    </div>
  );
}
