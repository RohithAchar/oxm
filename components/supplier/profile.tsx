import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Building2,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ImageUp,
} from "lucide-react";

export const Profile = async () => {
  const userId = await getUserId();
  const business = await getBusiness(userId);

  if (!business) {
    notFound();
  }

  // Compute verification and completeness
  const isVerified = Boolean(
    business.is_verified || business.status === "APPROVED"
  );
  const attributesForCompleteness = [
    business.business_name,
    business.phone,
    business.gst_number,
    business.business_address,
    business.city,
    business.state,
    business.pincode,
    business.type,
    business.profile_avatar_url,
  ];
  const filledCount = attributesForCompleteness.filter(Boolean).length;
  const completion = Math.round(
    (filledCount / attributesForCompleteness.length) * 100
  );

  const tier =
    completion >= 90 ? "Gold" : completion >= 70 ? "Silver" : "Bronze";

  return (
    <div className="flex flex-col gap-6">
      {/* Header with trust badge and completion */}
      <div className="rounded-2xl border bg-muted/30 p-4 md:p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-20 h-20 md:w-28 md:h-28 border-4 border-background shadow">
              <AvatarImage
                src={business.profile_avatar_url || "/placeholder-profile.png"}
                alt="Business Avatar"
              />
              <AvatarFallback className="text-xl md:text-2xl">
                {business.business_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isVerified && (
              <span className="absolute -bottom-1 -right-1 inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold md:font-light">
                {business.business_name}
              </h1>
              <Badge variant="secondary" className="rounded-full">
                Trust: {tier}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage your business profile and settings.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Profile completeness
                </span>
                <span className="font-medium">{completion}%</span>
              </div>
              <Progress value={completion} />
              {completion < 100 && (
                <p className="text-xs text-muted-foreground">
                  Complete your profile to reach Gold tier.
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild className="rounded-full">
                <Link href={`/supplier/profile/${business.id}/edit`}>
                  Edit Profile
                </Link>
              </Button>
              <Button variant="secondary" asChild className="rounded-full">
                <Link href={`/supplier/profile/${business.id}/edit`}>
                  <ImageUp className="h-4 w-4 mr-2" /> Upload Logo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-muted-foreground">Type</div>
              <div className="font-medium">{business.type || "—"}</div>
            </div>
            <div>
              <div className="text-muted-foreground">GST Number</div>
              <div className="font-mono text-xs bg-muted px-2 py-1 rounded inline-block">
                {business.gst_number || "—"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" /> Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{business.phone || "—"}</span>
            </div>
            <div className="text-muted-foreground">Alternate</div>
            <div className="font-medium">{business.alternate_phone || "—"}</div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="font-medium">
              {business.business_address || "—"}
            </div>
            <div className="text-muted-foreground">{business.city || ""}</div>
            <div className="text-muted-foreground">
              {(business.state || "").toString()}{" "}
              {business.pincode ? `- ${business.pincode}` : ""}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
