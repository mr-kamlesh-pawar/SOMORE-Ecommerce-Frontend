"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { useAuth } from "@/store/context/AuthContext";
import {
  getUserAddresses,
  setDefaultAddressService,
} from "@/lib/address-service";

export default function CheckoutAddress() {
  const router = useRouter();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      try {
        const docs = await getUserAddresses(user.$id);
      //  console.log(docs);
        setAddresses(docs);

        // auto select default
        const def = docs.find((a) => a.isDefault);
        if (def) setSelectedAddressId(def.$id);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };

    loadAddresses();
  }, [user]);

  /* ================= SELECT ADDRESS ================= */
  const handleSelectAddress = async (addressId: string) => {
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
      alert("Failed to select address");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Shipping Address
      </h2>

      {/* ADDRESS LIST */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <label
              key={addr.$id}
              onClick={() => handleSelectAddress(addr.$id)}
              className={`border p-4 rounded-lg cursor-pointer flex justify-between items-start
              transition-all
              ${
                selectedAddressId === addr.$id
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <div>
                <p className="font-semibold">
                  {addr.house}, {addr.area}
                  {addr.isDefault && (
                    <span className="ml-2 text-xs text-green-700">(Default)</span>
                  )}
                </p>

                <p className="text-sm text-gray-600">{addr.addressLine}</p>

                {addr.landmark && (
                  <p className="text-sm text-gray-500">
                    Landmark: {addr.landmark}
                  </p>
                )}

                <p className="text-sm text-gray-600">
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>

                <p className="text-sm text-gray-500">
                  Type: {addr.addressType}
                </p>

                <p className="text-sm text-gray-600">
                  📞 {addr.mobileno}
                </p>
              </div>

              <Radio
                size={20}
                className={
                  selectedAddressId === addr.$id
                    ? "text-green-600"
                    : "text-gray-400"
                }
              />
            </label>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No saved addresses found.</p>
      )}

      {/* ADD ADDRESS */}
      <button
        onClick={() => router.push("/account")}
        className="mt-5 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900"
      >
        + Add New Address
      </button>
    </div>
  );
}
