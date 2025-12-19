"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Edit,
  Save,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";
import { useAuth } from "@/store/context/AuthContext";

export default function AccountPage() {
  const router = useRouter();

  // ✅ AUTH CONTEXT (single source of truth)
  const { user, isLoggedIn, loading } = useAuth();

  /* ---------------- ALL HOOKS AT TOP ---------------- */

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Home",
      address: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      phone: "9876543210",
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  /* ---------------- AUTH GUARD ---------------- */

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [loading, isLoggedIn, user]);

  /* ---------------- LOADING STATE ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) return null;

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    console.log("Saved:", form);
    setEditMode(false);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const addAddress = () => {
    setAddresses([...addresses, { id: Date.now(), ...newAddress }]);
    setNewAddress({
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
    });
  };

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`bg-white h-screen shadow-md w-64 p-6 fixed md:static top-0 transition-transform duration-300 z-20
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Profile Banner */}
        <div className="flex flex-col items-center mb-10">
          <Image
             src="/images/about/reviewuser.png" // fallback avatar
            alt="user"
            width={80}
            height={80}
            className="rounded-full mb-3 shadow-md"
          />
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>

        {/* Nav Items */}
        <nav className="space-y-4">
          <button
            onClick={() => setCurrentTab("profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              currentTab === "profile" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <User size={18} /> My Profile
          </button>

          <button
            onClick={() => setCurrentTab("address")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              currentTab === "address" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <MapPin size={18} /> My Addresses
          </button>

          <button
            onClick={() => setCurrentTab("orders")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              currentTab === "orders" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <ShoppingBag size={18} /> My Orders
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
        />
      )}

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-6 md:ml-0">

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden bg-black text-white px-4 py-2 rounded mb-4"
        >
          Menu
        </button>

        {/* MAIN PAGE SWITCHING */}
        {currentTab === "profile" && (
          <ProfileSection
            form={form}
            editMode={editMode}
            setEditMode={setEditMode}
            saveChanges={saveChanges}
            handleChange={handleChange}
          />
        )}

        {currentTab === "address" && (
          <AddressSection
            addresses={addresses}
            deleteAddress={deleteAddress}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            addAddress={addAddress}
          />
        )}

        {currentTab === "orders" && <OrdersSection />}
      </main>
    </div>
  );
}


/* ---------------- PROFILE SECTION ---------------- */

function ProfileSection({ form, editMode, setEditMode, saveChanges, handleChange }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <div className="space-y-6">

        <InputField label="Full Name" name="name" value={form.name} editMode={editMode} handleChange={handleChange} />
        <InputField label="Email Address" name="email" value={form.email} editMode={editMode} handleChange={handleChange} />
        <InputField label="Phone Number" name="phone" value={form.phone} editMode={editMode} handleChange={handleChange} />

      </div>

      <div className="mt-8">
        {editMode ? (
          <button
            onClick={saveChanges}
            className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}


/* ---------------- ADDRESS SECTION ---------------- */

function AddressSection({ addresses, deleteAddress, newAddress, setNewAddress, addAddress }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">My Addresses</h2>

      {/* Existing Addresses */}
      <div className="space-y-4 mb-8">
        {addresses.map((a: any) => (
          <div key={a.id} className="border p-4 rounded-lg flex justify-between">
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-gray-600">{a.address}, {a.city}</p>
              <p className="text-gray-600">{a.state} - {a.pincode}</p>
              <p className="text-gray-600">Phone: {a.phone}</p>
            </div>

            <button onClick={() => deleteAddress(a.id)} className="text-red-600 hover:text-red-800">
              <Trash size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Address */}
      <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {["name", "address", "city", "state", "pincode", "phone"].map((f) => (
          <input
            key={f}
            placeholder={f.toUpperCase()}
            className="border px-4 py-3 rounded-lg"
            value={newAddress[f]}
            onChange={(e) => setNewAddress({ ...newAddress, [f]: e.target.value })}
          />
        ))}
      </div>

      <button
        onClick={addAddress}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900"
      >
        Add Address
      </button>
    </div>
  );
}


/* ---------------- ORDERS SECTION ---------------- */

function OrdersSection() {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      <p className="text-gray-600">No orders found.</p>
    </div>
  );
}


/* ---------------- INPUT FIELD COMPONENT ---------------- */

function InputField({ label, name, value, editMode, handleChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500 mb-1 block">{label}</label>
      <input
        name={name}
        disabled={!editMode}
        value={value}
        onChange={handleChange}
        className={`w-full border px-4 py-3 rounded-lg ${
          editMode ? "bg-white" : "bg-gray-100 cursor-not-allowed"
        }`}
      />
    </div>
  );
}
