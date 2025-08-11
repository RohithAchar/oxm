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
import {
  businessType,
  BusinessProfileUpdateSchema,
  UpdateProfileFormData,
} from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateBusiness } from "@/lib/controller/business/businessOperations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type BusinessSchema =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];

export const ProfileForm = ({ business }: { business: BusinessSchema }) => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(BusinessProfileUpdateSchema),
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
    <div className="flex flex-col gap-6 mb-24">
      <div>
        <h1 className="text-2xl font-light">Edit Profile</h1>
        <p className="text-muted-foreground text-sm">
          Update your business profile information.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            try {
              setLoading(true);
              await updateBusiness(
                business.id,
                data,
                business.profile_avatar_url!
              );
              toast.success("Business profile updated successfully!");
              router.push("/supplier/profile");
            } catch (error) {
              toast.error(
                "Failed to update business profile. Please try again."
              );
              console.error("Update error:", error);
            } finally {
              setLoading(false);
            }
          })}
          className="px-4 py-6 rounded-lg border space-y-4 pb-4"
        >
          <FormField
            control={form.control}
            name="profile_pic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                      <AvatarImage
                        src={
                          profilePic ||
                          business.profile_avatar_url ||
                          "/placeholder-profile.png"
                        }
                        alt="Profile Picture"
                        className="h-full w-full object-cover"
                      />
                    </Avatar>

                    <Input
                      type="file"
                      disabled={loading}
                      accept="image/jpeg, image/png, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setProfilePic(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
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
                  <Select
                    disabled={loading}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
          <FormField
            control={form.control}
            name="alternate_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alternate Phone</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="number"
                    {...field}
                    placeholder="Enter Phone"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
                    {...field}
                    placeholder="City"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
                    {...field}
                    placeholder="State"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="number"
                    {...field}
                    placeholder="Enter Pincode"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    {...field}
                    placeholder="Enter Address"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={loading}>
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};
