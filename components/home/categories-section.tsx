import Link from "next/link";
import { Suspense } from "react";
import { getCategoriesWithChildren } from "@/lib/controller/categories/categoriesOperation";
import {
  Leaf,
  Headphones,
  Coffee,
  Building,
  Heart,
  Gem,
  Cog,
  Archive,
  User,
  Shirt,
  Dumbbell,
  Car,
  Package,
  Wrench,
  Baby,
  Home,
  ChevronRight,
  Zap,
  Utensils,
  Lightbulb,
  Smartphone,
  Printer,
  PawPrint,
  BookOpen,
  Watch,
  ShoppingBag,
  Scissors,
  Truck,
  Footprints,
  Gift,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { H2 } from "@/components/ui/h2";
import { P } from "@/components/ui/p";

// Icon mapping for categories based on actual database categories
const categoryIcons: Record<string, any> = {
  "Apparel & Garments": Shirt,
  "Eco-Friendly Products": Leaf,
  "Health & Fitness": Dumbbell,
  "Home & Kitchen Products": Utensils,
  "Kitchen Appliances": Zap,
  "Lighting & Electricals": Lightbulb,
  "Mobile & Tech Accessories": Smartphone,
  "Packaging & Printing": Printer,
  "Pet Supplies": PawPrint,
  "Stationery & Office Supplies": BookOpen,
  "Watches & Smart Carriers": Watch,
  "Bags, Wallets & Fashion Accessories": ShoppingBag,
  "Beauty Tools & Grooming Essentials": Scissors,
  "Vehicle Accessories": Car,
  Footwear: Footprints,
  "Toys, Gifts & Decor": Gift,
};

// Function to get icon based on category name or keywords
const getCategoryIcon = (categoryName: string) => {
  // First try exact match
  if (categoryIcons[categoryName]) {
    return categoryIcons[categoryName];
  }

  // Then try keyword matching
  const name = categoryName.toLowerCase();

  if (
    name.includes("apparel") ||
    name.includes("garment") ||
    name.includes("clothing")
  )
    return Shirt;
  if (name.includes("eco") || name.includes("environment")) return Leaf;
  if (
    name.includes("health") ||
    name.includes("fitness") ||
    name.includes("sport")
  )
    return Dumbbell;
  if (name.includes("home") || name.includes("kitchen")) return Utensils;
  if (name.includes("appliance") || name.includes("electric")) return Zap;
  if (name.includes("light") || name.includes("electrical")) return Lightbulb;
  if (
    name.includes("mobile") ||
    name.includes("tech") ||
    name.includes("phone")
  )
    return Smartphone;
  if (name.includes("packaging") || name.includes("printing")) return Printer;
  if (name.includes("pet") || name.includes("animal")) return PawPrint;
  if (name.includes("stationery") || name.includes("office")) return BookOpen;
  if (name.includes("watch") || name.includes("smart")) return Watch;
  if (
    name.includes("bag") ||
    name.includes("wallet") ||
    name.includes("fashion")
  )
    return ShoppingBag;
  if (name.includes("beauty") || name.includes("grooming")) return Scissors;
  if (name.includes("vehicle") || name.includes("car")) return Car;
  if (name.includes("footwear") || name.includes("shoe")) return Footprints;
  if (name.includes("toy") || name.includes("gift") || name.includes("decor"))
    return Gift;

  // Default fallback
  return Package;
};

// Fallback icon for categories without specific mapping
const DefaultIcon = Package;

const CategoryCard = ({ category }: { category: any }) => {
  const IconComponent = getCategoryIcon(category.name);

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background whitespace-nowrap text-sm shrink-0 hover:bg-muted/50 transition-colors">
        <IconComponent className="h-4 w-4 text-foreground/70" />
        <span className="text-foreground">{category.name}</span>
      </div>
    </Link>
  );
};

const CategoriesGrid = async () => {
  const categories = await getCategoriesWithChildren();

  // Limit to first 12 categories for the grid
  const displayCategories = categories.slice(0, 12);

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {displayCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

const CategoriesSectionSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background animate-pulse"
        >
          <div className="h-4 w-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      ))}
    </div>
  );
};

const CategoriesSection = () => {
  return (
    <section className="py-8 md:pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <H2 className="text-lg sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
            Browse Categories
          </H2>
          <P className="text-sm sm:text-base text-center">
            Explore products across diverse categories from verified suppliers
          </P>
        </div>

        <Suspense fallback={<CategoriesSectionSkeleton />}>
          <CategoriesGrid />
        </Suspense>

        <div className="text-center mt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-background text-sm hover:bg-muted/50 transition-colors"
          >
            View All Products
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
