"use client";

import { useState } from "react";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { Radio } from "lucide-react";

/* Dummy saved addresses */
const initialAddresses = [
  {
    id: 1,
    name: "John Doe",
    address: "123 MG Road, Near City Mall",
    city: "Mumbai",
    phone: "9876543210",
    zip: "400001",
    country: "India",
  },
  {
    id: 2,
    name: "Amit Sharma",
    address: "45 Green Residency, Sector 21",
    city: "Pune",
    phone: "9988776655",
    zip: "411001",
    country: "India",
  },
  {
    id: 3,
    name: "Amit Sharma",
    address: "45 Green Residency, Sector 21",
    city: "Pune",
    phone: "9988776655",
    zip: "411001",
    country: "India",
  },
];

export default function CheckoutAddress() {
  const [addressList, setAddressList] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(1);
  const [showForm, setShowForm] = useState(false);

  // Called when new address is added from form
  const handleNewAddress = (data: any) => {
    const newAddress = {
      id: Date.now(),
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      city: data.city,
      phone: data.phone,
      zip: data.zip,
      country: data.country,
    };

    setAddressList([...addressList, newAddress]);
    setSelectedAddress(newAddress.id);
    setShowForm(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Shipping Address
      </h2>

      {/* SAVED ADDRESSES LIST */}
      {!showForm && (
        <>
          <div className="space-y-4">
            {addressList.map((addr) => (
              <div
                key={addr.id}
                className={`border p-4 rounded-lg cursor-pointer transition-all 
                ${selectedAddress === addr.id ? "border-green-600 bg-green-50" : "border-gray-300"}`}
                onClick={() => setSelectedAddress(addr.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-sm text-gray-600">{addr.address}</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.zip}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-600">📞 {addr.phone}</p>
                  </div>

                  <Radio
                    size={20}
                    className={selectedAddress === addr.id ? "text-green-600" : "text-gray-400"}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ADD NEW ADDRESS BUTTON */}
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900"
          >
            + Add New Address
          </button>
        </>
      )}

      {/* ADDRESS FORM */}
      {showForm && (
        <div className="mt-6">
          <CheckoutForm onSave={handleNewAddress} onCancel={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}
