"use client";

import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { User, Mail, Phone, Edit, Save } from "lucide-react";

export default function AccountClient({ user }: any) {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveChanges = () => {
    console.log("Save to database →", form);
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-xl p-8">
        
        {/* HEADER */}
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          My Account
        </h2>

        {/* PROFILE IMAGE */}
        <div className="flex justify-center mb-6">
          <Image
            src={user.image || "/default-user.png"}
            alt="profile"
            width={100}
            height={100}
            className="rounded-full border"
          />
        </div>

        {/* USER DETAILS */}
        <div className="space-y-5">
          
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>

            <input
              name="name"
              disabled={!editMode}
              value={form.name}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg mt-1 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>

            <input
              name="email"
              disabled={!editMode}
              value={form.email}
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg mt-1 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500 flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </label>

            <input
              name="phone"
              disabled={!editMode}
              value={form.phone}
              onChange={handleChange}
              placeholder="Add phone number"
              className={`w-full border px-4 py-3 rounded-lg mt-1 ${
                editMode ? "bg-white" : "bg-gray-100"
              }`}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex items-center justify-between">
          
          {/* Edit / Save */}
          {editMode ? (
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              <Save size={18} /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition"
            >
              <Edit size={18} /> Edit Profile
            </button>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
