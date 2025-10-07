"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database } from "@/utils/supabase/database.types";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Star,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

type SupplierBankDetails =
  Database["public"]["Tables"]["supplier_bank_details"]["Row"];

interface BankDetailsCardProps {
  bankDetails: SupplierBankDetails;
  onVerify: () => void;
  onSetPrimary: () => void;
  onDelete: () => void;
}

export function BankDetailsCard({
  bankDetails,
  onVerify,
  onSetPrimary,
  onDelete,
}: BankDetailsCardProps) {
  const getVerificationStatus = () => {
    switch (bankDetails.verification_status) {
      case "valid":
        return {
          label: "Verified",
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-600",
        };
      case "invalid":
        return {
          label: "Invalid",
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-600",
        };
      case "validating":
        return {
          label: "Verifying",
          variant: "secondary" as const,
          icon: Clock,
          color: "text-yellow-600",
        };
      case "failed":
        return {
          label: "Failed",
          variant: "destructive" as const,
          icon: AlertCircle,
          color: "text-red-600",
        };
      default:
        return {
          label: "Pending",
          variant: "outline" as const,
          icon: Clock,
          color: "text-gray-600",
        };
    }
  };

  const status = getVerificationStatus();
  const StatusIcon = status.icon;

  const formatAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return "****" + accountNumber.slice(-4);
  };

  return (
    <Card className={`${bankDetails.is_primary ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle className="text-lg md:text-xl">
            {bankDetails.account_holder_name}
            {bankDetails.is_primary && (
              <Star className="inline h-4 w-4 ml-2 text-yellow-500 fill-current" />
            )}
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          {bankDetails.is_primary && (
            <Badge variant="secondary" className="text-xs">
              Primary
            </Badge>
          )}
          <Badge variant={status.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!bankDetails.is_primary && (
                <DropdownMenuItem onClick={onSetPrimary}>
                  <Star className="mr-2 h-4 w-4" />
                  Set as Primary
                </DropdownMenuItem>
              )}
              {bankDetails.verification_status === "validating" && (
                <DropdownMenuItem onClick={onVerify}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Check Status
                </DropdownMenuItem>
              )}
              {bankDetails.verification_status === "pending" && (
                <DropdownMenuItem onClick={onVerify}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Verify Account
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs md:text-sm">
              Account Number
            </p>
            <p className="font-medium text-sm md:text-base">
              {formatAccountNumber(bankDetails.account_number)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm">
              IFSC Code
            </p>
            <p className="font-medium text-sm md:text-base">
              {bankDetails.ifsc_code}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm">
              Account Type
            </p>
            <p className="font-medium text-sm md:text-base capitalize">
              {bankDetails.account_type}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs md:text-sm">Bank</p>
            <p className="font-medium text-sm md:text-base">
              {bankDetails.bank_name || "Unknown"}
            </p>
          </div>
        </div>

        {/* Verification Details */}
        {bankDetails.verification_status === "valid" &&
          bankDetails.name_at_bank && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Verified Details</p>
              <div className="grid grid-cols-2 gap-4 text-sm mt-1">
                <div>
                  <p className="text-muted-foreground">Name at Bank</p>
                  <p className="font-medium">{bankDetails.name_at_bank}</p>
                </div>
                {bankDetails.bank_city && (
                  <div>
                    <p className="text-muted-foreground">Branch</p>
                    <p className="font-medium">{bankDetails.bank_city}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Verification Message */}
        {bankDetails.verification_message && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">Status Message</p>
            <p className="text-sm">{bankDetails.verification_message}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
          {bankDetails.verification_status === "validating" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onVerify}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Status
            </Button>
          )}
          {bankDetails.verification_status === "pending" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onVerify}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Verify Account
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
