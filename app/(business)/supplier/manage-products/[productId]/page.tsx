import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Package,
  Ruler,
  Weight,
  Globe,
  Tag,
  Building,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  supplier_id: string | null;
  category_id: string | null;
  name: string;
  description: string;
  sample_price: number;
  minimum_order_quantity: number;
  is_sample_available: boolean;
  is_active: boolean;
  weight: number | null;
  length: number | null;
  breadth: number | null;
  height: number | null;
  hsn_code: string | null;
  brand: string | null;
  country_of_origin: string | null;
  subcategory_id: string | null;
  youtube_link: string | null;
  created_at: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone_number: number | null;
}

interface SupplierBusiness {
  id: string;
  business_name: string;
  gst_number: string;
  business_address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  is_verified: boolean;
}

interface PageProps {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProductView = async ({ params }: PageProps) => {
  const supabase = await createClient();
  const { productId } = await params;

  // Check authentication
  const { data: res, error: userError } = await supabase.auth.getUser();

  if (userError || !res.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-medium mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-4">
              Please login to view product details
            </p>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!productId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-medium mb-2">Invalid Product</h2>
            <p className="text-gray-600">Product ID not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  try {
    // Fetch product data
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-medium mb-2">Product Not Found</h2>
              <p className="text-gray-600">
                The requested product could not be found
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Fetch related data in parallel
    const [
      { data: supplier },
      { data: supplierBusiness },
      { data: category },
      { data: subcategory },
      { data: productImages },
    ] = await Promise.all([
      product.supplier_id
        ? supabase
            .from("profiles")
            .select("*")
            .eq("id", product.supplier_id)
            .single()
        : { data: null },
      product.supplier_id
        ? supabase
            .from("supplier_businesses")
            .select("*")
            .eq("profile_id", product.supplier_id)
            .single()
        : { data: null },
      product.category_id
        ? supabase
            .from("categories")
            .select("*")
            .eq("id", product.category_id)
            .single()
        : { data: null },
      product.subcategory_id
        ? supabase
            .from("categories")
            .select("*")
            .eq("id", product.subcategory_id)
            .single()
        : { data: null },
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("display_order", { ascending: true }),
    ]);

    const typedProduct = product as Product;
    const typedSupplier = supplier as Profile;
    const typedSupplierBusiness = supplierBusiness as SupplierBusiness;
    const typedCategory = category as Category;
    const typedSubcategory = subcategory as Category;
    const typedProductImages = productImages as ProductImage[];

    // Image Gallery Component
    const ImageGallery = () => {
      const images = typedProductImages || [];
      const hasImages = images.length > 0;

      if (!hasImages) {
        return (
          <div className="bg-white rounded-lg overflow-hidden">
            <AspectRatio ratio={1}>
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-400" />
              </div>
            </AspectRatio>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-lg overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id}>
                  <AspectRatio ratio={1}>
                    <Image
                      src={image.image_url}
                      alt={`${typedProduct.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Navigation */}
          <div className="mb-8">
            <nav className="text-sm text-gray-600">
              <Link href="/products" className="hover:text-gray-900">
                Products
              </Link>
              {typedCategory && (
                <>
                  <span className="mx-2">→</span>
                  <span>{typedCategory.name}</span>
                </>
              )}
              {typedSubcategory && (
                <>
                  <span className="mx-2">→</span>
                  <span>{typedSubcategory.name}</span>
                </>
              )}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ImageGallery />

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={typedProduct.is_active ? "default" : "secondary"}
                  >
                    {typedProduct.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {typedProduct.is_sample_available && (
                    <Badge variant="outline">Sample Available</Badge>
                  )}
                </div>

                <h1 className="text-3xl font-medium mb-2">
                  {typedProduct.name}
                </h1>

                {typedProduct.brand && (
                  <p className="text-gray-600 mb-4">by {typedProduct.brand}</p>
                )}

                <div className="text-2xl font-medium text-gray-900 mb-4">
                  ₹{typedProduct.sample_price.toLocaleString()}{" "}
                  <span className="text-base font-normal text-gray-600">
                    sample price
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {typedProduct.description}
                </p>
              </div>

              {/* Product Specifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specifications</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Min. Order Quantity
                      </p>
                      <p className="font-medium">
                        {typedProduct.minimum_order_quantity.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {typedProduct.weight && (
                    <div className="flex items-center gap-3">
                      <Weight className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-medium">{typedProduct.weight} kg</p>
                      </div>
                    </div>
                  )}

                  {(typedProduct.length ||
                    typedProduct.breadth ||
                    typedProduct.height) && (
                    <div className="flex items-center gap-3">
                      <Ruler className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Dimensions</p>
                        <p className="font-medium">
                          {typedProduct.length || "-"} ×{" "}
                          {typedProduct.breadth || "-"} ×{" "}
                          {typedProduct.height || "-"} cm
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Country of Origin</p>
                      <p className="font-medium">
                        {typedProduct.country_of_origin || "India"}
                      </p>
                    </div>
                  </div>

                  {typedProduct.hsn_code && (
                    <div className="flex items-center gap-3">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">HSN Code</p>
                        <p className="font-medium">{typedProduct.hsn_code}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* YouTube Link */}
              {typedProduct.youtube_link && (
                <div>
                  <Button variant="outline" asChild>
                    <Link
                      href={typedProduct.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Watch Product Video
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Supplier Information */}
          <div className="mt-12">
            <Separator className="mb-8" />

            <div className="bg-white rounded-lg p-8">
              <h2 className="text-2xl font-medium mb-6">
                Supplier Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Business Name</p>
                      <p className="font-medium">
                        {typedSupplierBusiness?.business_name ||
                          "Not available"}
                      </p>
                    </div>
                  </div>

                  {typedSupplier?.full_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {typedSupplier.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact Person</p>
                        <p className="font-medium">{typedSupplier.full_name}</p>
                      </div>
                    </div>
                  )}

                  {typedSupplier?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{typedSupplier.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {typedSupplierBusiness?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {typedSupplierBusiness.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {typedSupplierBusiness?.business_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">
                          {typedSupplierBusiness.business_address}
                          <br />
                          {typedSupplierBusiness.city},{" "}
                          {typedSupplierBusiness.state}{" "}
                          {typedSupplierBusiness.pincode}
                        </p>
                      </div>
                    </div>
                  )}

                  {typedSupplierBusiness?.is_verified && (
                    <div className="flex items-center gap-2">
                      <Badge variant="default">✓ Verified Supplier</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-medium mb-2">Error Loading Product</h2>
            <p className="text-gray-600 mb-4">
              Something went wrong while loading the product details
            </p>
            <Button asChild variant="outline">
              <Link href="/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default ProductView;
