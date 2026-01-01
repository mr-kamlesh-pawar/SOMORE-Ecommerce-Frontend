"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin } from "lucide-react";
import { useAuth } from "@/store/context/AuthContext";
import { getUserAddresses } from "@/lib/address-service";
import toast from "react-hot-toast";

// Define the props interface
interface CheckoutAddressProps {
  onAddressSelect?: () => void; // Optional callback when address is selected
}

export default function CheckoutAddress({ onAddressSelect }: CheckoutAddressProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSelectedAddress, setHasSelectedAddress] = useState(false);

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    if (!user) return;

    const loadAddresses = async () => {
      try {
        setLoading(true);
        const docs = await getUserAddresses(user.$id);
        setAddresses(docs);

        // Check if there's already a selected address in localStorage
        const savedAddress = localStorage.getItem('selectedAddress');
        if (savedAddress) {
          const parsedAddress = JSON.parse(savedAddress);
          setSelectedAddressId(parsedAddress.$id);
          setHasSelectedAddress(true);
          
          // Call the callback if address is already selected
          if (onAddressSelect) {
            onAddressSelect();
          }
        } else {
          // Auto select default address
          const def = docs.find((a) => a.isDefault);
          if (def) {
            setSelectedAddressId(def.$id);
            setHasSelectedAddress(true);
            localStorage.setItem('selectedAddress', JSON.stringify(def));
            
            // Call the callback when default address is auto-selected
            if (onAddressSelect) {
              onAddressSelect();
            }
          }
        }
      } catch (err) {
        console.error("Failed to load addresses", err);
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [user, onAddressSelect]);

  /* ================= SELECT ADDRESS ================= */
  const handleSelectAddress = (address: any) => {
    setSelectedAddressId(address.$id);
    setHasSelectedAddress(true);
    
    // Save to localStorage for checkout page
    localStorage.setItem('selectedAddress', JSON.stringify(address));
    
    // Call the callback when address is manually selected
    if (onAddressSelect) {
      onAddressSelect();
    }
    
    toast.success("Address selected", {
      icon: "📍",
      duration: 2000,
    });
    
    // Optionally go back to checkout page after selection
    setTimeout(() => {
      router.push('/checkout');
    }, 500);
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-300 rounded"></div>
            <div className="h-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show selected address count in header
  const selectedCount = hasSelectedAddress ? 1 : 0;
  const totalCount = addresses.length;

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Select Shipping Address
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {hasSelectedAddress 
              ? `Selected 1 of ${totalCount} addresses` 
              : `Choose where you want your order delivered`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="text-green-600" size={24} />
          {hasSelectedAddress && (
            <div className="h-6 w-6 rounded-full bg-green-100 text-green-800 text-xs flex items-center justify-center font-semibold">
              ✓
            </div>
          )}
        </div>
      </div>

      {/* ADDRESS LIST */}
      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.$id}
              onClick={() => handleSelectAddress(addr)}
              className={`border p-4 rounded-lg cursor-pointer transition-all
                ${selectedAddressId === addr.$id
                  ? "border-green-600 bg-green-50 dark:bg-green-900/20 shadow-sm"
                  : "border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-white dark:hover:bg-gray-800"
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {addr.house}, {addr.area}
                    </p>
                    {addr.isDefault && (
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Default
                      </span>
                    )}
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
                      {addr.addressType}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{addr.addressLine}</p>
                  
                  {addr.landmark && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span className="font-medium">Landmark:</span> {addr.landmark}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📞 {addr.mobileno}
                  </p>
                </div>

                {selectedAddressId === addr.$id && (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center ml-4">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No saved addresses found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
            Add an address to proceed with checkout
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="mt-8 space-y-3">
        <button
          onClick={() => router.push("/account")}
          className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-3 rounded-lg font-medium transition-colors"
        >
          + Add New Address
        </button>
        
        {hasSelectedAddress && (
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Continue with Selected Address
          </button>
        )}
      </div>

      {/* Security Footer */}
      <div className="mt-12 pt-8 border-t dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>🔒 Secure checkout | 🚚 Free shipping | 📞 24/7 Support</p>
        <p className="mt-2">
          Need help? Call us at 1800-123-4567 or email support@yourstore.com
        </p>
      </div>
    </div>
  );
}