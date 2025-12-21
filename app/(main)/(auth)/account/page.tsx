"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { User, MapPin, ShoppingBag, LogOut, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";
import { useAuth } from "@/store/context/AuthContext";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getUserAddresses,   createAddress,
  setDefaultAddressService,
  deleteAddressService } from "@/lib/address-service";


/* ---------------- CONFIG ---------------- */

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;



/* ========================================================= */

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, loading, refreshUser } = useAuth();

  /* ---------------- STATE ---------------- */

  const [currentTab, setCurrentTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<any[]>([]);
const [newAddress, setNewAddress] = useState({
  house: "",
  area: "",
  addressLine: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  addressType: "Home",
  isDefault: false,
});


  const [showAddAddress, setShowAddAddress] = useState(false);
const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);


  /* ---------------- AUTH GUARD ---------------- */
useEffect(() => {
  setMounted(true);
}, []);


  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }

    if (user?.profile) {
      setForm({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        phone: user.profile.phone,
      });
    }
  }, [loading, isLoggedIn, user, router]);



 useEffect(() => {
  if (!user) return;

  getUserAddresses(user.$id)
    .then((docs) => {
      setAddresses(docs);
      const def = docs.find((a) => a.isDefault);
      if (def) setSelectedAddressId(def.$id);
    })
    .catch(() => console.error("Failed to load addresses"));
}, [user]);


if (!mounted) {
  return null;
}

// ⛔ auth check ONLY after mount
if (!isLoggedIn) {
  router.replace("/login");
  return null;
}



  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await databases.updateDocument(
        DB_ID,
        USERS_COLLECTION_ID,
        user.$id,
        {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
        }
      );

      await refreshUser();
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

const addAddress = async () => {
  try {
    const doc = await createAddress(
      user.$id,
      newAddress,
      addresses
    );

    setAddresses((prev) => [doc, ...prev]);
    setSelectedAddressId(doc.$id);
    setShowAddAddress(false);

    setNewAddress({
      house: "",
      area: "",
      addressLine: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home",
      isDefault: false,
    });
  } catch (err: any) {
    alert(err.message || "Failed to save address");
  }
};


const setDefaultAddress = async (addressId: string) => {
  try {
    await setDefaultAddressService(addressId, addresses);

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.$id === addressId,
      }))
    );

    setSelectedAddressId(addressId);
  } catch {
    alert("Failed to set default address");
  }
};



const deleteAddress = async (id: string) => {
  try {
    const remaining = await deleteAddressService(id, addresses);
    setAddresses(remaining);
  } catch {
    alert("Failed to delete address");
  }
};



  /* ========================================================= */

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="bg-white w-64 p-6 shadow-md">
       <div className="flex flex-col items-center mb-8">
  {/* Avatar with initials */}
  <div className="w-20 h-20 rounded-full bg-green-800 text-white flex items-center justify-center text-2xl font-semibold mb-3">
    {user.profile.firstName?.charAt(0).toUpperCase()}
    {user.profile.lastName?.charAt(0).toUpperCase()}
  </div>

  <p className="font-semibold">
    {user.profile.firstName} {user.profile.lastName}
  </p>
  <p className="text-sm text-gray-600">{user.email}</p>
