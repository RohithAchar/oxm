"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, Eye, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  file_name: string;
  file_size: number;
  dimensions: string | null;
  alt_text: string | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface SelectedFile {
  file: File;
  id: string;
  preview: string;
  name: string;
  size: string;
}

const BannerUploadPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch banners from Supabase
  const fetchBanners = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Handle file selection
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const validFiles = files.filter((file) => {
        const validTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        const maxSize = 10 * 1024 * 1024; // 10MB
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      if (validFiles.length !== files.length) {
        toast.error(
          "Some files were rejected. Only JPEG, PNG, and WebP files under 10MB are allowed."
        );
      }

      const fileObjects: SelectedFile[] = validFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      }));

      setSelectedFiles((prev) => [...prev, ...fileObjects]);
    },
    []
  );

  // Remove selected file
  const removeSelectedFile = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  }, []);

  // Get image dimensions
  const getImageDimensions = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
        URL.revokeObjectURL(img.src); // Clean up the object URL
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Upload banners to Supabase
  const uploadBanners = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedBanners: Banner[] = [];
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const fileObj = selectedFiles[i];
        const fileName = `${Date.now()}-${fileObj.file.name}`;

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("banner-uploads")
          .upload(fileName, fileObj.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("banner-uploads").getPublicUrl(fileName);

        // Get image dimensions
        const dimensions = await getImageDimensions(fileObj.file);

        // Insert banner record
        const { data: bannerData, error: insertError } = await supabase
          .from("banners")
          .insert({
            title: fileObj.name.replace(/\.[^/.]+$/, ""),
            image_url: publicUrl,
            file_name: fileName,
            file_size: fileObj.file.size,
            dimensions,
            alt_text: fileObj.name.replace(/\.[^/.]+$/, ""),
            is_active: true,
            display_order: 0,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        uploadedBanners.push(bannerData);
        setUploadProgress(((i + 1) / totalFiles) * 100);
      }

      setBanners((prev) => [...uploadedBanners, ...prev]);
      setSelectedFiles([]);
      toast.success(
        `Successfully uploaded ${uploadedBanners.length} banner(s)`
      );
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload banners");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete banner
  const deleteBanner = async (banner: Banner) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("banner-uploads")
        .remove([banner.file_name]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("banners")
        .delete()
        .eq("id", banner.id);

      if (dbError) throw dbError;

      setBanners((prev) => prev.filter((b) => b.id !== banner.id));
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete banner");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            Banner Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload and manage your ecommerce landing page banners with ease
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl font-medium">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
              Upload New Banners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Input */}
            <div className="space-y-2">
              <Label
                htmlFor="banner-upload"
                className="text-sm font-medium text-gray-700"
              >
                Select Banner Images
              </Label>
              <div className="relative">
                <Input
                  id="banner-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:font-medium border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP. Maximum size: 10MB per file.
              </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <Button
                    onClick={() => setSelectedFiles([])}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear All
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFiles.map((fileObj) => (
                    <div key={fileObj.id} className="relative group">
                      <div className="aspect-[16/5] bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={fileObj.preview}
                          alt={fileObj.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                        <Button
                          onClick={() => removeSelectedFile(fileObj.id)}
                          size="sm"
                          variant="destructive"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileObj.name}
                        </p>
                        <p className="text-xs text-gray-500">{fileObj.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Uploading banners...</span>
                  <span className="font-medium">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={uploadBanners}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors duration-200"
            >
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} Banner${
                    selectedFiles.length !== 1 ? "s" : ""
                  }`}
            </Button>
          </CardContent>
        </Card>

        {/* Existing Banners */}
        <Card className="border-0 shadow-lg shadow-black/5 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xl font-medium">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Image className="w-4 h-4 text-green-600" />
                </div>
                Uploaded Banners ({banners.length})
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {banners.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">
                  No banners uploaded yet
                </p>
                <p className="text-sm">
                  Upload your first banner to get started
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="aspect-[16/5] bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <img
                        src={banner.image_url}
                        alt={banner.alt_text || banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {banner.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {banner.dimensions || "Unknown"} •{" "}
                          {(banner.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600"
                        >
                          {banner.created_at
                            ? new Date(banner.created_at).toLocaleDateString()
                            : "Unknown date"}
                        </Badge>
                        {banner.is_active && (
                          <Badge className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-gray-200 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{banner.title}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              <img
                                src={banner.image_url}
                                alt={banner.alt_text || banner.title}
                                className="w-full rounded-lg"
                              />
                              <div className="mt-4 text-sm text-gray-600">
                                <p>
                                  <strong>Dimensions:</strong>{" "}
                                  {banner.dimensions || "Unknown"}
                                </p>
                                <p>
                                  <strong>File Size:</strong>{" "}
                                  {(banner.file_size / (1024 * 1024)).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </p>
                                <p>
                                  <strong>Created:</strong>{" "}
                                  {banner.created_at
                                    ? new Date(
                                        banner.created_at
                                      ).toLocaleString()
                                    : "Unknown"}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBanner(banner)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BannerUploadPage;
