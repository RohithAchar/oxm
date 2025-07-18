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
  Trash2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import { Business } from "@/types/business";
import { useSearchParams } from "next/navigation";

type ProductSchema = Database["public"]["Tables"]["products"]["Insert"];

// Image upload interface
interface ProductImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
  isUploaded: boolean;
  toDelete?: boolean; // Add this field
}

// Form validation schema based on your database schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  brand: z.string().min(1, "Brand is required"),
  category_id: z.string().min(1, "Category is required"),
  subcategory_id: z.string().min(1, "Sub category is required"),
  country_of_origin: z.string().min(1, "Country of origin is required"),
  hsn_code: z.string().nullable().optional(),
  supplier_id: z.string().min(1, "Supplier ID is required"),
  youtube_link: z.string().nullable().optional(),
  breadth: z.coerce.number().min(1, "Breadth is required"),
  height: z.coerce.number().min(1, "Height is required"),
  length: z.coerce.number().min(1, "Length is required"),
  weight: z.coerce.number().min(1, "Wight is required"),
  is_sample_available: z.boolean(),
  is_active: z.boolean(),
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
type ProductSpecificationType =
  Database["public"]["Tables"]["product_specifications"]["Row"];
type ProductSpecificationInsertType = Pick<
  ProductSpecificationType,
  "display_order" | "spec_name" | "spec_unit" | "spec_value"
>;
type TierPricingType =
  Database["public"]["Tables"]["product_tier_pricing"]["Row"];
type TierPricingInsertType = Pick<TierPricingType, "price" | "quantity">;

