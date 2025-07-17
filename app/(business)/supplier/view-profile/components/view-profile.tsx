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
  Database["public"]["Tables"]["supplier_businesses"]["Row"] & {
    alternate_phone?: string | null;
  };

const LabelValue = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | boolean | null;
  icon?: any;
}) => (
  <div className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100/50 hover:bg-white/80 hover:border-gray-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50">
    <div className="flex items-center gap-3 mb-3">
      {Icon && (
        <div className="p-2 rounded-full bg-gray-100/80 group-hover:bg-blue-100/80 transition-colors duration-300">
          <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
        </div>
      )}
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
    <span className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
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
          className: "bg-green-50 text-green-700 border-green-200/50 shadow-sm",
        };
      case "PENDING":
        return {
          variant: "secondary" as const,
          icon: Clock,
          text: "Pending",
          className: "bg-amber-50 text-amber-700 border-amber-200/50 shadow-sm",
        };
      case "REJECTED":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          text: "Rejected",
          className: "bg-red-50 text-red-700 border-red-200/50 shadow-sm",
        };
      default:
        return {
          variant: "outline" as const,
          icon: Shield,
          text: "Unverified",
          className: "bg-gray-50 text-gray-700 border-gray-200/50 shadow-sm",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105`}
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
  } = useForm<ViewProfileSchema & { alternate_phone?: string }>({
    resolver: zodResolver(viewProfileSchema),
    defaultValues: {
      business_name: data?.business_name || "",
      business_address: data?.business_address || "",
      city: data?.city || "",
      state: data?.state || "",
      pincode: data?.pincode || "",
      alternate_phone: data?.alternate_phone || "",
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

  const onSubmit = async (
    formData: ViewProfileSchema & { alternate_phone?: string }
  ) => {
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
    }
  };

  const handleCancel = () => {
    reset();
    setEditMode(false);
    setPreviewUrl(null);
    setProfilePic(null);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-gray-100/50 rounded-3xl">
            <CardHeader className="p-8">
              <CardTitle>
                <Skeleton className="h-8 w-48 rounded-xl" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <Alert className="backdrop-blur-sm bg-red-50/80 border-red-200/50 rounded-3xl shadow-lg">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <AlertTitle className="text-red-800 font-semibold">
              Error loading profile
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {error || "No profile data found."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-12 rounded-lg">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header Card */}
        <Card className="mb-8 backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-gray-100/50 rounded-3xl overflow-hidden">
          <CardHeader className="p-8 text-gray-900 relative overflow-hidden">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm"></div> */}
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-white/10 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Avatar className="relative h-24 w-24 border-4 border-white/20 shadow-2xl shadow-black/10 transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage
                      src={data.profile_avatar_url || ""}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                      {data.business_name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  {data.is_verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg border-2 border-white">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-7 w-7 text-black/90" />
                      <CardTitle className="text-3xl font-bold text-black truncate">
                        {data.business_name || "Business Name"}
                      </CardTitle>
                    </div>
                    <StatusBadge status={data.status} />
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    {data.type && (
                      <Badge className="bg-gray-100 text-black border-gray-300 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-3 py-1 rounded-full">
                        {data.type}
                      </Badge>
                    )}
                    {data.gst_number && (
                      <Badge className="bg-gray-100 text-black border-gray-300 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 px-3 py-1 rounded-full">
                        GST: {data.gst_number}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-gray-100/50 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Profile Picture
                    </label>
                    <div className="relative">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-3xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 hover:border-blue-400">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <div className="p-3 bg-blue-100 rounded-full mb-3">
                              <Upload className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm text-gray-600 text-center">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              <br />
                              <span className="text-xs text-gray-500">
                                JPG or PNG, max 2MB
                              </span>
                            </p>
                          </div>
                          <input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleProfilePicUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {previewUrl && (
                        <div className="mt-4 flex justify-center">
                          <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                            <AvatarImage src={previewUrl} alt="Preview" />
                            <AvatarFallback>Preview</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      {...register("business_name")}
                      placeholder="Business Name"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {errors.business_name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.business_name.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      {...register("business_address")}
                      placeholder="Business Address"
                      className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                    />
                    {errors.business_address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.business_address.message}
                      </p>
                    )}
                  </div>

                  <Input
                    {...register("city")}
                    placeholder="City"
                    className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />

                  <Input
                    {...register("state")}
                    placeholder="State"
                    className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />

                  <Input
                    {...register("pincode")}
                    placeholder="Pincode"
                    className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />

                  <Input
                    {...register("alternate_phone")}
                    placeholder="Alternate Phone"
                    className="h-12 rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>

                <div className="flex gap-4 justify-end pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-8 py-3 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  <LabelValue
                    label="Business Name"
                    value={data?.business_name}
                    icon={Building2}
                  />
                  <LabelValue
                    label="Primary Phone"
                    value={data?.phone}
                    icon={Phone}
                  />
                  <LabelValue
                    label="Alternate Phone"
                    value={data?.alternate_phone}
                    icon={Phone}
                  />
                  <LabelValue
                    label="GST Number"
                    value={data?.gst_number}
                    icon={Shield}
                  />
                  <div className="md:col-span-2 xl:col-span-3">
                    <LabelValue
                      label="Business Address"
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
                <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-gray-200/50">
                  {data.gst_certificate_url && (
                    <Button
                      variant="outline"
                      className="flex items-center gap-3 px-6 py-3 rounded-2xl border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                    >
                      <Download className="h-4 w-4" />
                      Download GST Certificate
                    </Button>
                  )}
                  <Button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-700/30"
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
    </div>
  );
};

export default ViewProfile;
