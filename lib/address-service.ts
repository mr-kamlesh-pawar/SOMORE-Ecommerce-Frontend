import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const ADDRESS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ADDRESS_COLLECTION_ID!;

/* ================= TYPES ================= */

export type AddressPayload = {
  house: string;
  area: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  addressType: string;
  isDefault: boolean;
};

/* ================= SERVICES ================= */

// 1️⃣ Fetch addresses for user
export async function getUserAddresses(userId: string) {
  const res = await databases.listDocuments(
    DB_ID,
    ADDRESS_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ]
  );

  return res.documents;
}

// 2️⃣ Create address
export async function createAddress(
  userId: string,
  address: AddressPayload,
  existingAddresses: any[]
) {
  // If default, unset others
  if (address.isDefault) {
    await Promise.all(
      existingAddresses.map((a) =>
        databases.updateDocument(
          DB_ID,
          ADDRESS_COLLECTION_ID,
          a.$id,
          { isDefault: false }
        )
      )
    );
  }

  return databases.createDocument(
    DB_ID,
    ADDRESS_COLLECTION_ID,
    ID.unique(),
    {
      userId,
      ...address,
      isDefault: address.isDefault || existingAddresses.length === 0,
    }
  );
}

// 3️⃣ Set default address
export async function setDefaultAddressService(
  addressId: string,
  addresses: any[]
) {
  await Promise.all(
    addresses.map((a) =>
      databases.updateDocument(
        DB_ID,
        ADDRESS_COLLECTION_ID,
        a.$id,
        { isDefault: a.$id === addressId }
      )
    )
  );
}

// 4️⃣ Delete address
export async function deleteAddressService(
  addressId: string,
  addresses: any[]
) {
  await databases.deleteDocument(
    DB_ID,
    ADDRESS_COLLECTION_ID,
    addressId
  );

  const remaining = addresses.filter((a) => a.$id !== addressId);

  // ensure one default exists
  if (remaining.length && !remaining.some((a) => a.isDefault)) {
    await databases.updateDocument(
      DB_ID,
      ADDRESS_COLLECTION_ID,
      remaining[0].$id,
      { isDefault: true }
    );
    remaining[0].isDefault = true;
  }

  return remaining;
}
