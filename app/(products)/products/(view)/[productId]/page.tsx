// // app/(products)/products/[productId]/page.tsx

// import { Metadata } from "next";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { createClient } from "@/utils/supabase/server";
// import { Tables } from "@/utils/supabase/database.types";
// import Link from "next/link";
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import {
//   ShoppingCart,
//   Package,
//   Globe,
//   Truck,
//   Star,
//   Shield,
//   Play,
//   Info,
//   CheckCircle,
// } from "lucide-react";

// import RecentlyViewedTracker from "@/components/recently-viewed-tracker";

// interface PageProps {
//   params: Promise<{ productId: string }>;
//   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// type Product = Tables<"products">;
// type ProductImage = Tables<"product_images">;
// type Category = Tables<"categories">;
// type Profile = Tables<"profiles">;
// type ProductTierPricing = Tables<"product_tier_pricing">;

// interface ProductWithRelations extends Product {
//   product_images: ProductImage[];
//   category: Category | null;
//   subcategory: Category | null;
//   supplier: Profile | null;
//   product_tier_pricing: ProductTierPricing[];
// }

// export async function generateMetadata({
//   params,
// }: PageProps): Promise<Metadata> {
//   const supabase = await createClient();
//   const { productId } = await params;

//   const { data: product, error: productError } = await supabase
//     .from("products")
//     .select("*, product_images(id, image_url)")
//     .eq("id", productId)
//     .eq("is_active", true)
//     .single();

//   if (!product) {
//     notFound(); // same as your page
//   }

//   if (productError) {
//     notFound(); // same as your page
//   }

//   return {
//     title: `${product.name} – OpenXmart`,
//     description:
//       product.description ||
//       "View product details and request a sample on OpenXmart.",
//     openGraph: {
//       title: `${product.name} – OpenXmart`,
//       description:
//         product.description ||
//         "View product details and request a sample on OpenXmart.",
//       images: [
//         {
//           url:
//             product.product_images?.[0]?.image_url ||
//             "/placeholder-product.jpg",
//           width: 1200,
//           height: 630,
//         },
//       ],
//     },
//   };
// }

// const ProductView = async ({ params }: PageProps) => {
//   const supabase = await createClient();
//   const { productId } = await params;

//   // Check authentication
//   const { data: res, error: userError } = await supabase.auth.getUser();

//   if (userError || !res.user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <Card className="w-full max-w-md shadow-sm">
//           <CardContent className="p-8 text-center">
//             <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//             <h2 className="text-xl font-medium mb-2">
//               Authentication Required
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Please login to view product details
//             </p>
//             <Button asChild className="w-full">
//               <Link href="/login">Login</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!productId) {
//     notFound();
//   }

//   // Fetch product with all related data
//   const { data: product, error: productError } = await supabase
//     .from("products")
//     .select(
//       `
//       *,
//       product_images (
//         id,
//         image_url,
//         display_order
//       ),
//       category:categories!products_category_id_fkey (
//         id,
//         name,
//         slug
//       ),
//       subcategory:categories!products_subcategory_id_fkey (
//         id,
//         name,
//         slug
//       ),
//       supplier:profiles!products_supplier_id_fkey (
//         id,
//         full_name,
//         avatar_url
//       ),
//       product_tier_pricing (
//         id,
//         quantity,
//         price,
//         is_active,
//         created_at
//       )
//     `
//     )
//     .eq("id", productId)
//     .eq("is_active", true)
//     .single();

//   if (productError || !product) {
//     notFound();
//   }

//   const typedProduct = product as ProductWithRelations;

//   // Sort images by display order
//   const sortedImages =
//     typedProduct.product_images?.sort(
//       (a, b) => (a.display_order || 0) - (b.display_order || 0)
//     ) || [];

//   const primaryImage = sortedImages[0]?.image_url || "/placeholder-product.jpg";

//   // Sort tier pricing by quantity and filter active ones
//   const sortedTierPricing =
//     typedProduct.product_tier_pricing
//       ?.filter((tier) => tier.is_active !== false)
//       ?.sort((a, b) => a.quantity - b.quantity) || [];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Navigation breadcrumb */}
//       <div className="border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <nav className="flex items-center space-x-2 text-sm">
//             <Link
//               href="/products"
//               className="text-blue-600 hover:text-blue-700"
//             >
//               Products
//             </Link>
//             <span className="text-gray-400">/</span>
//             {typedProduct.category && (
//               <>
//                 <Link
//                   href={`/products?category=${typedProduct.category.slug}`}
//                   className="text-blue-600 hover:text-blue-700"
//                 >
//                   {typedProduct.category.name}
//                 </Link>
//                 <span className="text-gray-400">/</span>
//               </>
//             )}
//             <span className="text-gray-700">{typedProduct.name}</span>
//           </nav>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="lg:grid lg:grid-cols-2 lg:gap-16">
//           {/* Product Images */}
//           <div className="mb-12 lg:mb-0">
//             <Carousel className="w-full">
//               <CarouselContent>
//                 {sortedImages.length > 0 ? (
//                   sortedImages.map((image, index) => (
//                     <CarouselItem key={image.id}>
//                       <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
//                         <Image
//                           src={image.image_url}
//                           alt={`${typedProduct.name} - Image ${index + 1}`}
//                           width={600}
//                           height={600}
//                           className="w-full h-full object-cover"
//                           priority={index === 0}
//                         />
//                       </div>
//                     </CarouselItem>
//                   ))
//                 ) : (
//                   <CarouselItem>
//                     <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden">
//                       <Image
//                         src={primaryImage}
//                         alt={typedProduct.name}
//                         width={600}
//                         height={600}
//                         className="w-full h-full object-cover"
//                         priority
//                       />
//                     </div>
//                   </CarouselItem>
//                 )}
//               </CarouselContent>
//               {sortedImages.length > 1 && (
//                 <>
//                   <CarouselPrevious className="left-4" />
//                   <CarouselNext className="right-4" />
//                 </>
//               )}
//             </Carousel>

//             {/* Image thumbnails */}
//             {sortedImages.length > 1 && (
//               <div className="grid grid-cols-4 gap-4 mt-6">
//                 {sortedImages.slice(0, 4).map((image, index) => (
//                   <div
//                     key={image.id}
//                     className="aspect-square bg-gray-50 rounded-lg overflow-hidden"
//                   >
//                     <Image
//                       src={image.image_url}
//                       alt={`${typedProduct.name} - Thumbnail ${index + 1}`}
//                       width={150}
//                       height={150}
//                       className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Details */}
//           <div className="lg:pl-8">
//             <div className="mb-6">
//               <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-2">
//                 {typedProduct.name}
//               </h1>

//               {typedProduct.brand && (
//                 <p className="text-lg text-gray-600 mb-4">
//                   by {typedProduct.brand}
//                 </p>
//               )}

//               <div className="flex items-center gap-4 mb-6">
//                 <div className="flex items-center gap-1">
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                   <Star className="h-4 w-4 text-gray-300" />
//                   <span className="text-sm text-gray-600 ml-2">4.0</span>
//                 </div>

//                 {typedProduct.is_active && (
//                   <Badge
//                     variant="secondary"
//                     className="bg-green-50 text-green-700"
//                   >
//                     <CheckCircle className="h-3 w-3 mr-1" />
//                     Available
//                   </Badge>
//                 )}
//               </div>

//               {/* Tier Pricing */}
//               {sortedTierPricing.length > 0 && (
//                 <div className="mb-8">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Tier Pricing
//                   </h3>
//                   <div className="space-y-3">
//                     {sortedTierPricing.map((tier, index) => (
//                       <div
//                         key={tier.id}
//                         className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
//                             {index + 1}
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {tier.quantity.toLocaleString()} units
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               {tier.quantity === 1
//                                 ? "Minimum order"
//                                 : "Bulk pricing"}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-light text-gray-900">
//                             ₹{tier.price.toLocaleString()}
//                           </p>
//                           <p className="text-sm text-gray-600">per unit</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Product Actions */}
//             <div className="space-y-4 mb-8">
//               <Button
//                 size="lg"
//                 className="w-full bg-blue-600 hover:bg-blue-700"
//               >
//                 <ShoppingCart className="h-5 w-5 mr-2" />
//                 Add to Cart
//               </Button>

//               <div className="grid grid-cols-2 gap-4">
//                 <Button variant="outline" size="lg">
//                   <Package className="h-5 w-5 mr-2" />
//                   Request Quote
//                 </Button>

//                 {typedProduct.youtube_link && (
//                   <Button variant="outline" size="lg" asChild>
//                     <Link href={typedProduct.youtube_link} target="_blank">
//                       <Play className="h-5 w-5 mr-2" />
//                       Watch Video
//                     </Link>
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* Product Information */}
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-4">
//                   Description
//                 </h3>
//                 <p className="text-gray-600 leading-relaxed">
//                   {typedProduct.description}
//                 </p>
//               </div>

//               <Separator />

//               <div className="grid grid-cols-1 gap-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">
//                       Minimum Order
//                     </h4>
//                     <p className="text-gray-600">
//                       {typedProduct.product_tier_pricing[0].quantity} units
//                     </p>
//                   </div>

//                   {typedProduct.country_of_origin && (
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-2">Origin</h4>
//                       <div className="flex items-center text-gray-600">
//                         <Globe className="h-4 w-4 mr-1" />
//                         {typedProduct.country_of_origin}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Dimensions */}
//                 {(typedProduct.length ||
//                   typedProduct.breadth ||
//                   typedProduct.height ||
//                   typedProduct.weight) && (
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">
//                       Specifications
//                     </h4>
//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       {typedProduct.length && (
//                         <div>
//                           <span className="text-gray-500">Length:</span>
//                           <span className="ml-2 text-gray-900">
//                             {typedProduct.length} cm
//                           </span>
//                         </div>
//                       )}
//                       {typedProduct.breadth && (
//                         <div>
//                           <span className="text-gray-500">Breadth:</span>
//                           <span className="ml-2 text-gray-900">
//                             {typedProduct.breadth} cm
//                           </span>
//                         </div>
//                       )}
//                       {typedProduct.height && (
//                         <div>
//                           <span className="text-gray-500">Height:</span>
//                           <span className="ml-2 text-gray-900">
//                             {typedProduct.height} cm
//                           </span>
//                         </div>
//                       )}
//                       {typedProduct.weight && (
//                         <div>
//                           <span className="text-gray-500">Weight:</span>
//                           <span className="ml-2 text-gray-900">
//                             {typedProduct.weight} kg
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* HSN Code */}
//                 {typedProduct.hsn_code && (
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-2">HSN Code</h4>
//                     <p className="text-gray-600 font-mono">
//                       {typedProduct.hsn_code}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               <Separator />

