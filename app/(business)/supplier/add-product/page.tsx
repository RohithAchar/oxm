"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Database } from "@/utils/supabase/database.types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Package,
  Ruler,
  Globe,
  Tag,
  Save,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { Business } from "@/types/business";

type ProductSchema = Database["public"]["Tables"]["products"]["Insert"];

// Image upload interface
interface ProductImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
  isUploaded: boolean;
}

// Form validation schema based on your database schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().min(1, "SKU is required"),
  minimum_order_quantity: z.coerce
    .number()
    .min(1, "Minimum order quantity must be at least 1"),
  sample_price: z.coerce.number().min(0, "Sample price must be 0 or greater"),
  brand: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  country_of_origin: z.string().nullable().optional(),
  hsn_code: z.string().nullable().optional(),
  supplier_id: z.string().nullable().optional(),
  breadth: z.coerce.number().min(0).nullable().optional(),
  height: z.coerce.number().min(0).nullable().optional(),
  length: z.coerce.number().min(0).nullable().optional(),
  weight: z.coerce.number().min(0).nullable().optional(),
  is_active: z.boolean(),
  is_sample_available: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const countries = [
  "India",
  "United States",
  "China",
  "Germany",
  "Japan",
  "United Kingdom",
  "France",
  "Italy",
  "Brazil",
  "Canada",
  "Australia",
  "South Korea",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "Other",
];

type Category = Database["public"]["Tables"]["categories"]["Row"];

const AddProductPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data: response, error } = await supabase.auth.getUser();
        const res = await axios.get(`/api/businesses/${response.user?.id}`);

        const businessData = res.data.data;

        // ✅ Update form values with fetched business
        form.reset({
          ...form.getValues(), // keep user-typed data
          brand: businessData.business_name || "",
          supplier_id: businessData.profile_id || "",
        });

        setBusiness(businessData);
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
              // Optionally redirect to login
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
          // Non-Axios errors
          toast.error("Unexpected error: " + error.message || error.toString());
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/categories");

        const mainCategories = response.data.categories.filter(
          (category: Category) => category.parent_id === null
        );

        setCategories(mainCategories);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchUser();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      minimum_order_quantity: 1,
      sample_price: 0,
      brand: business?.business_name || "",
      category_id: "",
      country_of_origin: "",
      hsn_code: "",
      supplier_id: business?.profile_id || "",
      breadth: undefined,
      height: undefined,
      length: undefined,
      weight: undefined,
      is_active: true,
      is_sample_available: false,
    },
  });

  // Image upload functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const newImages: ProductImage[] = [];
    const rejectedFiles: string[] = [];

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith("image/")) {
        rejectedFiles.push(`${file.name} - Invalid file type`);
        return;
      }

      if (file.size > maxSizeInBytes) {
        rejectedFiles.push(`${file.name} - File too large (max 1MB)`);
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      newImages.push({
        file,
        url: imageUrl,
        displayOrder: productImages.length + index,
        isUploaded: false,
      });
    });

    if (rejectedFiles.length > 0) {
      toast.error(`Some files were rejected:\n${rejectedFiles.join("\n")}`);
    }

    if (newImages.length > 0) {
      setProductImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} image(s) added successfully`);
    }
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // Reorder display orders
      return newImages.map((img, i) => ({ ...img, displayOrder: i }));
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newImages = [...productImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    // Update display orders
    const reorderedImages = newImages.map((img, index) => ({
      ...img,
      displayOrder: index,
    }));

    setProductImages(reorderedImages);
    setDraggedIndex(null);
  };

  const uploadImagesToStorage = async (
    productId: string
  ): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const image of productImages) {
      if (image.file) {
        try {
          // Create form data for file upload
          const formData = new FormData();
          formData.append("file", image.file);
          formData.append("productId", productId);
          formData.append("displayOrder", image.displayOrder.toString());

          // Upload to your storage service (adjust endpoint as needed)
          const uploadResponse = await axios.post(
            "/api/upload/product-image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Upload response:", uploadResponse.data);

          uploadedUrls.push(uploadResponse.data.url);
        } catch (error) {
          console.error("Failed to upload image:", error);
          throw new Error(`Failed to upload image: ${image.file.name}`);
        }
      }
    }

    return uploadedUrls;
  };

  const saveProductImages = async (productId: string, imageUrls: string[]) => {
    const imagePromises = imageUrls.map((url, index) =>
      axios.post("/api/product-images", {
        product_id: productId,
        image_url: url,
        display_order: index,
      })
    );

    await Promise.all(imagePromises);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      // Convert form data to match ProductSchema type
      const productData: ProductSchema = {
        ...data,
        // Convert empty strings to null for optional fields
        brand: data.brand || null,
        category_id: data.category_id || null,
        country_of_origin: data.country_of_origin || null,
        hsn_code: data.hsn_code || null,
        supplier_id: data.supplier_id || null,
        breadth: data.breadth || null,
        height: data.height || null,
        length: data.length || null,
        weight: data.weight || null,
      };

      // Create product first
      const productResponse = await axios.post("/api/products", productData);
      const productId = productResponse.data.id;

      console.log("Product ID:", productId);

      // Upload images if any exist
      if (productImages.length > 0) {
        setIsUploadingImages(true);
        toast.info("Uploading product images...");

        try {
          const imageUrls = await uploadImagesToStorage(productId);
          await saveProductImages(productId, imageUrls);
          toast.success("Product and images added successfully!");
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          toast.warning("Product created but some images failed to upload");
        } finally {
          setIsUploadingImages(false);
        }
      } else {
        toast.success("Product added successfully!");
      }

      // Reset form and images
      form.reset();
      setProductImages([]);
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
        toast.error("Unexpected error: " + error.message || error.toString());
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </div>
                  <div className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 1MB each
                  </div>
                </label>
              </div>

              {/* Image Preview Grid */}
              {productImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <div className="aspect-square">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Image Controls */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Move className="h-4 w-4 text-white" />
                      </div>

                      {/* Display Order Badge */}
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {productImages.length > 0 && (
                <div className="text-sm text-gray-600">
                  <p>
                    💡 Drag images to reorder them. The first image will be the
                    main product image.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormDescription>
                        Stock Keeping Unit - unique identifier
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter brand name"
                          {...field}
                          value={field.value || business?.business_name || ""}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minimum_order_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Order Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter MOQ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sample_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sample Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter sample price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Make this product available for ordering
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_sample_available"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Sample Available
                        </FormLabel>
                        <FormDescription>
                          Allow customers to order samples
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="country_of_origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Origin</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hsn_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HSN Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter HSN code"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Harmonized System of Nomenclature code
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter supplier ID"
                        {...field}
                        value={field.value || ""}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dimensions & Weight */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Dimensions & Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="cm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breadth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breadth</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="cm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="cm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="kg"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setProductImages([]);
              }}
              disabled={isLoading}
            >
              Reset Form
            </Button>
            <Button
              type="button"
              disabled={isLoading || isUploadingImages}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isLoading || isUploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isUploadingImages
                    ? "Uploading Images..."
                    : "Adding Product..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddProductPage;
