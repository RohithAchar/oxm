"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

// Validation schema
const BankDetailsSchema = z
  .object({
    account_holder_name: z
      .string()
      .min(3, "Account holder name must be at least 3 characters")
      .max(100, "Account holder name must be less than 100 characters")
      .regex(
        /^[a-zA-Z\s\.]+$/,
        "Account holder name can only contain letters, spaces, and dots"
      ),

    account_number: z
      .string()
      .min(9, "Account number must be at least 9 digits")
      .max(18, "Account number must be less than 18 digits")
      .regex(/^\d+$/, "Account number can only contain digits"),

    confirm_account_number: z.string(),

    ifsc_code: z
      .string()
      .length(11, "IFSC code must be exactly 11 characters")
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

    account_type: z.enum(["savings", "current"]),

    is_primary: z.boolean().default(false),

    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.account_number === data.confirm_account_number, {
    message: "Account numbers don't match",
    path: ["confirm_account_number"],
  });

type BankDetailsFormData = z.infer<typeof BankDetailsSchema>;

interface BankDetails {
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  branch_address: string;
  city: string;
  state: string;
  is_valid: boolean;
}

interface BankDetailsFormProps {
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
  initialData?: Partial<BankDetailsFormData & { id?: string }>;
  isEditing?: boolean;
}

export function BankDetailsForm({
  onSuccess,
  onCancel,
  initialData,
  isEditing = false,
}: BankDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isLookingUpIFSC, setIsLookingUpIFSC] = useState(false);
  const [ifscError, setIfscError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<BankDetailsFormData>({
    resolver: zodResolver(BankDetailsSchema),
    defaultValues: {
      account_holder_name: initialData?.account_holder_name || "",
      account_number: initialData?.account_number || "",
      confirm_account_number: initialData?.account_number || "",
      ifsc_code: initialData?.ifsc_code || "",
      account_type: initialData?.account_type || "current",
      is_primary: initialData?.is_primary || false,
      terms_accepted: false,
    },
    mode: "onChange",
  });

  const watchedIFSC = watch("ifsc_code");
  const watchedAccountType = watch("account_type");

  // IFSC lookup effect
  useEffect(() => {
    const lookupIFSC = async () => {
      if (watchedIFSC && watchedIFSC.length === 11) {
        setIsLookingUpIFSC(true);
        setIfscError(null);
        setBankDetails(null);

        try {
          const response = await fetch(
            `/api/ifsc/${watchedIFSC.toUpperCase()}`
          );
          const result = await response.json();

          if (response.ok && result.success) {
            setBankDetails(result.data);
            setIfscError(null);
          } else {
            setIfscError(result.message || "Invalid IFSC code");
            setBankDetails(null);
          }
        } catch (error) {
          setIfscError("Failed to validate IFSC code");
          setBankDetails(null);
        } finally {
          setIsLookingUpIFSC(false);
        }
      } else {
        setBankDetails(null);
        setIfscError(null);
      }
    };

    const debounceTimer = setTimeout(lookupIFSC, 500);
    return () => clearTimeout(debounceTimer);
  }, [watchedIFSC]);

  const onSubmit = async (data: BankDetailsFormData) => {
    if (!bankDetails?.is_valid) {
      toast.error("Please enter a valid IFSC code");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        account_holder_name: data.account_holder_name,
        account_number: data.account_number,
        ifsc_code: data.ifsc_code.toUpperCase(),
        bank_name: bankDetails.bank_name,
        branch_name: bankDetails.branch_name,
        account_type: data.account_type,
        is_primary: data.is_primary,
      };

      const url = isEditing
        ? `/api/supplier/bank-details/${initialData?.id}`
        : "/api/supplier/bank-details";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(
          result.message ||
            `Bank details ${isEditing ? "updated" : "added"} successfully`
        );
        onSuccess?.(result.data);
        if (!isEditing) {
          reset();
          setBankDetails(null);
        }
      } else {
        toast.error(
          result.error ||
            `Failed to ${isEditing ? "update" : "add"} bank details`
        );

        if (result.details) {
          result.details.forEach((detail: any) => {
            toast.error(`${detail.field}: ${detail.message}`);
          });
        }
      }
    } catch (error) {
      console.error("Error submitting bank details:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {isEditing ? "Update Bank Details" : "Add Bank Details"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your bank account information for receiving payments"
            : "Add your bank account information to receive payments securely"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="account_holder_name">
              Account Holder Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account_holder_name"
              {...register("account_holder_name")}
              placeholder="Enter account holder name"
              className={errors.account_holder_name ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.account_holder_name && (
              <p className="text-sm text-red-500">
                {errors.account_holder_name.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must match the name on your bank account
            </p>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account_number">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account_number"
              type="tel"
              {...register("account_number")}
              placeholder="Enter account number"
              className={errors.account_number ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.account_number && (
              <p className="text-sm text-red-500">
                {errors.account_number.message}
              </p>
            )}
          </div>

          {/* Confirm Account Number */}
          <div className="space-y-2">
            <Label htmlFor="confirm_account_number">
              Confirm Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirm_account_number"
              type="tel"
              {...register("confirm_account_number")}
              placeholder="Re-enter account number"
              className={errors.confirm_account_number ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.confirm_account_number && (
              <p className="text-sm text-red-500">
                {errors.confirm_account_number.message}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div className="space-y-2">
            <Label htmlFor="ifsc_code">
              IFSC Code <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="ifsc_code"
                {...register("ifsc_code")}
                placeholder="Enter IFSC code (e.g., HDFC0001234)"
                className={
                  errors.ifsc_code || ifscError
                    ? "border-red-500"
                    : bankDetails?.is_valid
                    ? "border-green-500"
                    : ""
                }
                disabled={isSubmitting}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setValue("ifsc_code", value);
                }}
              />
              {isLookingUpIFSC && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              {bankDetails?.is_valid && !isLookingUpIFSC && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>

            {errors.ifsc_code && (
              <p className="text-sm text-red-500">{errors.ifsc_code.message}</p>
            )}

            {ifscError && <p className="text-sm text-red-500">{ifscError}</p>}

            {bankDetails && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{bankDetails.bank_name}</strong>
                  <br />
                  {bankDetails.branch_name}
                  <br />
                  {bankDetails.city}, {bankDetails.state}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Account Type */}
          <div className="space-y-3">
            <Label>
              Account Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={watchedAccountType}
              onValueChange={(value) =>
                setValue("account_type", value as "savings" | "current")
              }
              className="flex flex-col space-y-2"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="current" id="current" />
                <Label htmlFor="current" className="font-normal">
                  Current Account (Recommended for business)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="savings" id="savings" />
                <Label htmlFor="savings" className="font-normal">
                  Savings Account
                </Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              Current accounts are better suited for business transactions
            </p>
          </div>

          {/* Primary Account */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary"
              {...register("is_primary")}
              onCheckedChange={(checked) => setValue("is_primary", !!checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="is_primary" className="text-sm font-normal">
              Set as primary account for payments
            </Label>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms_accepted"
              {...register("terms_accepted")}
              onCheckedChange={(checked) =>
                setValue("terms_accepted", !!checked)
              }
              className={errors.terms_accepted ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            <div className="space-y-1">
              <Label htmlFor="terms_accepted" className="text-sm font-normal">
                I accept the{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-primary underline"
                >
                  terms and conditions
                </a>{" "}
                and authorize OpenXmart to process payments to this account
              </Label>
              {errors.terms_accepted && (
                <p className="text-sm text-red-500">
                  {errors.terms_accepted.message}
                </p>
              )}
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your bank details are encrypted and stored securely. We use
              industry-standard security measures to protect your information.
            </AlertDescription>
          </Alert>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !bankDetails?.is_valid ||
                Object.keys(errors).length > 0 ||
                !watch("account_holder_name") ||
                !watch("account_number") ||
                !watch("confirm_account_number") ||
                !watch("ifsc_code") ||
                !watch("account_type") ||
                !watch("terms_accepted") ||
                watch("account_number") !== watch("confirm_account_number")
              }
              className="flex-1"
            >
              {isSubmitting && (
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isEditing ? "Update Bank Details" : "Add Bank Details"}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