//               {/* Supplier Information */}
//               {typedProduct.supplier && (
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">
//                     Supplier
//                   </h3>
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
//                       {typedProduct.supplier.avatar_url ? (
//                         <Image
//                           src={typedProduct.supplier.avatar_url}
//                           alt={typedProduct.supplier.full_name || "Supplier"}
//                           width={48}
//                           height={48}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-gray-500 font-medium">
//                           {typedProduct.supplier.full_name?.charAt(0) || "S"}
//                         </span>
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {typedProduct.supplier.full_name || "Supplier"}
//                       </p>
//                       <p className="text-sm text-gray-600">Verified Supplier</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Shipping Info */}
//               <div className="bg-gray-50 rounded-xl p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <Truck className="h-5 w-5 text-gray-600" />
//                   <h4 className="font-medium text-gray-900">
//                     Shipping Information
//                   </h4>
//                 </div>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <p>• Free shipping on orders above ₹500</p>
//                   <p>• Estimated delivery: 5-7 business days</p>
//                   <p>• Bulk orders available with custom pricing</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <RecentlyViewedTracker
//         product={{
//           id: typedProduct.id,
//           name: typedProduct.name,
//           brand: typedProduct.brand,
//           image_url: primaryImage,
//           category: typedProduct.category,
//           supplier: typedProduct.supplier,
//           base_price: sortedTierPricing[0]?.price,
//         }}
//       />
//     </div>
//   );
// };

// export default ProductView;

const Page = () => {
  return <div>TODO</div>;
};

export default Page;