const AddProductPage = () => {
  const [productSpecifications, setProductSpecifications] = useState<
    ProductSpecificationInsertType[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [tierPricing, setTierPricing] = useState<TierPricingInsertType[]>([]);

  const searchParams = useSearchParams();

  const productIdParam = searchParams.get("id");

  const supabase = createClient();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productIdParam) return;

      const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", productIdParam)
        .single();

      if (product) {
        // Set the selected category ID for subcategory filtering
        setSelectedCategoryId(product.category_id);

        form.reset({
          name: product.name || "",
          description: product.description || "",
          brand: product.brand || "",
          category_id: product.category_id || "",
          subcategory_id: product.subcategory_id || "",
          country_of_origin: product.country_of_origin || "",
          hsn_code: product.hsn_code || "",
          supplier_id: product.supplier_id || "",
          youtube_link: product.youtube_link || "",
          breadth: product.breadth || undefined,
          height: product.height || undefined,
          length: product.length || undefined,
          weight: product.weight || undefined,
          is_sample_available: product.is_sample_available ?? true,
          is_active: product.is_active ?? true,
        });

        // Fetch existing product images
        const { data: images } = await supabase
          .from("product_images")
          .select("*")
          .eq("product_id", productIdParam)
          .order("display_order", { ascending: true });

        if (images) {
          const formattedImages = images.map((img, index) => ({
            id: img.id,
            url: img.image_url,
            displayOrder: img.display_order ?? index,
            isUploaded: true,
          }));
          setProductImages(formattedImages);
        }
      }

      const { data: specifications } = await supabase
        .from("product_specifications")
        .select("*")
        .eq("product_id", productIdParam)
        .order("display_order", { ascending: true });

      const { data: tierPricingData } = await supabase
        .from("product_tier_pricing")
        .select("*")
        .eq("product_id", productIdParam)
        .order("quantity", { ascending: true });

      if (tierPricingData) {
        setTierPricing(tierPricingData);
      }

      if (specifications) {
        setProductSpecifications(specifications);
      }
    };

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

        if (response.data && response.data.categories) {
          const mainCategories = response.data.categories.filter(
            (category: Category) => category.parent_id === null
          );

          const subCategories = response.data.categories.filter(
            (category: Category) => category.parent_id !== null
          );

          setSubCategories(subCategories);
          setCategories(mainCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    fetchCategories();
    fetchUser();
  }, []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: business?.business_name || "",
      category_id: "",
      subcategory_id: "",
      country_of_origin: "",
      hsn_code: "",
      supplier_id: business?.profile_id || "",
      youtube_link: "",
      breadth: undefined,
      height: undefined,
      length: undefined,
      weight: undefined,
      is_sample_available: true,
      is_active: true,
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
      const imageToRemove = prev[index];

      // If it's an existing image (has ID), mark for deletion instead of removing
      if (imageToRemove.id && imageToRemove.isUploaded) {
        const newImages = prev.map((img, i) =>
          i === index ? { ...img, toDelete: true } : img
        );
        return newImages;
      }

      // If it's a new image, remove it completely
      const newImages = prev.filter((_, i) => i !== index);
      return newImages.map((img, i) => ({ ...img, displayOrder: i }));
    });
  };

  const updateExistingImages = async (productId: string) => {
    const imagesToDelete = productImages.filter(
      (img) => img.toDelete && img.id
    );
    const imagesToUpdate = productImages.filter(
      (img) => !img.toDelete && img.id
    );

    // Delete marked images
    for (const image of imagesToDelete) {
      await axios.delete(`/api/product-images/${image.id}`);
    }

    // Update display orders for remaining existing images
    for (const image of imagesToUpdate) {
      await axios.patch(`/api/product-images/${image.id}`, {
        display_order: image.displayOrder,
      });
    }
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

  // key specification
  const addSpecification = () => {
    const newSpec: ProductSpecificationInsertType = {
      spec_name: "",
      spec_value: "",
      spec_unit: null,
      display_order: productSpecifications.length,
    };
    setProductSpecifications([...productSpecifications, newSpec]);
  };
  const removeSpecification = (index: number) => {
    const updatedSpecs = productSpecifications.filter((_, i) => i !== index);
    // Update display orders
    const reorderedSpecs = updatedSpecs.map((spec, i) => ({
      ...spec,
      display_order: i,
    }));
    setProductSpecifications(reorderedSpecs);
  };
  const updateSpecification = (
    index: number,
    field: keyof ProductSpecificationType,
    value: string | number | null
  ) => {
    const updatedSpecs = productSpecifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setProductSpecifications(updatedSpecs);
  };
  const saveProductSpecifications = async (productId: string) => {
    if (productSpecifications.length === 0) return;

    try {
      // First, delete existing specifications for this product
      await axios.delete(`/api/products/${productId}/specifications`);

      // Then create new specifications
      const specPromises = productSpecifications.map((spec) =>
        axios.post("/api/product-specifications", {
          ...spec,
          product_id: productId,
        })
      );

      await Promise.all(specPromises);
    } catch (error) {
      console.error("Error saving specifications:", error);
      throw error;
    }
  };

  // Tier pricing
  const addTierPricing = () => {
    const newTier: TierPricingInsertType = {
      quantity: 1,
      price: 0,
    };
    setTierPricing([...tierPricing, newTier]);
  };
  const removeTierPricing = (index: number) => {
    const updatedTiers = tierPricing.filter((_, i) => i !== index);
    setTierPricing(updatedTiers);
  };
  const updateTierPricing = (
    index: number,
    field: keyof TierPricingInsertType,
    value: number
  ) => {
    const updatedTiers = tierPricing.map((tier, i) =>
      i === index ? { ...tier, [field]: value } : tier
    );
    setTierPricing(updatedTiers);
  };
  const saveTierPricing = async (productId: string) => {
    if (tierPricing.length === 0) return;

    try {
      // First, delete existing tier pricing for this product
      await axios.delete(`/api/products/${productId}/tier-pricing`);

      // Then create new tier pricing
      const tierPromises = tierPricing.map((tier) =>
        axios.post("/api/product-tier-pricing", {
          ...tier,
          product_id: productId,
        })
      );

      await Promise.all(tierPromises);
    } catch (error) {
      console.error("Error saving tier pricing:", error);
      throw error;
    }
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
        subcategory_id: data.subcategory_id || null,
        country_of_origin: data.country_of_origin || null,
        hsn_code: data.hsn_code || null,
        supplier_id: data.supplier_id || null,
        youtube_link: data.youtube_link || null,
        breadth: data.breadth || null,
        height: data.height || null,
        length: data.length || null,
        weight: data.weight || null,
        is_active: data.is_active || null,
        is_sample_available: data.is_sample_available || null,
      };

      // Create or update product
      let productId;
      if (!productIdParam) {
        const productResponse = await axios.post("/api/products", productData);
        productId = productResponse.data.id;
      } else {
        // Update existing product
        productId = productIdParam;
        await axios.patch(`/api/products/${productIdParam}`, productData);
      }

      // Save specifications first (for both create and update)
      try {
        await saveProductSpecifications(productId);
      } catch (specError) {
        console.error("Specification save error:", specError);
        toast.warning("Product saved but specifications failed to save");
      }

      // Save tier pricing first (for both create and update)
      try {
        await saveTierPricing(productId);
      } catch (tierPricingError) {
        console.error("Tier pricing save error:", tierPricingError);
        toast.warning("Product saved but tier pricing failed to save");
      }

      // Handle existing images for updates
      if (productIdParam) {
        await updateExistingImages(productId);
      }

      // Handle new images (both create and update scenarios)
      const newImages = productImages.filter(
        (img) => !img.isUploaded && !img.toDelete
      );

      if (newImages.length > 0) {
        setIsUploadingImages(true);
        toast.info("Uploading new images...");

        try {
          // Upload only new images
          const uploadedUrls: string[] = [];
          for (const image of newImages) {
            if (image.file) {
              const formData = new FormData();
              formData.append("file", image.file);
              formData.append("productId", productId);
              formData.append("displayOrder", image.displayOrder.toString());

              const uploadResponse = await axios.post(
                "/api/upload/product-image",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              uploadedUrls.push(uploadResponse.data.url);
            }
          }

          // Save new image metadata
          await saveProductImages(productId, uploadedUrls);

          toast.success(
            productIdParam
              ? "Product updated successfully!"
              : "Product created successfully!"
          );
        } catch (imageError) {
          console.error("Image upload error:", imageError);
          toast.warning("Product saved but some images failed to upload");
        } finally {
          setIsUploadingImages(false);
        }
      } else {
        toast.success(
          productIdParam
            ? "Product updated successfully!"
            : "Product created successfully!"
        );
      }

      // Reset form only if creating new product
      if (!productIdParam) {
        form.reset();
        setProductImages([]);
        setProductSpecifications([]);
        setTierPricing([]);
      }
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

  // Replace the existing return statement with this Apple-styled version:

  return (
    <div className="min-h-screen bg-gray-50 rounded-lg">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            {productIdParam ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Create a beautiful product listing with all the details your
            customers need.
          </p>
        </div>

        <Form {...form}>
          <div className="space-y-8">
            {/* Product Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  Product Images
                </h2>
              </div>
              <div className="p-8 space-y-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-300 transition-colors">
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
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-base text-gray-700">
                      <span className="font-medium text-blue-600">
                        Choose files
                      </span>{" "}
                      or drag and drop
                    </div>
                    <div className="text-sm text-gray-500">
                      PNG, JPG, JPEG up to 1MB each
                    </div>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {productImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productImages
                      .filter((img) => !img.toDelete)
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative group rounded-xl overflow-hidden cursor-move shadow-sm border border-gray-200"
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
                          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <Move className="h-4 w-4 text-white" />
                          </div>

                          {/* Display Order Badge */}
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  Basic Information
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            {...field}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                          />
                        </FormControl>
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed product description"
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Brand
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter brand name"
                            {...field}
                            value={field.value || business?.business_name || ""}
                            disabled
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 text-base"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Category
                        </FormLabel>
                        <Select
                          onValueChange={(value: string) => {
                            field.onChange(value);
                            setSelectedCategoryId(value);
                            form.setValue("subcategory_id", "");
                          }}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id}
                                className="text-base"
                              >
                                {category.name}
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
                    name="subcategory_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Sub Category
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={!selectedCategoryId}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base disabled:bg-gray-50">
                              <SelectValue
                                placeholder={
                                  selectedCategoryId
                                    ? "Select sub category"
                                    : "Select category first"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {subCategories
                              .filter(
                                (category) =>
                                  category.parent_id === selectedCategoryId
                              )
                              .map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="text-base"
                                >
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
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Tag className="h-4 w-4 text-orange-600" />
                  </div>
                  Pricing & Inventory
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Tier Pricing
                      </h3>
                      <p className="text-sm text-gray-600">
                        Set different prices based on quantity
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTierPricing}
                      className="rounded-full border-gray-200 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {tierPricing.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                      <Tag className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-base font-medium mb-1">
                        No tier pricing added yet
                      </p>
                      <p className="text-sm">
                        Click the + button to add your first pricing tier
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tierPricing.map((tier, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="cursor-move text-gray-400">
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Minimum Quantity
                              </label>
                              <Input
                                type="number"
                                min="1"
                                placeholder="e.g., 100"
                                value={tier.quantity}
                                onChange={(e) =>
                                  updateTierPricing(
                                    index,
                                    "quantity",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price per Unit (₹)
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="e.g., 25.00"
                                value={tier.price}
                                onChange={(e) =>
                                  updateTierPricing(
                                    index,
                                    "price",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTierPricing(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="is_sample_available"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-gray-200 p-6 bg-gray-50">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-medium text-gray-900">
                            Sample Available
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            Allow customers to order samples
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-xl border border-gray-200 p-6 bg-gray-50">
                        <div className="space-y-1">
                          <FormLabel className="text-base font-medium text-gray-900">
                            Product Active
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            Make product visible to customers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  Additional Details
                </h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country_of_origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Country of Origin
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                            {countries.map((country) => (
                              <SelectItem
                                key={country}
                                value={country}
                                className="text-base"
                              >
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          HSN Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter HSN code"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 mt-1">
                          Harmonized System of Nomenclature code
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          YouTube Link
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter YouTube link"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500 mt-1">
                          Link to the YouTube video of the product
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Supplier ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter supplier ID"
                          {...field}
                          value={field.value || ""}
                          disabled
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm bg-gray-50 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dimensions & Weight */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Ruler className="h-4 w-4 text-indigo-600" />
                  </div>
                  Dimensions & Weight
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Length (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Breadth (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Height (cm)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Weight (kg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Tag className="h-4 w-4 text-blue-600" />
                  </div>
                  Key Specifications
                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSpecification}
                      className="rounded-full border-gray-200 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </h2>
              </div>

              <div className="p-8">
                {productSpecifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Tag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No specifications added yet
                    </p>
                    <p className="text-sm">
                      Click the + button to add your first specification
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {productSpecifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="cursor-move text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Specification Name
                            </label>
                            <Input
                              placeholder="e.g., Material, Color, Size"
                              value={spec.spec_name}
                              onChange={(e) =>
                                updateSpecification(
                                  index,
                                  "spec_name",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Value
                            </label>
                            <Input
                              placeholder="e.g., Stainless Steel, Red, Large"
                              value={spec.spec_value}
                              onChange={(e) =>
                                updateSpecification(
                                  index,
                                  "spec_value",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit (Optional)
                            </label>
                            <Input
                              placeholder="e.g., cm, kg, pieces"
                              value={spec.spec_unit || ""}
                              onChange={(e) =>
                                updateSpecification(
                                  index,
                                  "spec_unit",
                                  e.target.value || null
                                )
                              }
                              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpecification(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setProductImages([]);
                }}
                disabled={isLoading}
                className="px-6 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Reset Form
              </Button>
              <Button
                type="button"
                disabled={isLoading || isUploadingImages}
                onClick={form.handleSubmit(onSubmit)}
                className="px-8 py-2 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isLoading || isUploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isUploadingImages
                      ? "Uploading Images..."
                      : productIdParam
                      ? "Updating Product..."
                      : "Adding Product..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {productIdParam ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddProductPage;
