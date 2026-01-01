"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { User, MapPin, ShoppingBag, LogOut, Trash, Menu, X, ChevronRight, Loader2, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/logout";
import { useAuth } from "@/store/context/AuthContext";
import { databases } from "@/lib/appwrite";
import { getUserAddresses, createAddress, setDefaultAddressService, deleteAddressService } from "@/lib/address-service";
import toast from "react-hot-toast";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  const [newAddress, setNewAddress] = useState({
    house: "",
    area: "",
    addressLine: "",
    landmark: "",
    mobileno: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    isDefault: false,
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  /* ---------------- SKELETON COMPONENTS (Moved to top to fix declaration order) ---------------- */
  const PageSkeleton = useCallback(() => (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-3 animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 mb-2 animate-pulse rounded" />
              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-200 mt-6 rounded-lg animate-pulse" />
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" />
                </div>
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <div className="h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border p-4 rounded-lg">
                      <div className="h-5 w-40 bg-gray-200 mb-2 animate-pulse rounded" />
                      <div className="h-4 w-64 bg-gray-200 mb-1 animate-pulse rounded" />
                      <div className="h-4 w-56 bg-gray-200 mb-1 animate-pulse rounded" />
                      <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const ProfileSkeleton = useCallback(() => (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" />
        <div className="h-12 bg-gray-200 rounded-lg md:col-span-2 animate-pulse" />
      </div>
      <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  ), []);

  const AddressSkeleton = useCallback(() => (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="h-8 w-48 bg-gray-200 mb-6 animate-pulse rounded" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border p-4 rounded-lg">
            <div className="h-5 w-40 bg-gray-200 mb-2 animate-pulse rounded" />
            <div className="h-4 w-64 bg-gray-200 mb-1 animate-pulse rounded" />
            <div className="h-4 w-56 bg-gray-200 mb-1 animate-pulse rounded" />
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  ), []);

  /* ---------------- RESPONSIVE HANDLING ---------------- */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !isLoggedIn && mounted) {
      router.replace("/login");
    }

    if (user && mounted) {
      setForm({
        firstName: user.profile?.firstName || "",
        lastName: user.profile?.lastName || "",
        email: user.email || "",
        phone: user.profile?.phone  || "",
      });
      
      if (!newAddress.mobileno && user.profile?.phone) {
        setNewAddress(prev => ({ ...prev, mobileno: user.profile.phone }));
      }
    }
  }, [loading, isLoggedIn, user, router, mounted,  newAddress.mobileno]);

  /* ---------------- LOAD ADDRESSES ---------------- */
  useEffect(() => {
    if (!user || !mounted) return;

    setLoadingAddresses(true);
    getUserAddresses(user.$id)
      .then((docs) => {
        setAddresses(docs);
        const def = docs.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def.$id);
      })
      .catch(() => {
        toast.error("Failed to load addresses");
        console.error("Failed to load addresses");
      })
      .finally(() => {
        setLoadingAddresses(false);
      });
  }, [user, mounted]);

  // Early returns - FIXED: These won't cause "Cannot update component while rendering"
  if (!mounted) {
    return <PageSkeleton />;
  }

  if (!isLoggedIn) {
    // Use setTimeout to avoid router.replace during render
    setTimeout(() => router.replace("/login"), 0);
    return <PageSkeleton />;
  }

  if (loading) {
    return <PageSkeleton />;
  }

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Saving profile...");

    try {
      await databases.updateDocument(
        DB_ID,
        USERS_COLLECTION_ID,
        user.$id,
        {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone,
        }
      );

      await refreshUser();
      setEditMode(false);
      toast.success("Profile updated successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    await logout();
    toast.success("Logged out successfully", { id: toastId });
    setTimeout(() => router.replace("/login"), 0);
  };

  const addAddress = async () => {
    if (!newAddress.house.trim()) {
      toast.error("House / Flat is required");
      return;
    }

    if (!newAddress.area.trim()) {
      toast.error("Area / Locality is required");
      return;
    }

    if (!newAddress.addressLine.trim()) {
      toast.error("Address line is required");
      return;
    }

    if (!newAddress.city.trim()) {
      toast.error("City is required");
      return;
    }

    if (!newAddress.state.trim()) {
      toast.error("State is required");
      return;
    }

    if (!/^\d{6}$/.test(newAddress.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    if (!/^\d{10}$/.test(newAddress.mobileno)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    const toastId = toast.loading("Saving address...");

    try {
      const doc = await createAddress(user.$id, newAddress, addresses);

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
        mobileno: form.phone || "",
        addressType: "Home",
        isDefault: false,
      });

      toast.success("Address added successfully", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to save address", { id: toastId });
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    const toastId = toast.loading("Updating default address...");

    try {
      await setDefaultAddressService(addressId, addresses);

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.$id === addressId,
        }))
      );

      setSelectedAddressId(addressId);
      toast.success("Default address updated", { id: toastId });
    } catch {
      toast.error("Failed to set default address", { id: toastId });
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    const toastId = toast.loading("Deleting address...");

    try {
      const remaining = await deleteAddressService(id, addresses);
      setAddresses(remaining);
      toast.success("Address deleted", { id: toastId });
    } catch {
      toast.error("Failed to delete address", { id: toastId });
    }
  };

  /* ---------------- SIDEBAR COMPONENT ---------------- */
 const Sidebar = () => (
    <aside className={`bg-white ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300' : 'w-64'} p-6 shadow-md h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden"
        >
          <X size={24} />
        </button>
      )}
      
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-800 text-white flex items-center justify-center text-2xl font-semibold mb-3">
          {user?.profile?.firstName
            ? user.profile.firstName.charAt(0).toUpperCase()
            : "U"}
          {user?.profile?.lastName
            ? user.profile.lastName.charAt(0).toUpperCase()
            : ""}
        </div>

        <p className="font-semibold text-center">
          {user?.profile?.firstName || "User"}{" "}
          {user?.profile?.lastName || ""}
        </p>

        <p className="text-sm text-gray-600 text-center">{user.email}</p>
      </div>

      <nav className="space-y-2">
        <button
          onClick={() => {
            setCurrentTab("profile");
            if (isMobile) setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
            currentTab === "profile" 
              ? "bg-black text-white" 
              : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <User size={18} />
            <span>My Profile</span>
          </div>
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => {
            setCurrentTab("orders");
            if (isMobile) setSidebarOpen(false);
          }}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
            currentTab === "orders" 
              ? "bg-black text-white" 
              : "hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} />
            <span>Settings</span>
          </div>
          <ChevronRight size={16} />
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-red-50 text-red-600 mt-6"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </nav>
    </aside>
  );

  /* ========================================================= */
 
  /* ========================================================= */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* MOBILE HEADER */}
      {isMobile && (
        <header className="sticky top-0 z-40 bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold">
              {currentTab === "profile" ? "My Account" : "Setting"}
            </h1>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </header>
      )}

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className={`flex-1 p-4 lg:p-6 ${isMobile ? 'pt-0' : ''}`}>
          {/* BREADCRUMB FOR MOBILE */}
          {isMobile && currentTab === "profile" && (
            <div className="mb-4 lg:hidden">
              <nav className="text-sm text-gray-600">
                <span>Account</span>
                <ChevronRight size={14} className="inline mx-1" />
                <span className="font-medium">Profile</span>
              </nav>
            </div>
          )}

          {/* PROFILE TAB */}
          {currentTab === "profile" && (
            <div className="space-y-6">
              {/* MOBILE HEADER */}
              {isMobile && (
                <div className="lg:hidden">
                  <h1 className="text-2xl font-bold mb-2">My Profile</h1>
                  <p className="text-gray-600">Manage your personal information</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PROFILE SECTION */}
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-semibold">Personal Information</h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-sm lg:text-base border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">First Name</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          disabled={!editMode}
                          onChange={handleChange}
                          placeholder="First Name"
                          className="w-full border px-4 py-3 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          disabled={!editMode}
                          onChange={handleChange}
                          placeholder="Last Name"
                          className="w-full border px-4 py-3 rounded-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        value={form.email}
                        disabled
                        className="w-full border px-4 py-3 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 bg-gray-50 px-3 py-3 rounded-l-lg border border-r-0">
                          +91
                        </span>
                        <input
                          name="phone"
                          value={form.phone}
                          disabled={!editMode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 10) {
                              setForm({ ...form, phone: value });
                            }
                          }}
                          placeholder="Mobile Number"
                          className="flex-1 border px-4 py-3 rounded-r-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={saveProfile}
                          disabled={saving}
                          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving && <Loader2 size={18} className="animate-spin" />}
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            // Reset form to original values
                            if (user) {
                              setForm({
                                firstName: user.profile?.firstName || "",
                                lastName: user.profile?.lastName || "",
                                email: user.email || "",
                                phone: user.profile?.phone || "",
                              });
                            }
                          }}
                          className="border px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* ADDRESSES SECTION */}
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl lg:text-2xl font-semibold">My Addresses</h2>
                    {!showAddAddress && addresses.length > 0 && (
                      <button
                        onClick={() => {
                          setNewAddress(prev => ({
                            ...prev,
                            mobileno: form.phone || "",
                          }));
                          setShowAddAddress(true);
                        }}
                        className="text-sm lg:text-base bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Add New
                      </button>
                    )}
                  </div>

                  {loadingAddresses ? (
                    <AddressSkeleton />
                  ) : (
                    <>
                      {/* EXISTING ADDRESSES */}
                      {addresses.length > 0 ? (
                        <div className="space-y-4 mb-6">
                          {addresses.map((a) => (
                            <div
                              key={a.$id || a.id}
                              className={`border rounded-lg p-4 ${a.isDefault ? 'border-green-700 bg-green-50' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex gap-3 flex-1">
                                  <input
                                    type="radio"
                                    name="defaultAddress"
                                    checked={a.isDefault}
                                    onChange={() => setDefaultAddress(a.$id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <p className="font-semibold">
                                        {a.house}, {a.area}
                                      </p>
                                      {a.isDefault && (
                                        <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-full">
                                          Default
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-1">
                                      {a.addressLine}
                                    </p>
                                    {a.landmark && (
                                      <p className="text-gray-500 text-sm mb-1">
                                        Landmark: {a.landmark}
                                      </p>
                                    )}
                                    <p className="text-gray-600 text-sm mb-1">
                                      {a.city}, {a.state} - {a.pincode}
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-2">
                                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                        {a.addressType}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        📱 {a.mobileno}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => deleteAddress(a.$id || a.id)}
                                  className="text-gray-400 hover:text-red-600 ml-2 transition-colors"
                                  aria-label="Delete address"
                                >
                                  <Trash size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : !showAddAddress && (
                        <div className="text-center py-8">
                          <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No addresses added yet</p>
                          <button
                            onClick={() => {
                              setNewAddress(prev => ({
                                ...prev,
                                mobileno: form.phone || "",
                              }));
                              setShowAddAddress(true);
                            }}
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Add Your First Address
                          </button>
                        </div>
                      )}

                      {/* ADD ADDRESS FORM */}
                      {showAddAddress && (
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {[
                              { label: "House / Flat", value: newAddress.house, field: "house" },
                              { label: "Area / Locality", value: newAddress.area, field: "area" },
                              { label: "Address Line", value: newAddress.addressLine, field: "addressLine", fullWidth: true },
                              { label: "Landmark (Optional)", value: newAddress.landmark, field: "landmark", fullWidth: true },
                              { label: "City", value: newAddress.city, field: "city" },
                              { label: "State", value: newAddress.state, field: "state" },
                              { label: "Pincode", value: newAddress.pincode, field: "pincode" },
                            ].map(({ label, value, field, fullWidth }) => (
                              <div key={field} className={fullWidth ? "md:col-span-2" : ""}>
                                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                                <input
                                  placeholder={label}
                                  value={value}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, [field]: e.target.value })
                                  }
                                  className="w-full border px-4 py-3 rounded-lg"
                                />
                              </div>
                            ))}

                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Mobile Number</label>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 bg-gray-50 px-3 py-3 rounded-l-lg border border-r-0">
                                  +91
                                </span>
                                <input
                                  placeholder="Mobile Number"
                                  value={newAddress.mobileno}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) {
                                      setNewAddress({ ...newAddress, mobileno: value });
                                    }
                                  }}
                                  className="flex-1 border px-4 py-3 rounded-r-lg"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm text-gray-600 mb-1">Address Type</label>
                              <select
                                value={newAddress.addressType}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, addressType: e.target.value })
                                }
                                className="w-full border px-4 py-3 rounded-lg"
                              >
                                <option value="Home">Home</option>
                                <option value="Work">Work</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
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
                              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Save Address
                            </button>
                            <button
                              onClick={() => setShowAddAddress(false)}
                              className="border px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {currentTab === "orders" && (
            <div className="bg-white rounded-xl p-4 lg:p-6 shadow">
              <h2 className="text-xl lg:text-2xl font-semibold mb-6">Setting</h2>
              <div className="text-center py-12">
                <Settings size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No developed yet</p>
                <p className="text-gray-500 mb-6">Click on change password</p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}