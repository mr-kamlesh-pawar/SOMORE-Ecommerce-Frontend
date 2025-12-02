"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const schema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  address: z.string().min(5),
  phone: z.string().min(8),
  city: z.string().min(3),
  zip: z.string().min(3),
  country: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

const CheckoutForm = ({ onSave, onCancel }: any) => {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    onSave(data); // pass new address to parent
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input {...register("firstName")} />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input {...register("lastName")} />
        </div>
      </div>

      <div>
        <Label>Address</Label>
        <Input {...register("address")} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input {...register("phone")} />
        </div>
        <div>
          <Label>City</Label>
          <Input {...register("city")} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label>ZIP Code</Label>
          <Input {...register("zip")} />
        </div>
        <div>
          <Label>Country</Label>
          <Input {...register("country")} />
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Address</Button>
      </div>
    </form>
  );
};

export default CheckoutForm;
