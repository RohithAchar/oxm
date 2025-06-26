"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Edit,
  Building2,
  Phone,
  MapPin,
  FileText,
  Calendar,
  User,
  Search,
  Filter,
  X,
} from "lucide-react";
import { Database } from "@/utils/supabase/database.types";

type VerificationStatus = Database["public"]["Enums"]["verification_status"];
type Business = Database["public"]["Tables"]["supplier_businesses"]["Row"];

const AdminBusinessVerification = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<VerificationStatus>("PENDING");
  const [message, setMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/businesses");
        setBusinesses(response.data.data);
      } catch (error: any) {
        console.error("Frontend API Error:", error);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message =
            error.response?.data?.message || "Unknown error occurred";
          switch (status) {
            case 400:
              toast.error("Bad Request: " + message);
              break;
            case 401:
              toast.error("Unauthorized: " + message);
              break;
            case 503:
              toast.error("Service Unavailable: " + message);
              break;
            case 500:
              toast.error("Server Error: " + message);
              break;
            default:
              toast.error("Error: " + message);
          }
        } else {
          toast.error(
            "Unexpected error: " + (error.message || error.toString())
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Filtered businesses based on search and filters
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.business_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        business.phone.includes(searchTerm) ||
        business.gst_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || business.status === statusFilter;
      const matchesCity = cityFilter === "ALL" || business.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [businesses, searchTerm, statusFilter, cityFilter]);

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = businesses.map((business) => business.city);
    return [...new Set(cities)].sort();
  }, [businesses]);

  const getStatusBadge = (status: VerificationStatus | null) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleEdit = (business: Business) => {
    setSelectedBusiness(business);
    setNewStatus(business.status || "PENDING");
    setMessage(business.message || "");
    setIsEditDialogOpen(true);
  };

  const handleView = (business: Business) => {
    setSelectedBusiness(business);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedBusiness) return;

    setIsUpdating(true);
    try {
      // API call to update business status
      const response = await axios.patch(
        `/api/businesses/${selectedBusiness.id}/verification`,
        {
          status: newStatus,
          message: message.trim() || null,
          is_verified: newStatus === "APPROVED",
        }
      );

      console.log("Update response:", response.data);

      // Update the local state
      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === selectedBusiness.id
            ? {
                ...business,
                status: newStatus,
                message: message.trim() || null,
                is_verified: newStatus === "APPROVED",
                updated_at: new Date().toISOString(),
              }
            : business
        )
      );

      toast.success(`Business ${newStatus.toLowerCase()} successfully`);
      setIsEditDialogOpen(false);
      setSelectedBusiness(null);
      setMessage("");
    } catch (error: any) {
      console.error("Update error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update business status";
        toast.error(errorMessage);

        // Log detailed error information
        console.error("API Error Details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setCityFilter("ALL");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Business Verification
        </h1>
        <p className="text-gray-600 mt-1">
          Review and manage business verification requests
        </p>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <Label htmlFor="city-filter">City</Label>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Cities</SelectItem>
                  {uniqueCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {filteredBusinesses.length} of {businesses.length}{" "}
              businesses
            </span>
            {(searchTerm || statusFilter !== "ALL" || cityFilter !== "ALL") && (
              <Badge variant="secondary" className="ml-2">
                Filtered
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Applications ({filteredBusinesses.length})
          </CardTitle>
          <CardDescription>
            Manage business verification status and provide feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      {businesses.length === 0
                        ? "No businesses found"
                        : "No businesses match your filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        {business.business_name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {business.city}, {business.state}
                          </div>
                          <div className="text-gray-500">
                            {business.pincode}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{business.phone}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {business.gst_number}
                        </code>
                      </TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(business.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(business)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(business)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Business Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Details
            </DialogTitle>
            <DialogDescription>
              Complete information for {selectedBusiness?.business_name}
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Business Name
                  </Label>
                  <p className="text-sm">{selectedBusiness.business_name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <p className="text-sm">{selectedBusiness.phone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <p className="text-sm">
                  {selectedBusiness.business_address}, {selectedBusiness.city},{" "}
                  {selectedBusiness.state} - {selectedBusiness.pincode}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  GST Number
                </Label>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded block">
                  {selectedBusiness.gst_number}
                </code>
              </div>

              {selectedBusiness.gst_certificate_url && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">GST Certificate</Label>
                  <a
                    href={selectedBusiness.gst_certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View Certificate
                  </a>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Status</Label>
                  <div>{getStatusBadge(selectedBusiness.status)}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verified</Label>
                  <p className="text-sm">
                    {selectedBusiness.is_verified ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {selectedBusiness.message && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Admin Message</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">
                    {selectedBusiness.message}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Created
                  </Label>
                  <p>{formatDate(selectedBusiness.created_at)}</p>
                </div>
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated
                  </Label>
                  <p>{formatDate(selectedBusiness.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Verification Status</DialogTitle>
            <DialogDescription>
              Change the verification status for{" "}
              {selectedBusiness?.business_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value: VerificationStatus) =>
                  setNewStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message for the business owner..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500">
                This message will be visible to the business owner
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBusinessVerification;
