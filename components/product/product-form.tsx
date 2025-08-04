"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
    },
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
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <p className="text-sm text-muted-foreground">
                  Provide basic details about the product.
                </p>
              </div>

              {/* Fields here */}
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
                      Choose the main category that best describes your product.
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

            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold">Basic Information 2</h2>
                <p className="text-sm text-muted-foreground">
                  Provide basic details about the product.
                </p>
              </div>

              {/* Fields here */}
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
