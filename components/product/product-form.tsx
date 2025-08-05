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
import { Info, Plus, Trash } from "lucide-react";
import { Switch } from "../ui/switch";

type BusinessSchema =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];
type CategorySchema = Database["public"]["Tables"]["categories"]["Row"];

export const ProductForm = ({
  business,
  categories,
}: {
  business: BusinessSchema;
  categories: CategorySchema[];
}) => {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: business.business_name,
      categoryId: "",
      subCategoryId: "",
      tiers: [
        {
          qty: 1,
          price: 0,
          isActive: true,
          length: 0,
          breadth: 0,
          height: 0,
          weight: 0,
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

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const selectedCategoryId = form.watch("categoryId");

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <p className="text-sm text-muted-foreground">
                  Provide basic details about the product.
                </p>
              </div>
              <div className="space-y-8 bg-muted/50 border rounded-lg p-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
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
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product features, specifications, and benefits (10-500 characters)"
                          {...field}
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
                      <FormLabel>Brand</FormLabel>
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
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
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
                      <FormLabel>Sub-Category</FormLabel>
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

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold">
                  Pricings, Quantity and Dimensions
                </h2>
                <p className="text-sm text-muted-foreground">
                  Specify the pricing, quantity and dimensions for each tier.
                </p>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative border rounded-lg p-4 bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Pricing Tier {index + 1}
                        </h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.qty`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Total Quantity
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
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
                                Total Price
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-8"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                    value={field.value}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Total price charged for this quantity.
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
                      <div className="grid grid-cols-2 gap-2 mt-6">
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.length`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Length
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                    value={field.value}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    cm
                                  </span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Length of the product in the specified cm.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.breadth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Breadth
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                    value={field.value}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    cm
                                  </span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Breadth of the product in the specified cm.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.height`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-sm font-medium">
                                Height
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                    value={field.value}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    cm
                                  </span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Height of the product in the specified cm.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`tiers.${index}.weight`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-sm font-medium">
                                Weight
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 10"
                                    className="pr-12"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                    value={field.value}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    kg
                                  </span>
                                </div>
                              </FormControl>
                              <FormDescription className="text-xs">
                                Weight of the product in the specified cm.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
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
                        price: 0,
                        length: 0,
                        breadth: 0,
                        height: 0,
                        weight: 0,
                      })
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Pricing Tier
                  </Button>

                  {fields.length === 0 && (
                    <Button
                      type="button"
                      onClick={() =>
                        append({
                          qty: 1,
                          price: 0,
                          length: 0,
                          breadth: 0,
                          height: 0,
                          weight: 0,
                        })
                      }
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Pricing Tier
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

            {/* New Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Inventory</h2>
                <p className="text-sm text-muted-foreground">
                  Specify the inventory details for your product.
                </p>
              </div>

              <div className="p-4 bg-muted/50 border rounded-lg">
                <FormField
                  control={form.control}
                  name="sample_available"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Sample Availability</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Specify whether the product is available for sample
                        purchases.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4 bg-muted/50 border rounded-lg">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Product Active</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </div>
                      <FormDescription>
                        Specify whether the product is active or inactive.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* New Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Additional Details</h2>
                <p className="text-sm text-muted-foreground">
                  Specify additional details about your product.
                </p>
              </div>

              {/* Fields here */}
              <div className="p-4 bg-muted/50 border rounded-lg space-y-6">
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
                    <FormItem>
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

            {/* New Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Product Specification</h2>
                <p className="text-sm text-muted-foreground">
                  Specify additional details about your product.
                </p>
              </div>

              {/* Fields here */}
              <div className="p-4 bg-muted/50 border rounded-lg space-y-6">
                {specifications.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
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
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Specification
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="reset"
                variant="outline"
                disabled={form.formState.isSubmitting}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
