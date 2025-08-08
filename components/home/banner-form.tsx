"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BannerFormSchema } from "@/app/(admin)/admin/banner/types";
import { z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Image as ImageIcon,
  Link,
  Monitor,
  Smartphone,
  Eye,
  Upload,
  Power,
} from "lucide-react";
import { createBanner } from "@/lib/controller/home/banner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const BannerForm = () => {
  const [imagePreview, setImagePreview] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof BannerFormSchema>>({
    resolver: zodResolver(BannerFormSchema) as any,
    defaultValues: {
      title: "",
      alt_text: "",
      is_active: true,
      link_url: "",
      start_at: "",
      end_at: "",
      image: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof BannerFormSchema>) => {
    await createBanner(values);
    form.reset();
    toast.success("Banner created successfully");
    router.push("/admin/banner");
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const watchedValues = form.watch();

  return (
    <div className="grid lg:grid-cols-2 gap-8 pb-24 md:pb-0">
      {/* Form Section */}
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-md">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Create Banner</CardTitle>
                <CardDescription>
                  Configure your banner settings and content
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Media</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
                            <Input
                              type="file"
                              accept="image/*"
                              className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                field.onChange(file);
                                handleImageChange(file);
                              }}
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                              Upload a banner image (max 500KB). Recommended:
                              1200x400px
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Content Section */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Content
                  </h3>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter compelling banner title"
                              className="text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed as the main heading
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alt_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alt Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the banner image for accessibility"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Important for SEO and accessibility
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Link & Status Section */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    Link & Status
                  </h3>
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="link_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com or /internal-path"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Where users will go when they click the banner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem>
                          <Card
                            className={`transition-colors ${
                              field.value
                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                                : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                            }`}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Power
                                    className={`h-4 w-4 ${
                                      field.value
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  />
                                  <div>
                                    <FormLabel className="text-base font-medium">
                                      Banner Status
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      {field.value
                                        ? "Banner is active and visible"
                                        : "Banner is inactive and hidden"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      field.value ? "default" : "secondary"
                                    }
                                  >
                                    {field.value ? "Active" : "Inactive"}
                                  </Badge>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </div>
                              </div>
                              <FormMessage />
                            </CardContent>
                          </Card>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Schedule Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">Schedule</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Start Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>
                            When the banner becomes active
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_at"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            End Date & Time
                          </FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormDescription>
                            When the banner stops showing
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    Create Banner
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-md">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Live Preview</CardTitle>
                <CardDescription>
                  See how your banner will appear to users
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="desktop" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="desktop"
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="desktop" className="mt-6">
                <div className="border rounded-lg overflow-hidden bg-background">
                  <div className="p-4 bg-muted/20 border-b">
                    <p className="text-sm font-medium text-muted-foreground">
                      Desktop View (1200px+)
                    </p>
                  </div>
                  <div className="relative aspect-[3/1] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={watchedValues.alt_text || "Banner preview"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            No image selected
                          </p>
                        </div>
                      </div>
                    )}
                    {watchedValues.title && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
                            {watchedValues.title}
                          </h2>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="mt-6">
                <div className="border rounded-lg overflow-hidden bg-background max-w-sm mx-auto">
                  <div className="p-4 bg-muted/20 border-b">
                    <p className="text-sm font-medium text-muted-foreground text-center">
                      Mobile View (768px-)
                    </p>
                  </div>
                  <div className="relative aspect-[4/3] bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={watchedValues.alt_text || "Banner preview"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No image
                          </p>
                        </div>
                      </div>
                    )}
                    {watchedValues.title && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center p-4">
                        <div className="text-center text-white">
                          <h2 className="text-xl font-bold mb-2 drop-shadow-lg">
                            {watchedValues.title}
                          </h2>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Status indicators */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={watchedValues.is_active ? "default" : "secondary"}
                >
                  {watchedValues.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {watchedValues.start_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starts:</span>
                  <span className="font-medium">
                    {new Date(watchedValues.start_at).toLocaleString()}
                  </span>
                </div>
              )}
              {watchedValues.end_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ends:</span>
                  <span className="font-medium">
                    {new Date(watchedValues.end_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
