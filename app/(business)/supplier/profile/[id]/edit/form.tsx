"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Database } from "@/utils/supabase/database.types";
import { businessType, BusinessUpdateSchema, FormData } from "./types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BusinessSchema =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];

export const ProfileForm = ({ business }: { business: BusinessSchema }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(BusinessUpdateSchema),
    defaultValues: {
      business_name: business.business_name,
      business_address: business.business_address,
      city: business.city,
      state: business.state,
      pincode: business.pincode,
      type: business.type || "OTHER",
      alternate_phone: business.alternate_phone || "",
    },
  });

  return (
    <div className="p-4 border rounded-xl flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update your business profile information.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => console.log(data))}
          className="bg-muted p-4 rounded-xl border space-y-4"
        >
          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-primary-foreground"
                    {...field}
                    placeholder="Business Name"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full bg-primary-foreground">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Type</SelectLabel>
                        {businessType.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  What type of business is this?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
