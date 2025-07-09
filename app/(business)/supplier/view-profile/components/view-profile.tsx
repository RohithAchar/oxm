"use client";

import { useEffect, useState } from "react";
import { Database } from "@/utils/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  AlertTriangle,
  Download,
  MapPin,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  viewProfileSchema,
  ViewProfileSchema,
} from "../types/view-profile-form.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

type SupplierDataType =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];

const LabelValue = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | boolean | null;
  icon?: any;
}) => (
  <div className="group p-4 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
    </div>
    <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
      {value || "—"}
    </span>
  </div>
);

type StatusEnum = Database["public"]["Enums"]["verification_status"];
const StatusBadge = ({ status }: { status: StatusEnum | null }) => {
  const getStatusConfig = (status: StatusEnum | null) => {
    switch (status) {
      case "APPROVED":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          text: "Verified",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "PENDING":
        return {
          variant: "secondary" as const,
          icon: Clock,
          text: "Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "REJECTED":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          text: "Rejected",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          variant: "outline" as const,
          icon: Shield,
          text: "Unverified",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} flex items-center gap-1 px-3 py-1`}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
};

const ViewProfile = ({
  data,
  error,
}: {
  data: SupplierDataType | null;
  error: string | null;
}) => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ViewProfileSchema>({
    resolver: zodResolver(viewProfileSchema),
    defaultValues: {
      business_name: data?.business_name || "",
      business_address: data?.business_address || "",
      city: data?.city || "",
      state: data?.state || "",
      pincode: data?.pincode || "",
    },
  });

  const handleProfilePicUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Profile picture must be a JPG or PNG image.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Profile picture must be under 2MB.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setProfilePic(file);
    toast.success("Profile picture selected.");
  };

  const onSubmit = async (formData: ViewProfileSchema) => {
    let profilePicUrl = data?.profile_avatar_url;
    if (profilePic) {
      const picFormData = new FormData();
      picFormData.append("file", profilePic);

      const picUploadRes = await axios.post(
        "/api/profile-picture",
        picFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (picUploadRes.data.publicUrl) {
        profilePicUrl = picUploadRes.data.publicUrl;
        toast.success("Profile picture uploaded.");
      }
    }

    const res = await fetch("/api/update-supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        profile_avatar_url: profilePicUrl,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Update failed");
    } else {
      toast.success("Profile updated");
      setEditMode(false);
      // Optional: refresh or mutate
    }
  };

  const handleCancel = () => {
    reset();
    setEditMode(false);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <Card className="container mx-auto p-6 max-w-4xl">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error loading profile</AlertTitle>
        <AlertDescription>{error || "No profile data found."}</AlertDescription>
      </Alert>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Card with Gradient Background */}
      <Card className="mb-6">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={data.profile_avatar_url || ""}
                  alt="Profile"
                />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {data.business_name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              {data.is_verified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 shadow-md">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  <CardTitle className="text-2xl font-bold">
                    {data.business_name || "Business Name"}
                  </CardTitle>
                </div>
                <StatusBadge status={data.status} />
              </div>

              <div className="flex flex-wrap gap-2 text-sm opacity-90">
                {data.type && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    {data.type}
                  </Badge>
                )}
                {data.gst_number && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30"
                  >
                    GST: {data.gst_number}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Card */}
      <Card className="">
        <CardContent className="p-8">
          {editMode ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Profile Picture</label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              profile picture
                            </p>
                            <p className="text-xs text-gray-500">
                              JPG or PNG, max 2MB
                            </p>
                          </>
                        </div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={handleProfilePicUpload}
                          className="hidden"
                        />
                      </label>
                      {previewUrl && (
                        <div className="mt-4 ml-4 flex justify-center">
                          <Avatar className="w-18 h-18">
                            <AvatarImage src={previewUrl} alt="Preview" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Input
                  {...register("business_name")}
                  placeholder="Business Name"
                />
                {errors.business_name && (
                  <p className="text-sm text-red-500">
                    {errors.business_name.message}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <Input
                  {...register("business_address")}
                  placeholder="Address"
                />
                {errors.business_address && (
                  <p className="text-sm text-red-500">
                    {errors.business_address.message}
                  </p>
                )}
              </div>
              <Input {...register("city")} placeholder="City" />
              <Input {...register("state")} placeholder="State" />
              <Input {...register("pincode")} placeholder="Pincode" />
              <div className="col-span-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <LabelValue
                  label="Business Name"
                  value={data?.business_name}
                  icon={Building2}
                />
                <LabelValue label="Phone" value={data?.phone} icon={Phone} />
                <LabelValue
                  label="GST Number"
                  value={data?.gst_number}
                  icon={Shield}
                />
                <div className="sm:col-span-2 lg:col-span-3">
                  <LabelValue
                    label="Address"
                    value={`${data?.business_address}, ${data?.city}, ${data?.state} - ${data?.pincode}`}
                    icon={MapPin}
                  />
                </div>
                <LabelValue
                  label="Created"
                  value={formatDate(data?.created_at)}
                  icon={Calendar}
                />
                <LabelValue
                  label="Last Updated"
                  value={formatDate(data?.updated_at)}
                  icon={Calendar}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                {data.gst_certificate_url && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download GST Certificate
                  </Button>
                )}
                <Button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewProfile;
