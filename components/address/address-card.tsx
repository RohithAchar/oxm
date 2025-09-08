"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAddress } from "@/types/address";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Star,
  Truck,
  CreditCard,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteAddress,
  setPrimaryAddress,
  setDefaultShippingAddress,
  setDefaultBillingAddress,
} from "@/lib/client/addressClient";

interface AddressCardProps {
  address: UserAddress;
}

export function AddressCard({ address }: AddressCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAddress(address.id);
      toast.success("Address deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete address");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleSetPrimary = async () => {
    try {
      await setPrimaryAddress(address.id);
      toast.success("Primary address updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update primary address");
      console.error("Set primary error:", error);
    }
  };

  const handleSetDefaultShipping = async () => {
    try {
      await setDefaultShippingAddress(address.id);
      toast.success("Default shipping address updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update default shipping address");
      console.error("Set default shipping error:", error);
    }
  };

  const handleSetDefaultBilling = async () => {
    try {
      await setDefaultBillingAddress(address.id);
      toast.success("Default billing address updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update default billing address");
      console.error("Set default billing error:", error);
    }
  };

  const getAddressTypeBadge = () => {
    switch (address.address_type) {
      case "shipping":
        return <Badge variant="secondary">Shipping</Badge>;
      case "billing":
        return <Badge variant="outline">Billing</Badge>;
      case "both":
        return <Badge>Both</Badge>;
      default:
        return null;
    }
  };

  const formatAddress = () => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.landmark,
      address.area,
      address.city,
      address.state,
      address.postal_code || address.pincode,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <>
      <Card className="relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{address.full_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getAddressTypeBadge()}
                  {address.is_primary && (
                    <Badge variant="default" className="bg-yellow-500">
                      <Star className="w-3 h-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/addresses/${address.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                {!address.is_primary && (
                  <DropdownMenuItem onClick={handleSetPrimary}>
                    <Star className="w-4 h-4 mr-2" />
                    Set as Primary
                  </DropdownMenuItem>
                )}

                {!address.is_default_shipping && (
                  <DropdownMenuItem onClick={handleSetDefaultShipping}>
                    <Truck className="w-4 h-4 mr-2" />
                    Set as Default Shipping
                  </DropdownMenuItem>
                )}

                {!address.is_default_billing && (
                  <DropdownMenuItem onClick={handleSetDefaultBilling}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Set as Default Billing
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {formatAddress()}
            </div>

            {address.phone_number && (
              <div className="text-sm">
                <span className="text-muted-foreground">Phone: </span>
                {address.phone_number}
              </div>
            )}

            {address.email && (
              <div className="text-sm">
                <span className="text-muted-foreground">Email: </span>
                {address.email}
              </div>
            )}

            {address.delivery_instructions && (
              <div className="text-sm">
                <span className="text-muted-foreground">
                  Delivery Instructions:{" "}
                </span>
                {address.delivery_instructions}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              {address.is_default_shipping && (
                <Badge variant="secondary" className="text-xs">
                  <Truck className="w-3 h-3 mr-1" />
                  Default Shipping
                </Badge>
              )}

              {address.is_default_billing && (
                <Badge variant="secondary" className="text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  Default Billing
                </Badge>
              )}

              {address.is_verified && (
                <Badge variant="default" className="text-xs bg-green-500">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
