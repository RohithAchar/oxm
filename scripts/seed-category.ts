// scripts/seed-categories
import { createClient } from "@supabase/supabase-js";

type category = {
  name: string;
  slug: string;
  parent_id: number | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Categories data with parent-child structure
const categoriesData = [
  // Parent categories
  {
    name: "Apparel & Garments",
    slug: "apparel-garments",
    parent_id: null,
    children: [
      "T-Shirts (Men / Women / Unisex)",
      "Oversized / Streetwear",
      "Shirts (Casual / Formal)",
      "Hoodies / Sweatshirts",
      "Jeans / Trousers / Joggers",
      "Nightwear / Loungewear",
      "Kurtis / Ethnic Tops (Women)",
      "Dresses / One Piece (Women)",
      "Co-ord Sets / Two-piece Sets",
      "Plus Size Clothing",
      "Kids Wear (Boys / Girls)",
      "Activewear / Gym Wear",
    ],
  },
  {
    name: "Eco-Friendly Products",
    slug: "eco-friendly-products",
    parent_id: null,
    children: [
      "Bamboo Toothbrushes / Wooden Combs",
      "Reusable Water Bottles / Cups",
      "Jute Bags / Cotton Tote Bags",
      "Biodegradable Cutlery & Straws",
      "Cloth Sanitary Pads / Reusable Diapers",
      "Beeswax Wraps / Reusable Kitchen Towels",
      "Plantable Stationery",
    ],
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    parent_id: null,
    children: [
      "Yoga Mats & Accessories",
      "Fitness Equipment",
      "Activewear & Gymwear (Men & Women)",
      "Massage & Recovery Tools",
      "Sports & Outdoor Gear",
      "Reusable Bottles & Shakers",
    ],
  },
  {
    name: "Home & Kitchen Products",
    slug: "home-kitchen-products",
    parent_id: null,
    children: [
      "Cookware & Kitchen Tools",
      "Storage Containers & Organizers",
      "Reusable Food Wraps & Covers",
      "Cleaning Tools & Mops",
      "Water Bottles & Jars",
      "Lunch Boxes / Tiffin Carriers",
    ],
  },
  {
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    parent_id: null,
    children: [
      "Electric Kettles",
      "Hand Blenders",
      "Sandwich Makers",
      "Mixers & Grinders",
      "Juicers",
      "Egg Boilers",
      "Induction Cooktops",
      "Air Fryers",
    ],
  },
  {
    name: "Lighting & Electricals",
    slug: "lighting-electricals",
    parent_id: null,
    children: [
      "LED Bulbs",
      "Strip Lights",
      "Decorative Lamps",
      "Rechargeable Lights",
      "Extension Boards",
      "Power Strips with USB",
    ],
  },
  {
    name: "Mobile & Tech Accessories",
    slug: "mobile-tech-accessories",
    parent_id: null,
    children: [
      "Mobile Back Covers",
      "Charging Cables",
      "Power Banks",
      "Phone Holders & Stands",
      "Earphones (Wired & Wireless)",
      "Smartwatch Straps",
      "Screen Protectors",
    ],
  },
  {
    name: "Packaging & Printing",
    slug: "packaging-printing",
    parent_id: null,
    children: [
      "Corrugated Boxes",
      "Bubble Wraps",
      "Courier Bags",
      "Thank You Cards / Stickers",
      "Paper Bags",
      "Packaging Tapes",
    ],
  },
  {
    name: "Pet Supplies",
    slug: "pet-supplies",
    parent_id: null,
    children: [
      "Pet Clothes",
      "Feeding Bowls",
      "Pet Toys",
      "Leashes & Collars",
      "Pet Beds",
    ],
  },
  {
    name: "Stationery & Office Supplies",
    slug: "stationery-office-supplies",
    parent_id: null,
    children: [
      "Notebooks / Diaries",
      "Pens & Highlighters",
      "Sticky Notes & Organizers",
      "Desk Organizers",
      "Whiteboards & Boards",
      "Envelopes & Files",
    ],
  },
  {
    name: "Watches & Smart Carriers",
    slug: "watches-smart-carriers",
    parent_id: null,
    children: [
      "Smart Watches",
      "Analog/Digital Watches",
      "Smart Bands (Fitness)",
      "Watch Organizers",
      "Smart Key Trackers",
    ],
  },
  {
    name: "Bags, Wallets & Fashion Accessories",
    slug: "bags-wallets-fashion-accessories",
    parent_id: null,
    children: [
      "Sling Bags",
      "Tote Bags",
      "Backpacks",
      "Travel Organizers",
      "Wallets & Card Holders",
      "Fashion Belts",
      "Hairbands / Scrunchies",
      "Sunglasses",
    ],
  },
  {
    name: "Beauty Tools & Grooming Essentials",
    slug: "beauty-tools-grooming-essentials",
    parent_id: null,
    children: [
      "Makeup Brushes & Blenders",
      "Hair Dryers & Straighteners",
      "Beard Trimmers & Grooming Kits",
      "Facial Rollers & Massagers",
      "Beauty Organizers & Storage Boxes",
      "Compact Mirrors & LED Makeup Mirrors",
      "Scalp Massagers",
    ],
  },
  {
    name: "Vehicle Accessories",
    slug: "vehicle-accessories",
    parent_id: null,
    children: [
      "Phone Mounts",
      "Car Vacuum Cleaners",
      "Seat Organizers",
      "Car Perfumes",
      "Steering Wheel Covers",
      "LED Car Lights",
    ],
  },
  {
    name: "Footwear",
    slug: "footwear",
    parent_id: null,
    children: [
      "Sneakers",
      "Slides / Flip-flops",
      "Sports Shoes",
      "Formal Shoes",
      "Kids Footwear",
      "Women's Heels / Sandals",
    ],
  },
  {
    name: "Toys, Gifts & Decor",
    slug: "toys-gifts-decor",
    parent_id: null,
    children: [
      "Soft Toys & Plushies",
      "Educational Toys",
      "DIY Craft Kits",
      "LED Room Decor",
      "Customized Gifts",
      "Scented Candles & Diffusers",
    ],
  },
];

async function seed() {
  try {
    console.log("Starting category seeding...");

    // Clear existing data (optional - remove if you want to keep existing data)
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .neq("id", 0); // This deletes all records

    if (deleteError) {
      console.log("Note: Could not clear existing data:", deleteError.message);
    }

    // First, insert all parent categories
    const parentCategories = categoriesData.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      parent_id: null,
    }));

    const { data: parentData, error: parentError } = await supabase
      .from("categories")
      .insert(parentCategories)
      .select();

    if (parentError) {
      throw new Error(
        `Error inserting parent categories: ${parentError.message}`
      );
    }

    console.log(`Inserted ${parentData.length} parent categories`);

    // Create a map of parent names to their IDs
    const parentMap = new Map();
    parentData.forEach((parent) => {
      parentMap.set(parent.name, parent.id);
    });

    // Now insert all child categories
    const childCategories: category[] = [];
    categoriesData.forEach((parentCat) => {
      const parentId = parentMap.get(parentCat.name);
      parentCat.children.forEach((childName) => {
        childCategories.push({
          name: childName,
          slug: generateSlug(childName),
          parent_id: parentId,
        });
      });
    });

    const { data: childData, error: childError } = await supabase
      .from("categories")
      .insert(childCategories)
      .select();

    if (childError) {
      throw new Error(
        `Error inserting child categories: ${childError.message}`
      );
    }

    console.log(`Inserted ${childData.length} child categories`);
    console.log("Category seeding completed successfully!");

    // Display summary
    console.log("\n=== SEEDING SUMMARY ===");
    console.log(`Total parent categories: ${parentData.length}`);
    console.log(`Total child categories: ${childData.length}`);
    console.log(`Total categories: ${parentData.length + childData.length}`);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

// Run the seeding function
seed();
