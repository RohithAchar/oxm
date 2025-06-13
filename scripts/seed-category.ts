// scripts/seed-categories.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Devices, gadgets and accessories",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, footwear and accessories",
  },
  {
    name: "Groceries",
    slug: "groceries",
    description: "Daily essentials and food items",
  },
  {
    name: "Books",
    slug: "books",
    description: "Books, novels, and educational material",
  },
  {
    name: "Furniture",
    slug: "furniture",
    description: "Home and office furniture",
  },
];

async function seed() {
  const { data, error } = await supabase
    .from("categories")
    .insert(categories)
    .select();

  if (error) {
    console.error("Error inserting categories:", error);
  } else {
    console.log("Inserted categories:", data);
  }
}

seed();
