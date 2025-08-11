"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";

import { Database } from "@/utils/supabase/database.types";
import { Card, CardContent } from "../ui/card";
import { productFormSchema } from "./types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Check,
  ImageIcon,
  Info,
  MoveDown,
  MoveUp,
  Plus,
  Tag,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { addProduct } from "@/lib/controller/product/productOperations";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Badge } from "../ui/badge";

type BusinessSchema =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];
type CategorySchema = Database["public"]["Tables"]["categories"]["Row"];
type TagSchema = Database["public"]["Tables"]["tags"]["Row"];

export const ProductForm = ({
  business,
  categories,
  tags,
}: {
  business: BusinessSchema;
  categories: CategorySchema[];
  tags: TagSchema[];
}) => {
  const [tagInput, setTagInput] = useState("");
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      quantity: undefined,
      price_per_unit: undefined,
      total_price: undefined,
      is_bulk_pricing: false,
      tags: [],
      images: [
        {
          image: undefined,
          display_order: 1,
        },
      ],
      name: "",
      description: "",
      brand: business.business_name,
      categoryId: "",
      subCategoryId: "",
      length: undefined,
      breadth: undefined,
      height: undefined,
      weight: undefined,
      tiers: [
        {
          qty: undefined,
          price: undefined,
          isActive: true,
        },
      ],
      sample_available: true,
      is_active: true,
      country_of_origin: "",
      hsn_code: "",
      youtube_link: "",
      supplier_id: business.profile_id || "",
      specifications: [
        {
          spec_name: "",
          spec_value: "",
          spec_unit: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  const {
    fields: specifications,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  const {
    fields: images,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    try {
      await addProduct(business.profile_id!, values);
      toast.success("Product added successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to add product. Please try again or contact support");
    } finally {
    }
  }

  const selectedCategoryId = form.watch("categoryId");
  const isSampleAvailable = form.watch("sample_available");
  const sampleQuantity = form.watch("quantity");
  const samplePricePerUnit = form.watch("price_per_unit");

  const sanitizeTag = (tag: string): string => {
    return tag
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const filteredTags = useMemo(() => {
    if (!tagInput.trim()) return tags;

    const searchTerm = tagInput.toLowerCase();
    return tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm));
  }, [tagInput, tags]);

  const handleTagAdd = (tagName: string) => {
    const sanitized = sanitizeTag(tagName);
    if (!sanitized) return;

    const currentTags = form.getValues("tags") || [];
    if (currentTags.includes(sanitized)) {
      toast.error("Tag already exists");
      return;
    }

    if (currentTags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }

    form.setValue("tags", [...currentTags, sanitized]);
    setTagInput("");
    setIsTagPopoverOpen(false);
  };

  const handleTagRemove = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 lg:space-y-12"
          >
            {/* Image Upload Section - Insert after Basic Information */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Product Images
                </h2>
                <p className="text-sm text-muted-foreground">
                  Upload up to 5 product images. First image will be the main
                  display image.
                </p>
              </div>

              <div className="space-y-4">
                {images.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-3 lg:p-4 bg-muted/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <h4 className="text-sm font-medium">
                        Image {index + 1} {index === 0 && "(Main Image)"}
                      </h4>
                      <div className="flex items-center gap-2">
                        {images.length > 1 && index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentOrder = form.getValues(
                                `images.${index}.display_order`
                              );
                              const prevOrder = form.getValues(
                                `images.${index - 1}.display_order`
                              );
                              form.setValue(
                                `images.${index}.display_order`,
                                prevOrder
                              );
                              form.setValue(
                                `images.${index - 1}.display_order`,
                                currentOrder
                              );
                              // Swap the items in the array
                              const temp = images[index];
                              images[index] = images[index - 1];
                              images[index - 1] = temp;
                            }}
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                        )}
                        {images.length > 1 && index < images.length - 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentOrder = form.getValues(
                                `images.${index}.display_order`
                              );
                              const nextOrder = form.getValues(
                                `images.${index + 1}.display_order`
                              );
                              form.setValue(
                                `images.${index}.display_order`,
                                nextOrder
                              );
                              form.setValue(
                                `images.${index + 1}.display_order`,
                                currentOrder
                              );
                              // Swap the items in the array
                              const temp = images[index];
                              images[index] = images[index + 1];
                              images[index + 1] = temp;
                            }}
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                        )}
                        {images.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`images.${index}.image`}
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Upload Image*</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <label className="flex flex-col items-center justify-center w-full sm:w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 shrink-0">
                                  {value ? (
                                    <div className="relative w-full h-full">
                                      <img
                                        src={URL.createObjectURL(value)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          onChange(undefined);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <Upload className="w-6 sm:w-8 h-6 sm:h-8 mb-2 text-gray-400" />
                                      <p className="text-xs text-gray-500 text-center px-2">
                                        Click to upload
                                      </p>
                                    </div>
                                  )}
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        onChange(file);
                                      }
                                    }}
                                    {...field}
                                  />
                                </label>

                                {value && (
                                  <div className="flex-1 space-y-2 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {value.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(value.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {value.type}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload JPEG, PNG, or WEBP image under 500KB
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`images.${index}.display_order`}
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel>Display Order*</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              max="5"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                              className="max-w-xs"
                            />
                          </FormControl>
                          <FormDescription>
                            Order in which this image will be displayed (1 =
                            first)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                {images.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendImage({
                        image: undefined,
                        display_order: images.length + 1,
                      })
                    }
                    className="flex items-center gap-2 w-full"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Another Image</span>
                    <span className="sm:hidden">Add Image</span> (
                    {images.length}/5)
                  </Button>
                )}

                {images.length > 1 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Image Display Tips</p>
                        <ul className="text-xs space-y-1">
                          <li>• First image is your main product image</li>
                          <li>• Use high-quality, well-lit photos</li>
                          <li>• Show different angles and details</li>
                          <li>• Use the move buttons to reorder images</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Basic Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Provide basic details about the product.
                </p>
              </div>
              <div className="space-y-6 lg:space-y-8 bg-muted/50 border rounded-lg p-3 lg:p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name (e.g., iPhone 14 Pro Max)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a clear and descriptive name for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product features, specifications, and benefits (10-500 characters)"
                          {...field}
                          className="min-h-[100px] resize-y"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of your product (10-500
                        characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand*</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand name" {...field} disabled />
                      </FormControl>
                      <FormDescription>
                        Brand is automatically set based on your business name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full bg-primary-foreground">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                {categories.map((category) => {
                                  if (category.parent_id === null)
                                    return (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </SelectItem>
                                    );
                                })}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Choose the main category that best describes your
                          product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Category*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!selectedCategoryId}
                          >
                            <SelectTrigger className="w-full bg-primary-foreground">
                              <SelectValue placeholder="Select a sub-category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sub-Category</SelectLabel>
                                {selectedCategoryId &&
                                  categories
                                    .filter(
                                      (c) => c.parent_id === selectedCategoryId
                                    )
                                    .map((category) => (
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </SelectItem>
                                    ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Select a specific sub-category after choosing the main
                          category.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">MOQ price</h2>
                <p className="text-sm text-muted-foreground">
                  Specify the minimum order quantity and price for each tier.
                </p>
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border rounded-lg p-3 lg:p-4 bg-muted/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Pricing Tier {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 self-start sm:self-center"
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.qty`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Minimum order
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === "" ? undefined : Number(value)
                                      );
                                    }}
                                    value={field.value}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    units
                                  </span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Minimum order quantity for this pricing tier.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tiers.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Price per unit
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    ₹
                                  </span>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-8"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      field.onChange(
                                        value === "" ? undefined : Number(value)
                                      );
                                    }}
                                    value={field.value}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Price per unit.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Visual indicator for bulk discount */}
                      {index > 0 && (
                        <div className="mt-3 text-xs text-primary bg-primary/10 px-2 py-1 rounded-md inline-block">
                          💰 Bulk discount tier
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        qty:
                          fields.length > 0
                            ? Math.max(...fields.map((f) => f.qty || 0)) + 1
                            : 1,
                        price: undefined,
                      })
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Add Another Pricing Tier
                    </span>
                    <span className="sm:hidden">Add Tier</span>
                  </Button>

                  {fields.length === 0 && (
                    <Button
                      type="button"
                      onClick={() =>
                        append({
                          qty: 1,
                          price: 0,
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Add First Pricing Tier
                      </span>
                      <span className="sm:hidden">Add First Tier</span>
                    </Button>
                  )}
                </div>

                {fields.length > 1 && (
                  <div className="bg-secondary border rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-secondary-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-secondary-foreground">
                        <p className="font-medium mb-1">Bulk Pricing Active</p>
                        <p>
                          Customers will automatically get the best price based
                          on their order quantity. Lower quantities = higher
                          per-unit price.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">Inventory</h2>
                <p className="text-sm text-muted-foreground">
                  Specify the inventory details for your product.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg">
                  <FormField
                    control={form.control}
                    name="sample_available"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <FormLabel>Sample Availability</FormLabel>
                            <FormDescription>
                              Specify whether the product is available for
                              sample purchases.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <FormLabel>Product Active</FormLabel>
                            <FormDescription>
                              Specify whether the product is active or inactive.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {isSampleAvailable && (
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <h2 className="text-lg lg:text-xl font-semibold">
                    Sample Order Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Specify the sample order details for your product.
                  </p>
                </div>

                {/* Fields here */}
                <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>MOQ for Sample</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify the quantity of your product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price_per_unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sample Price / unit</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            Specify the price per unit of your product.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={"total_price"}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              value={
                                (sampleQuantity ?? 0) *
                                (samplePricePerUnit ?? 0)
                              }
                              disabled
                            />
                          </FormControl>
                          <FormDescription>
                            Total price of your product.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_bulk_pricing"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Adjust Cost in Bulk?
                            </FormLabel>
                            <FormDescription>
                              Do you want to adjust the cost in bulk?
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
                </div>
              </div>
            )}

            {/* Dimensions Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">Dimensions</h2>
                <p className="text-sm text-muted-foreground">
                  Specify the dimensions of your product.
                </p>
              </div>

              {/* Fields here */}
              <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Length
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              className="pr-12"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              cm
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Length of the product in cm.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="breadth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Breadth
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              className="pr-12"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              cm
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Breadth of the product in cm.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2 lg:col-span-1">
                        <FormLabel className="text-sm font-medium">
                          Height
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="e.g., 10"
                              className="pr-12"
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(
                                  value === "" ? undefined : Number(value)
                                );
                              }}
                              value={field.value}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              cm
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Height of the product in cm.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel className="text-sm font-medium">
                        Weight
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="e.g., 10"
                            className="pr-12"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === "" ? undefined : Number(value)
                              );
                            }}
                            value={field.value}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            kg
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        Weight of the product in kg.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* New Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Additional Details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Specify additional details about your product.
                </p>
              </div>

              {/* Fields here */}
              <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <FormField
                    control={form.control}
                    name="country_of_origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Origin</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter country of origin"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Specify the country of origin for your product.
                        </FormDescription>
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
                          <Input placeholder="Enter HSN code" {...field} />
                        </FormControl>
                        <FormDescription>
                          Specify the HSN code for your product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="youtube_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter YouTube link" {...field} />
                      </FormControl>
                      <FormDescription>
                        Specify the YouTube link for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem className="max-w-sm">
                      <FormLabel>Supplier ID</FormLabel>
                      <FormControl>
                        <Input
                          disabled
                          placeholder="Enter Supplier ID"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify the Supplier ID for your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Product Specification Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Product Specification
                </h2>
                <p className="text-sm text-muted-foreground">
                  Specify additional details about your product.
                </p>
              </div>

              {/* Fields here */}
              <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg space-y-4 lg:space-y-6">
                {specifications.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.spec_name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specification Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Color" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.spec_value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Red" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`specifications.${index}.spec_unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., cm, kg (optional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end sm:justify-start lg:justify-end">
                      {specifications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSpec(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">Remove</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendSpec({
                    spec_name: "",
                    spec_value: "",
                    spec_unit: "",
                  })
                }
                className="flex items-center gap-2 w-full"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Add Another Specification
                </span>
                <span className="sm:hidden">Add Specification</span>
              </Button>
            </div>

            {/* Tags Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-lg lg:text-xl font-semibold">
                  Product Tags
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add up to 5 tags to help customers find your product easily.
                </p>
              </div>

              <div className="p-3 lg:p-4 bg-muted/50 border rounded-lg space-y-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {/* Selected Tags Display */}
                          {field.value && field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1 pr-1 text-xs"
                                >
                                  <Tag className="w-3 h-3" />
                                  <span className="max-w-[120px] truncate">
                                    {tag}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                                    onClick={() => handleTagRemove(tag)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Tag Input with Autocomplete */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                placeholder="Type to search or add new tags..."
                                value={tagInput}
                                onChange={(e) => {
                                  setTagInput(e.target.value);
                                  setIsTagPopoverOpen(
                                    e.target.value.length > 0
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (tagInput.trim()) {
                                      handleTagAdd(tagInput);
                                    }
                                  }
                                  if (e.key === "Escape") {
                                    setIsTagPopoverOpen(false);
                                  }
                                }}
                                onFocus={() => {
                                  if (tagInput.length > 0) {
                                    setIsTagPopoverOpen(true);
                                  }
                                }}
                                className="pr-10"
                              />
                              <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                              {/* Autocomplete Dropdown */}
                              {isTagPopoverOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                  {/* Existing tags */}
                                  {filteredTags.length > 0 && (
                                    <div className="p-2">
                                      <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                                        Existing Tags
                                      </div>
                                      {filteredTags.map((tag) => {
                                        const isSelected =
                                          field.value?.includes(tag.name) ||
                                          false;
                                        return (
                                          <button
                                            key={tag.id}
                                            type="button"
                                            className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm ${
                                              isSelected
                                                ? "bg-accent text-muted-foreground"
                                                : "text-popover-foreground"
                                            }`}
                                            onClick={() => {
                                              if (!isSelected) {
                                                handleTagAdd(tag.name);
                                              }
                                            }}
                                            disabled={isSelected}
                                          >
                                            <Tag className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">
                                              {tag.name}
                                            </span>
                                            {isSelected && (
                                              <Check className="w-3 h-3 ml-auto flex-shrink-0" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {/* Add new tag option */}
                                  {tagInput.trim() && sanitizeTag(tagInput) && (
                                    <div className="border-t border-border p-2">
                                      <button
                                        type="button"
                                        className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-primary"
                                        onClick={() => handleTagAdd(tagInput)}
                                      >
                                        <Plus className="w-3 h-3 flex-shrink-0" />
                                        <span className="truncate">
                                          Add "{sanitizeTag(tagInput)}"
                                        </span>
                                      </button>
                                    </div>
                                  )}

                                  {filteredTags.length === 0 &&
                                    !tagInput.trim() && (
                                      <div className="p-4 text-sm text-muted-foreground text-center">
                                        Start typing to search or create tags
                                      </div>
                                    )}

                                  {filteredTags.length === 0 &&
                                    tagInput.trim() &&
                                    !sanitizeTag(tagInput) && (
                                      <div className="p-4 text-sm text-muted-foreground text-center">
                                        Invalid tag format. Use letters,
                                        numbers, spaces, and hyphens only.
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (tagInput.trim()) {
                                  handleTagAdd(tagInput);
                                }
                              }}
                              disabled={
                                !tagInput.trim() || !sanitizeTag(tagInput)
                              }
                              className="px-3 flex-shrink-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add relevant tags to help customers discover your
                        product. Tags will be automatically formatted
                        (lowercase, hyphen-separated).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tag Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Tag Guidelines</p>
                      <ul className="text-xs space-y-1">
                        <li>
                          • Use descriptive keywords that customers might search
                          for
                        </li>
                        <li>
                          • Tags are automatically formatted (e.g., "Mobile
                          Phone" → "mobile-phone")
                        </li>
                        <li>• Maximum 5 tags per product</li>
                        <li>• Avoid duplicate or overly similar tags</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 pt-4">
              <Button
                type="reset"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => form.reset()}
                className="order-2 sm:order-1"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="order-1 sm:order-2"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