</div>

        <nav className="space-y-3">
          <button
            onClick={() => setCurrentTab("profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${
              currentTab === "profile" ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
          >
            <User size={18} /> My Profile
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

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-6">

        {/* ---------------- PROFILE ---------------- */}
      {currentTab === "profile" && (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* ---------------- LEFT: PROFILE ---------------- */}
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          name="firstName"
          value={form.firstName}
          disabled={!editMode}
          onChange={handleChange}
          placeholder="First Name"
          className="border px-4 py-3 rounded-lg"
        />
        <input
          name="lastName"
          value={form.lastName}
          disabled={!editMode}
          onChange={handleChange}
          placeholder="Last Name"
          className="border px-4 py-3 rounded-lg"
        />
      </div>

      <input
        value={form.email}
        disabled
        className="border px-4 py-3 rounded-lg w-full mb-4 bg-gray-100"
      />

      <input
        name="phone"
        value={form.phone}
        disabled={!editMode}
        onChange={handleChange}
        placeholder="Phone Number"
        className="border px-4 py-3 rounded-lg w-full"
      />

      <div className="mt-6">
        {editMode ? (
          <button
            onClick={saveProfile}
            disabled={saving}
            className="bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="border px-5 py-3 rounded-lg bg-slate-200"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>



   {/* ---------------- RIGHT: ADDRESSES ---------------- */}
<div className="bg-white rounded-xl p-6 shadow">
  <h2 className="text-2xl font-semibold mb-6">My Addresses</h2>

  {/* EXISTING ADDRESSES */}
  {addresses.length > 0 && (
    <div className="space-y-4 mb-6">
      {addresses.map((a) => (
        <label
          key={a.$id || a.id}
          className={`border p-4 rounded-lg flex justify-between items-start cursor-pointer ${
            selectedAddressId === (a.$id || a.id)
              ? "border-green-700 bg-green-50"
              : ""
          }`}
        >
          <div className="flex gap-3">
          <input
  type="radio"
  name="defaultAddress"
  checked={a.isDefault}
  onChange={() => setDefaultAddress(a.$id)}
/>

            <div>
              <p className="font-semibold">
                {a.house}, {a.area}
                {a.isDefault && (
                  <span className="ml-2 text-xs text-green-700 font-medium">
                    (Default)
                  </span>
                )}
              </p>

              <p className="text-gray-600 text-sm">
                {a.addressLine}
              </p>

              {a.landmark && (
                <p className="text-gray-500 text-sm">
                  Landmark: {a.landmark}
                </p>
              )}

              <p className="text-gray-600 text-sm">
                {a.city}, {a.state} - {a.pincode}
              </p>

              <p className="text-gray-500 text-sm">
                Type: {a.addressType}
              </p>
            </div>
          </div>

          <button
            onClick={() => deleteAddress(a.$id || a.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash size={18} />
          </button>
        </label>
      ))}
    </div>
  )}

  {/* NO ADDRESS */}
  {addresses.length === 0 && !showAddAddress && (
    <p className="text-gray-500 mb-6">
      No addresses added yet.
    </p>
  )}

  {/* ADD ADDRESS BUTTON */}
  {!showAddAddress && (
    <button
      onClick={() => setShowAddAddress(true)}
      className="bg-black text-white px-6 py-3 rounded-lg"
    >
      Add New Address
    </button>
  )}

  {/* ADD ADDRESS FORM */}
  {showAddAddress && (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-4">
        Add New Address
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          placeholder="HOUSE / FLAT"
          value={newAddress.house}
          onChange={(e) =>
            setNewAddress({ ...newAddress, house: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        />

        <input
          placeholder="AREA / LOCALITY"
          value={newAddress.area}
          onChange={(e) =>
            setNewAddress({ ...newAddress, area: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        />

        <input
          placeholder="ADDRESS LINE"
          value={newAddress.addressLine}
          onChange={(e) =>
            setNewAddress({ ...newAddress, addressLine: e.target.value })
          }
          className="border px-4 py-3 rounded-lg col-span-2"
        />

        <input
          placeholder="LANDMARK (Optional)"
          value={newAddress.landmark}
          onChange={(e) =>
            setNewAddress({ ...newAddress, landmark: e.target.value })
          }
          className="border px-4 py-3 rounded-lg col-span-2"
        />

        <input
          placeholder="CITY"
          value={newAddress.city}
          onChange={(e) =>
            setNewAddress({ ...newAddress, city: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        />

        <input
          placeholder="STATE"
          value={newAddress.state}
          onChange={(e) =>
            setNewAddress({ ...newAddress, state: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        />

        <input
          placeholder="PINCODE"
          value={newAddress.pincode}
          onChange={(e) =>
            setNewAddress({ ...newAddress, pincode: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        />

        <select
          value={newAddress.addressType}
          onChange={(e) =>
            setNewAddress({ ...newAddress, addressType: e.target.value })
          }
          className="border px-4 py-3 rounded-lg"
        >
          <option value="Home">Home</option>
          <option value="Work">Work</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={newAddress.isDefault}
          onChange={(e) =>
            setNewAddress({ ...newAddress, isDefault: e.target.checked })
          }
        />
        Make this my default address
      </label>

      <div className="flex gap-3">
        <button
          onClick={addAddress}
          className="bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Save Address
        </button>

        <button
          onClick={() => setShowAddAddress(false)}
          className="border px-6 py-3 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </>
  )}
</div>


  </div>
)}


        {/* ---------------- ORDERS ---------------- */}
        {currentTab === "orders" && (
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <p className="text-gray-600">No orders found.</p>
          </div>
        )}
      </main>
    </div>
  );
}
